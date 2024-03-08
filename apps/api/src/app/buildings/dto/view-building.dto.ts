import { ViewBuilding , assetCount, assetPerBuilding} from '@fnt-flsy/data-transfer-types';
import { ApiProperty } from '@nestjs/swagger';

export class ViewBuildingDto implements ViewBuilding {
  @ApiProperty() id: number;
  @ApiProperty() name: string;
  @ApiProperty() society: {
    id: number;
    name: string;
  };
  isActive?: boolean;
}


export class AssetCount implements assetCount{
  [key: string]: assetPerBuilding;
}


export class Content{
  buildings: ViewBuilding[];
  assetCount: AssetCount
}





