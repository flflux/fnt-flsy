import { ApiProperty, PickType } from '@nestjs/swagger';
import { DeviceDto } from './devices.dto';
import {
  AddDevice,
  EditDevice,
  EditDevicesKey,
  EditDevicesSetting,
  EditDevicesStatus,
} from '@fnt-flsy/data-transfer-types';

export class AddDevicesDto
  extends PickType(DeviceDto, ['name', 'deviceId', 'type'])
  implements AddDevice
{
  @ApiProperty() deviceKey: string;
}

export class EditDevicesDto
  extends PickType(DeviceDto, ['name'])
  implements EditDevice {}

export class EditDevicesSettingDto
  extends PickType(DeviceDto, [
    'deviceId',
    'thingId',
    'thingKey',
    'channelId',
    'type',
  ])
  implements EditDevicesSetting {}

export class EditDevicesKeyDto
  extends PickType(DeviceDto, ['deviceKey'])
  implements EditDevicesKey {}

export class EditDevicesStatusDto
  extends PickType(DeviceDto, ['isActive'])
  implements EditDevicesStatus {}

export class SbForceOpen {
  @ApiProperty()
  deviceId: string;
}
