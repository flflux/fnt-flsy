import { AddSociety, AddSocietyResponse } from '@fnt-flsy/data-transfer-types';
import { OmitType } from '@nestjs/swagger';
import { SocietyDto } from './society.dto';

export class AddSocietyDto
  extends OmitType(SocietyDto, ['id'])
  implements AddSociety {
}


export class AddSocietyResponseDto
extends SocietyDto
implements AddSocietyResponse{

}
