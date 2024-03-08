import { ListVehiclePage } from '@fnt-flsy/data-transfer-types';
import { ListVehicleDto } from './list-vehicle.dto';
import { ApiProperty } from '@nestjs/swagger';
import { PageBaseDto } from '../../core/dto/page-base.dto';

export class ListVehiclePageDto extends PageBaseDto implements ListVehiclePage {
  @ApiProperty({ type: [ListVehicleDto] }) content: ListVehicleDto[];
}
