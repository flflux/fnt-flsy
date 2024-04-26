import { ForbiddenException, NotFoundException, HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { Cron } from '@nestjs/schedule';
import { flfluxDto } from './flflux.dto';
import { MQTT_DOMAIN_MYGATE } from './env.consts';
import { Device, Card } from '@prisma/client';
import { SuperRole, OrganizationRole, PrismaClient, OrganizationRoleName, SuperRoleName } from '@prisma/client';
import {
  API_URL,
  DEVICE_SYNC_BATCH_SIZE,
  DEVICE_SYNC_CRON,
  MYGATE_API_KEY,
  MYGATE_API_URL,
  MYGATE_SYNC_CRON,
} from '../core/consts/env.consts';
import * as mqtt from 'mqtt';

import {
  MQTT_HTTP_PROTOCOL_MYGATE,
  MQTT_PASSWORD,
  MQTT_PORT_MYGATE,
  MQTT_USERNAME,
} from '../core/consts/env.consts';

import { MainFluxService } from '../mainflux/mainflux.service';
import { AccessSyncDto } from '../core/dto/access-sync.dto';
import { CardDto } from '../cards/dto/card.dto';
import { CommunicationService } from '../communication/communication.service';
import { AccessNotifyDto } from '../core/dto/access-notify.dto';

// import {
//   MyGateNotifyDto,
//   MyGateNotifyResponseDto,
//   MyGateSyncResponseDto,
// } from './dto/mygate.dto';


@Injectable()
export class FlfluxService {
  constructor(
    private mainFluxService: MainFluxService,
    private communicationService: CommunicationService,
  ) { }
  private prismaService = new PrismaClient();

  private connections: Map<string, any> = new Map();


  /*
  Scan the card table and create the sync message for the upserted card and deleted card 
  maintain the sync message state with the tables.
  */

  @Cron(DEVICE_SYNC_CRON, {
    name: 'deviceSyncMyGate',
  })
  async deviceSyncMyGate() {
    try {
      const devices = await this.prismaService.device.findMany({
        select: { id: true },
      });
      const deviceIds = devices.map((d) => d.id);
      // TODO: implement workers
      const promises: Promise<void>[] = [];
      for (const deviceId of deviceIds) {
        const promise = this.deviceSyncMyGateForDevice(deviceId);
        promises.push(promise);
      }
      await Promise.all(promises);
    } catch (e) {
      Logger.log('deviceSync', e);
    }
  }

  async deviceSyncMyGateForDevice(id: number) {
    await this.prismaService
      .$transaction(async (tx) => {
        const device = await tx.device.findFirst({
          where: { id: id, isActive: true },
          include: {
            // TODO : we need to remove vehicles from here..
            vehicles: {
              select: {
                vehicles: {
                  select: {
                    cards: true
                  }
                }
              }
            },
            deviceCards: true,
          },
        });

        const { deviceCards } = device;

        const vehicleCards = await tx.card.findMany({
          where: {
            deviceId: device.id,
            isActive: true
          }
        })

        // const vehicleCards = device.vehicles.map((vehicle): Card=>{
        //   return vehicle.vehicles.cards[0]
        // });

        const deviceCardsCardIds = deviceCards.map((c) => c.cardId);
        const vehicleCardsAccessDisplays = vehicleCards.map(
          (c) => c.number
        );

        //cards to be added 
        const toAdd = vehicleCardsAccessDisplays.filter(
          (c) => !deviceCardsCardIds.includes(c)
        );

        //cards to be deleted
        const toDelete = deviceCardsCardIds.filter(
          (c) => !vehicleCardsAccessDisplays.includes(c)
        );

        //if both of them are null stop operation and return
        if (toAdd.length === 0 && toDelete.length === 0) {
          return;
        }

        // now create batch for upserting cards
        const toAddBatch =
          toAdd.length > DEVICE_SYNC_BATCH_SIZE
            ? toAdd.slice(0, DEVICE_SYNC_BATCH_SIZE)
            : toAdd;

        // create batch for deleted cards
        const toDeleteBatch =
          toDelete.length > DEVICE_SYNC_BATCH_SIZE
            ? toDelete.slice(0, DEVICE_SYNC_BATCH_SIZE)
            : toDelete;

        // create sync token for the device.
        const syncToken = await this.sendDeviceSyncMessage(
          device,
          toAddBatch,
          toDeleteBatch
        );

        // sync message creation which will be stored inside the syncmessage
        const syncMessageCards: { cardId: string; status: 'ADD' | 'REMOVE' }[] =
          toAddBatch
            .map((c) => {
              return { cardId: c, status: 'ADD' } as {
                cardId: string;
                status: 'ADD' | 'REMOVE';
              };
            })
            .concat(
              toDeleteBatch.map((c) => {
                return { cardId: c, status: 'REMOVE' } as {
                  cardId: string;
                  status: 'ADD' | 'REMOVE';
                };
              })
            );

        // here perform the message creation with token.
        await tx.syncMessage.create({
          data: {
            deviceId: id,
            syncToken: syncToken,
            cards: {
              create: syncMessageCards,
            },
          },
        });

        console.log(
          'Add sync message for device',
          device.deviceId,
          syncToken,
          syncMessageCards
        );
      })
      .catch((e) => {
        Logger.log('deviceSyncMyGateForDevice', e);
      });
  }


  async sendDeviceSyncMessage(
    device: Device,
    toAdd: string[],
    toDelete: string[]
  ) {
    const syncToken = new Date().getTime();
    const accessSyncDto: AccessSyncDto = {
      st: String(syncToken),
      na: toAdd.length,
      a: toAdd,
      nr: toDelete.length,
      r: toDelete,
      t: 'HTTP',
      l: `${API_URL}/sync-ack/society/${device.societyId}/device/${device.deviceId}`,
    };
    await this.mainFluxService.connectAndPublishWithRetry(
      accessSyncDto,
      device.thingId,
      device.thingKey,
      device.channelId,
      'device-sync'
    );
    console.log('Sent sync message to device', device.deviceId, accessSyncDto);
    return String(syncToken);
  }



  @Cron(DEVICE_SYNC_CRON, {
    name: 'deviceSyncMQTT',
  })
  async deviceSyncMQTT() {
    try {
      const devices = await this.prismaService.device.findMany({});
      const toBeAdded = devices.filter((c) => !this.connections.has(c.thingId));
      console.log("toBe added .. :  ", toBeAdded);

      // TODO: implement workers

      for (const device of toBeAdded) {
        await this.addNewConnection(device.thingId, device.thingKey, device.channelId, `channels/${device.channelId}/messages/unique`)
      }

    } catch (e) {
      Logger.log('deviceSync', e);
    }
  }


  async addNewConnection(
    thingId: string,
    thingKey: string,
    channelId: string,
    topicName: string
  ) {
    const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;
    const mqttOptions = {
      clientId,
      clean: true,
      connectTimeout: 4000,
      username: thingId,
      password: thingKey,
      reconnectPeriod: 1000,

      // additional options can be added here
    };

    // Connect to the MQTT broker
    const client = mqtt.connect(`mqtt://${MQTT_DOMAIN_MYGATE}:${MQTT_PORT_MYGATE}`, mqttOptions);
    const subscriptionTopic = `channels/${channelId}/messages/mygate-notify`;

    // Handle incoming messages
    client.on('message', async (topic, message) => {
      const topic_res = topic.split("/")
      console.log(topic_res);
      console.log(`Received message on ${topic}: ${message.toString()}`); // Log the received message

      const channel_id = topic_res[1];

      const notifyTopic = topic_res[3];

      console.log(notifyTopic);

      const deviceToPublish = await this.prismaService.device.findFirst({
        where: {
          channelId: channel_id
        }
      })


      if (notifyTopic === 'mygate-notify') {
        const publishedMessage = message.toString();
        try {
          const deviceMessage: AccessNotifyDto = JSON.parse(publishedMessage);

          console.log(deviceMessage);

          if ('ci' in deviceMessage && 'ts' in deviceMessage && 'st' in deviceMessage && 'dr' in deviceMessage) {
            await this.communicationService.accessNotify(deviceToPublish.societyId, deviceToPublish.deviceId, deviceMessage);
          } else {
            console.log("just displaying the message: ", deviceMessage);
          }
          
        } catch (error) {
          console.log(error);
        }
      }
    });



    // Subscribe to the specified topic
    client.on('connect', () => {
      client.subscribe(subscriptionTopic, (err) => {
        if (err) {
          Logger.error(`Error while subscribing to ${subscriptionTopic}: ${err}`);
        } else {
          Logger.log(`Subscribed to ${subscriptionTopic} for thingId: ${thingId}`);
        }
      });
    });

    // Store the connection in the map
    this.connections.set(thingId, client);
  }


  // Function to disconnect from the MQTT broker
  disconnect() {
    this.connections.forEach((client) => {
      client.end();
    });
    this.connections.clear();
  }

}