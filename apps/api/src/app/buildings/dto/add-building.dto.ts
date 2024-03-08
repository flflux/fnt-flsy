import { AddBuilding } from '@fnt-flsy/data-transfer-types';
import { BuildingDto } from './buildings.dto';
import { OmitType } from '@nestjs/swagger';

export class AddBuildingDto
  extends OmitType(BuildingDto, ['id'])
  implements AddBuilding {}
