import { ListOrganization } from '@fnt-flsy/data-transfer-types';
import { PickType } from '@nestjs/swagger';
import { OrganizationDto } from './organization.dto';

export class ListOrganizationDto
  extends PickType(OrganizationDto, ['id', 'name', 'type'])
  implements ListOrganization {}
