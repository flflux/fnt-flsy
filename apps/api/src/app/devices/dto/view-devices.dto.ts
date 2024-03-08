import { ViewDevice} from '@fnt-flsy/data-transfer-types';
import { ApiProperty } from '@nestjs/swagger';


export class ViewDeviceDto implements ViewDevice {
  @ApiProperty() id: number;
  @ApiProperty() deviceId?: string;
  @ApiProperty() name: string;
  @ApiProperty() thingId?: string;
  @ApiProperty() thingKey?: string;
  @ApiProperty() channelId?: string;
  @ApiProperty() lastSyncTimestamp?:number;
  @ApiProperty()  society?: {
    id: number,
    name: string,
  };
  site?: {
    id: number;
    name: string;
    siteGroup: {
      id: number;
      name: string;
      organization: { id: number; name: string };
    };
  };
}
