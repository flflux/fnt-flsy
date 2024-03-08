import { Site } from '@fnt-flsy/data-transfer-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class SiteDto implements Site {
  @ApiProperty() id: number;

  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsNumber()
  @ApiProperty()
  siteGroupId: number;
}
