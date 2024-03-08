import { AddFloor } from '@fnt-flsy/data-transfer-types';
import { OmitType } from '@nestjs/swagger';
import { FloorDto } from './floor.dto';

export class AddFloorDto extends OmitType(FloorDto, ['id','buildingId','isActive']) implements AddFloor {}
