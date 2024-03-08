import { AddFlat } from '@fnt-flsy/data-transfer-types';
import { OmitType } from '@nestjs/swagger';
import { FlatDto } from './flat.dto';

export class AddFlatDto extends OmitType(FlatDto, ['id','isActive','floorId']) implements AddFlat {}
