import { Device } from '@fnt-flsy/data-transfer-types';
import { ApiProperty } from '@nestjs/swagger';
import { DeviceType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
export class DeviceDto implements Device {
  @ApiProperty() id: number;

  @IsNotEmpty()
  @ApiProperty()
  deviceId: string;

  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsEnum(DeviceType)
  @ApiProperty() type: "ACCESS" | "MONCON";

  
  @ApiProperty() deviceKey: string;
  
  @ApiProperty() isActive: boolean;

  @ApiProperty() thingId: string;
  @ApiProperty() thingKey: string;
  @ApiProperty() channelId: string;
  @ApiProperty() lastSyncTimestamp: number;

  @IsNumber()
  @ApiProperty()
  siteId?: number;

  @IsNumber()
  @ApiProperty()
  societyId?: number;
}
