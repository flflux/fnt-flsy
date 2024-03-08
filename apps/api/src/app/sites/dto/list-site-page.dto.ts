import { ListSitePage } from '@fnt-flsy/data-transfer-types';
import { ListSiteDto } from './list-site.dto';
import { ApiProperty } from '@nestjs/swagger';
import { PageBaseDto } from '../../core/dto/page-base.dto';

export class ListSitePageDto extends PageBaseDto implements ListSitePage {
  @ApiProperty({ type: [ListSiteDto] }) content: ListSiteDto[];
}
