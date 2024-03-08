import { PageBaseDto } from '../../core/dto/page-base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ListBuildingDto } from './list-building.dto';
import { ListBuildingPage, ViewBuilding, assetCount, buildingsInfo } from '@fnt-flsy/data-transfer-types';


export class ListBuildingPageDto
  extends PageBaseDto
  implements ListBuildingPage
{
  @ApiProperty({ type: [ListBuildingDto] }) content: ListBuildingDto[];
}




export class ListBuildingInfoDto implements buildingsInfo{
  content: {
    buildings: ViewBuilding[]
  }
}

