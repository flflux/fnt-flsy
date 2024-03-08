import { SiteGroup } from '@fnt-flsy/data-transfer-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty,IsNumber } from 'class-validator';

export class SiteGroupDto implements SiteGroup {
  @ApiProperty() id: number;

  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsNumber()
  @ApiProperty()
  organizationId: number;
}
