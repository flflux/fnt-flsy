import { AddSiteGroup } from '@fnt-flsy/data-transfer-types';
import { OmitType } from '@nestjs/swagger';
import { SiteGroupDto } from './site-group.dto';

export class AddSiteGroupDto
  extends OmitType(SiteGroupDto, ['id'])
  implements AddSiteGroup {}
