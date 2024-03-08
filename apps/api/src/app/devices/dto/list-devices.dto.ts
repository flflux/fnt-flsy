import { ListDevices } from '@fnt-flsy/data-transfer-types';
import { PickType } from '@nestjs/swagger';
import { ViewDeviceDto } from './view-devices.dto'

export class ListDevicesDto
  extends PickType(ViewDeviceDto, ['id','deviceId', 'name', 'site'])
  implements ListDevices {}
