import { ListUserPage } from '@fnt-flsy/data-transfer-types';
import { ListUserDto } from './list-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { PageBaseDto } from '../../core/dto/page-base.dto';

export class ListUserPageDto extends PageBaseDto implements ListUserPage {
  @ApiProperty({ type: [ListUserDto] }) content: ListUserDto[];
}
