import { ListFlatPage } from '@fnt-flsy/data-transfer-types';
import { ListFlatDto } from './list-flat.dto';
import { ApiProperty } from '@nestjs/swagger';
import { PageBaseDto } from '../../core/dto/page-base.dto';

export class ListFlatPageDto extends PageBaseDto implements ListFlatPage {
  @ApiProperty({ type: [ListFlatDto] }) content: ListFlatDto[];
}
