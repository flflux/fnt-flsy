import { ListResident } from '@fnt-flsy/data-transfer-types';
import { PickType } from '@nestjs/swagger';
import { ViewResidentDto } from './view-resident.dto';

export class ListResidentDto
  extends PickType(ViewResidentDto, ['id', 'name','isActive'])
  implements ListResident {}
