import { ListFloorPage } from '@fnt-flsy/data-transfer-types';
import { ListFloorDto } from './list-floor.dto';
import { ApiProperty } from '@nestjs/swagger';
import { PageBaseDto } from '../../core/dto/page-base.dto';

export class ListFloorPageDto extends PageBaseDto implements ListFloorPage {
  @ApiProperty({ type: [ListFloorDto] }) content: ListFloorDto[];
}
