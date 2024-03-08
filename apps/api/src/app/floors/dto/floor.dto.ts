import { Floor } from '@fnt-flsy/data-transfer-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsBoolean, IsNumber } from 'class-validator';

export class FloorDto implements Floor {
  @ApiProperty() id: number;

  @IsNotEmpty()
  @ApiProperty()
  number: string;

  @IsBoolean()
  @ApiProperty()
  isActive?: boolean;

  @ApiProperty()
  @IsNumber()
  buildingId?: number;
}
