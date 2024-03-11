import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// import { PrismaService } from '@fnt-flsy/prisma-client-mygate';
import { MainFluxService } from '../mainflux/mainflux.service';
// import { MyGateService } from '../mygate/mygate.service';
import { AccessNotifyDto } from '../core/dto/access-notify.dto';
import {
  API_URL,
  MQTT_DOMAIN_MYGATE,
  MQTT_PORT_MYGATE,
} from '../core/consts/env.consts';
import { DateTimeForDeviceDto } from './dto/communication.dto';
import { AccessSyncDto } from '../core/dto/access-sync.dto';
import { AccessSyncAckDto } from '../core/dto/access-sync-ack.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class CommunicationService {
  constructor(
    private mainFluxService: MainFluxService,
    // private myGateService: MyGateService
  ) {}

  private prismaService = new PrismaClient();

  async accessNotify(societyId: number, deviceId: string, accessNotifyDto: AccessNotifyDto) {
    const society =  await this.prismaService.society.findFirst({
      where: {
        id: societyId
      }
    })

    if(!society) throw new HttpException("society not found", HttpStatus.NOT_FOUND);
    // get device by device id
    const device = await this.prismaService.device.findFirst({
      where: {
        deviceId: deviceId,
      },
      select:{
        id: true,
        thingId: true,
        thingKey: true,
        channelId: true,
        societyId: true,
      }
    });
    if (!device) {
      throw new HttpException('Device not found', HttpStatus.NOT_FOUND);
    }
    const isPublishedToMqtt = await this.mainFluxService.publishNotifyToMqtt(
      accessNotifyDto,
      deviceId,
      device.thingId,
      device.thingKey,
      device.channelId
    );
    if (!isPublishedToMqtt) {
      // TODO: maintain publish status
      console.error(`Could not publish to MQTT`, accessNotifyDto);
    }
    
    // get card by access display
    const card = await this.prismaService.card.findFirst({
      where: {
        number: accessNotifyDto.ci,
      },
      select:{
        id: true,
        vehicle:{
          select:{
            id: true
          }
        }
      }
    });
    if (!card) {
      throw new HttpException(`displayed card no ${accessNotifyDto.ci} not found`, HttpStatus.NOT_FOUND);
    }
    // add log
    // TODO: maintain MQTT and MyGate notification status
    // todo: check the timestamp from accessNotifDto if not availabel then use current timestamp

    const log = await this.prismaService.deviceLog.create({
      data: {
        status: accessNotifyDto.st=='ALLOW' ? "ALLOW" : "DISALLOW",
        direction: accessNotifyDto.dr=='IN'? "IN":"OUT",
        vehicleCardId: card.id,
        societyId: societyId,
        deviceId: device.id,
        vehicleId: card.vehicle?.id,
        dateTime: new Date(Number(accessNotifyDto.ts) * 1000)
      },
    });
    console.log(
      'Received notification from device',
      deviceId,
      accessNotifyDto
    );
    if(!log) throw new HttpException("internal server error while creating log", HttpStatus.INTERNAL_SERVER_ERROR);
    return {
      success: true,
    };
  }

  async getCredentials(deviceId: string) {
    const deviceResponse = await this.prismaService.device.findFirst({
      where: {
        deviceId: deviceId,
      },
      select:{
        id: true,
        thingId: true,
        channelId: true,
        thingKey: true,
        societyId: true
      }
    });
    if (!deviceResponse) {
      throw new HttpException('Device not found', HttpStatus.NOT_FOUND);
    }
    return {
      status: true,
      resp: {
        imei: deviceId,
        clientid: deviceResponse.channelId,
        username: deviceResponse.thingId,
        password: deviceResponse.thingKey,
        broker: MQTT_DOMAIN_MYGATE,
        port: MQTT_PORT_MYGATE,
        notify: `${API_URL}/notify/society/${deviceResponse.societyId}/device/${deviceId}`,
      },
    };
  }

  async getTime(): Promise<DateTimeForDeviceDto> {
    // TODO: handle time zone
    const now = new Date();
    return {
      status: true,
      datetime: {
        day: now.getDate(),
        month: now.getMonth() + 1, // Month is 0-based, so we add 1 to get the correct month
        year: now.getFullYear() - 2000, // Subtract 2000 to get the two-digit year representation
        hour: now.getHours(),
        min: now.getMinutes(),
        sec: now.getSeconds(),
      },
    };
  }

  async iAmHere(deviceId: string) {
    const device = await this.prismaService.device.findFirst({
      where: {
        deviceId: String(deviceId),
      },
    });
    if (!device) {
      throw new HttpException('Device not found', HttpStatus.NOT_FOUND);
    }
    return this.prismaService.iAmHereLog.create({
      data: {
        deviceId: device.id,
      },
    });
  }

  // utility method
  async accessSync(deviceId: string, accessSyncDto: AccessSyncDto) {
    const device = await this.prismaService.device.findFirst({
      where: { deviceId: deviceId },
    });
    if (!device) {
      throw new HttpException('Device not found', HttpStatus.NOT_FOUND);
    }
    return this.mainFluxService.connectAndPublishWithRetry(
      accessSyncDto,
      device.thingId,
      device.thingKey,
      device.channelId,
      'device-sync'
    );
  }

  async accessSyncAck(societyId:number,deviceId: string, accessSyncAckDto: AccessSyncAckDto) {
    let id: number;
    let isMyGateDevice = false;
    console.log('Received sync ack from device', deviceId, accessSyncAckDto);
    await this.prismaService.$transaction(async (tx) => {
      const society = await tx.society.findFirst({
        where:{
          id: societyId
        }
      })
      if(!society) throw new HttpException("Society not found",HttpStatus.NOT_FOUND);
      
      const device = await tx.device.findFirst({
        where: { deviceId: deviceId },
      });
      if (!device) {
        throw new HttpException('Device not found', HttpStatus.NOT_FOUND);
      }
      id = device.id;
      // isMyGateDevice = device.isMyGateDevice;
      const syncMessage = await tx.syncMessage.findFirst({
        where: {
          deviceId: device.id,
          syncToken: accessSyncAckDto.st,
        },
        include: {
          cards: true,
        },
      });
      if (!syncMessage) {
        throw new HttpException('Sync message not found', HttpStatus.NOT_FOUND);
      }
      const cards = syncMessage.cards;
      const addedCards = cards
        .filter((c) => c.status === 'ADD')
        .map((c) => c.cardId);
      const removedCards = cards
        .filter((c) => c.status === 'REMOVE')
        .map((c) => c.cardId);
      for (const addedCard of addedCards) {
        await tx.deviceCard.upsert({
          create: {
            deviceId: device.id,
            cardId: addedCard,
          },
          update: {},
          where: {
            deviceId_cardId: {
              deviceId: device.id,
              cardId: addedCard,
            },
          },
        });
      }
      await tx.deviceCard.deleteMany({
        where: {
          deviceId: device.id,
          cardId: {
            in: removedCards,
          },
        },
      });
      await tx.syncMessageCard.deleteMany({
        where: {
          syncMessageId: syncMessage.id,
        },
      });
      await tx.syncMessage.delete({
        where: {
          id: syncMessage.id,
        },
      });
    });
    console.log('Processed sync ack from device', deviceId, accessSyncAckDto);
    // // TODO: implement worker
    // if (isMyGateDevice) {
    //   await this.myGateService.deviceSyncMyGateForDevice(id);
    // }
    return { status: 'ok' };
  }
}
