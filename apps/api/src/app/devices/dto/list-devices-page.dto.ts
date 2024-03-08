import { ListDevicesPage } from '@fnt-flsy/data-transfer-types';
import { ListDevicesDto } from './list-devices.dto';
import { ApiProperty } from '@nestjs/swagger';
import { PageBaseDto } from '../../core/dto/page-base.dto';

export class ListDevicesPageDto
  extends PageBaseDto
  implements ListDevicesPage
{
  @ApiProperty({ type: [ListDevicesDto] }) content: ListDevicesDto[];
}
