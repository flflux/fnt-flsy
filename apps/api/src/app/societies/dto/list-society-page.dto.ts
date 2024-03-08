import { ListSocietyPage } from '@fnt-flsy/data-transfer-types';
import { ListSocietyDto } from './list-society.dto';
import { ApiProperty } from '@nestjs/swagger';
import { PageBaseDto } from '../../core/dto/page-base.dto';

export class ListSocietyPageDto
  extends PageBaseDto
  implements ListSocietyPage
{
  @ApiProperty({ type: [ListSocietyDto] }) content: ListSocietyDto[];
}
