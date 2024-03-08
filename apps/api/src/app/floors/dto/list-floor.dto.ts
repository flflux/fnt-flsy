import { ListFloor } from '@fnt-flsy/data-transfer-types';
import { PickType } from '@nestjs/swagger';
import { ViewFloorDto } from './view-floor.dto';

export class ListFloorDto
  extends PickType(ViewFloorDto, ['id', 'number', 'building',])
  implements ListFloor {}
