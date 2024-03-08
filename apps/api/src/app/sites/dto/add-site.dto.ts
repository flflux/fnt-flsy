import { AddSite } from '@fnt-flsy/data-transfer-types';
import { OmitType } from '@nestjs/swagger';
import { SiteDto } from './site.dto';

export class AddSiteDto extends OmitType(SiteDto, ['id']) implements AddSite {}
