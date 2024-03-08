import { ListFlat } from '@fnt-flsy/data-transfer-types';
import { PickType } from '@nestjs/swagger';
import { ViewFlatDto } from './view-flat.dto';

export class ListFlatDto
  extends PickType(ViewFlatDto, ['id', 'number', 'floor'])
  implements ListFlat {}
