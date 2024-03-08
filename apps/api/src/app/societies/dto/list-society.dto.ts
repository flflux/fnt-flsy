import { ListSociety } from '@fnt-flsy/data-transfer-types';
import { PickType } from '@nestjs/swagger';
import { SocietyDto } from './society.dto';

export class ListSocietyDto
  extends PickType(SocietyDto, ['id', 'name','city','addressLine1','addressLine2','stateCode','countryCode','postalCode', 'isActive','code'])
  implements ListSociety {}
