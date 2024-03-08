import { ListBuilding } from '@fnt-flsy/data-transfer-types';
import { ViewBuildingDto } from './view-building.dto';
import { PickType } from '@nestjs/swagger';

export class ListBuildingDto
  extends PickType(ViewBuildingDto, ['id', 'name', 'society'])
  implements ListBuilding {}
