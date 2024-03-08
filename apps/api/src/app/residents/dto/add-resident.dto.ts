import { AddResident } from '@fnt-flsy/data-transfer-types';
import { OmitType } from '@nestjs/swagger';
import { ResidentDto } from './residents.dto';

export class AddResidentDto extends OmitType(ResidentDto, ['id']) implements AddResident {}
