import { AddVehicle } from '@fnt-flsy/data-transfer-types';
import { OmitType } from '@nestjs/swagger';
import { VehicleDto } from './vehicle.dto';

export class AddVehicleDto extends OmitType(VehicleDto, ['id','flatId']) implements AddVehicle {}
