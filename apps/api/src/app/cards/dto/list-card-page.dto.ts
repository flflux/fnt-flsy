import { ListCardPage } from '@fnt-flsy/data-transfer-types';
import { ListCardDto } from './list-card.dto';
import { ApiProperty } from '@nestjs/swagger';
import { PageBaseDto } from '../../core/dto/page-base.dto';

export class ListCardPageDto extends PageBaseDto implements ListCardPage {
  @ApiProperty({ type: [ListCardDto] }) content: ListCardDto[];
}
