import { ListSiteGroup } from '@fnt-flsy/data-transfer-types';
import { PickType } from '@nestjs/swagger';
import { ViewSiteGroupDto } from './view-site-group.dto';

export class ListSiteGroupDto
  extends PickType(ViewSiteGroupDto, ['id', 'name', 'organization'])
  implements ListSiteGroup {}
