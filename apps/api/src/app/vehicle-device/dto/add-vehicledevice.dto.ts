import {  AddDeviceVehicle, AddVehicleDevice } from '@fnt-flsy/data-transfer-types';
import { OmitType } from '@nestjs/swagger';
import { DeviceVehicleDto, VehicleDeviceDto } from './vehicledevice.dto';

export class AddVehicleDeviceDto extends OmitType(VehicleDeviceDto, ['id','deviceId']) implements AddVehicleDevice {}

export class AddDeviceVehicleDto extends OmitType(DeviceVehicleDto, ['id','vehicleId']) implements AddDeviceVehicle {}
