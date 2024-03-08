import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, MaxLength } from 'class-validator';

export class VehicleDeviceDto {
  @ApiProperty() id: number;
  @IsNumber()  @ApiProperty()  vehicleId: number;
  @IsNumber() @ApiProperty() deviceId: number;
}


export class DeviceVehicleDto {
  @ApiProperty() id: number;
  @IsNumber()  @ApiProperty()  vehicleId: number;
  @IsNumber() @ApiProperty() deviceId: number;
}

