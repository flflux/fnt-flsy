import { AddSociety, AddSocietyResponse, EditSociety, EditSocietyResponse, EditSocietyStatus } from '@fnt-flsy/data-transfer-types';
import { OmitType, PickType } from '@nestjs/swagger';
import { SocietyDto } from './society.dto';

export class EditSocietyDto
  extends OmitType(SocietyDto, ['id','isActive','code'])
  implements EditSociety {
}


export class EditSocietyStatusDto
  extends PickType(SocietyDto, ['isActive'])
  implements EditSocietyStatus {
}




