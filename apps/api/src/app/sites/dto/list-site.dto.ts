import { ListSite } from '@fnt-flsy/data-transfer-types';
import { PickType } from '@nestjs/swagger';
import { ViewSiteDto } from './view-site.dto';

export class ListSiteDto
  extends PickType(ViewSiteDto, ['id', 'name', 'siteGroup'])
  implements ListSite {}
