import { ListCard } from '@fnt-flsy/data-transfer-types';
import { PickType } from '@nestjs/swagger';
import { ViewCardDto } from './view-card.dto';

export class ListCardDto
  extends PickType(ViewCardDto, ['id', 'number', 'vehicleId', 'isActive'])
  implements ListCard {}
