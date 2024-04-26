import { ForbiddenException, NotFoundException ,HttpException, HttpStatus, Injectable, Logger} from '@nestjs/common';
import axios from 'axios';
import { Cron } from '@nestjs/schedule';
import { flfluxDto } from './flflux.dto';
import { MQTT_DOMAIN_MYGATE } from './env.consts';
import { Device ,Card} from '@prisma/client';
import { SuperRole, OrganizationRole, PrismaClient, OrganizationRoleName, SuperRoleName } from '@prisma/client';
import {
  API_URL,
  DEVICE_SYNC_BATCH_SIZE,
  DEVICE_SYNC_CRON,
  MYGATE_API_KEY,
  MYGATE_API_URL,
  MYGATE_SYNC_CRON,
} from '../core/consts/env.consts';

import { MainFluxService } from '../mainflux/mainflux.service';
import { AccessSyncDto } from '../core/dto/access-sync.dto';
import { CardDto } from '../cards/dto/card.dto';

// import {
//   MyGateNotifyDto,
//   MyGateNotifyResponseDto,
//   MyGateSyncResponseDto,
// } from './dto/mygate.dto';


@Injectable()
export class FlfluxService {
  constructor(
    private mainFluxService: MainFluxService
  ) {}
  private prismaService = new PrismaClient();
  
  
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
          where: { id: id ,isActive: true},
          include: {
            // TODO : we need to remove vehicles from here..
            vehicles:{
              select:{
                vehicles:{
                  select:{
                    cards: true
                  }
                }
              }
            },
            deviceCards: true,
          },
        });
        
        const { deviceCards } = device;

        // const vehicleCards = await tx.card.findMany({
        //   where:{
        //     deviceId: device.id,
        //     isActive: true
        //   }
        // })

        const vehicleCards = device.vehicles.map((vehicle): Card=>{
          return vehicle.vehicles.cards[0]
        });
        
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

}