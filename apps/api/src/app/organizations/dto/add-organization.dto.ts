import { AddOrganization } from '@fnt-flsy/data-transfer-types';
import { OmitType } from '@nestjs/swagger';
import { OrganizationDto } from './organization.dto';

export class AddOrganizationDto
  extends OmitType(OrganizationDto, ['id'])
  implements AddOrganization {}
