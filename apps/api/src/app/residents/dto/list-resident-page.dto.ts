import { ListResidentPage } from '@fnt-flsy/data-transfer-types';
import { ListResidentDto } from './list-resident.dto';
import { ApiProperty } from '@nestjs/swagger';
import { PageBaseDto } from '../../core/dto/page-base.dto';

export class ListResidentPageDto extends PageBaseDto implements ListResidentPage {
  @ApiProperty({ type: [ListResidentDto] }) content: ListResidentDto[];
}
