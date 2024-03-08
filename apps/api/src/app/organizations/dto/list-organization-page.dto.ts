import { ListOrganizationPage } from '@fnt-flsy/data-transfer-types';
import { ListOrganizationDto } from './list-organization.dto';
import { ApiProperty } from '@nestjs/swagger';
import { PageBaseDto } from '../../core/dto/page-base.dto';

export class ListOrganizationPageDto
  extends PageBaseDto
  implements ListOrganizationPage
{
  @ApiProperty({ type: [ListOrganizationDto] }) content: ListOrganizationDto[];
}
