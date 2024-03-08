import { ListSiteGroupPage } from '@fnt-flsy/data-transfer-types';
import { ListSiteGroupDto } from './list-site-group.dto';
import { ApiProperty } from '@nestjs/swagger';
import { PageBaseDto } from '../../core/dto/page-base.dto';

export class ListSiteGroupPageDto
  extends PageBaseDto
  implements ListSiteGroupPage
{
  @ApiProperty({ type: [ListSiteGroupDto] }) content: ListSiteGroupDto[];
}
