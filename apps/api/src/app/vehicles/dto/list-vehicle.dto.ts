import { ListVehicle } from '@fnt-flsy/data-transfer-types';
import { PickType } from '@nestjs/swagger';
import { ViewVehicleDto } from './view-vehicle.dto';

export class ListVehicleDto
  extends PickType(ViewVehicleDto, ['id', 'number','type'])
  implements ListVehicle {}
