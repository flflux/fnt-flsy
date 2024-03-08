import { Building } from '@fnt-flsy/data-transfer-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';

export class BuildingDto implements Building {
  @ApiProperty() id: number;

  @IsNotEmpty()
  @ApiProperty()
  name: string;

  
}


export class ViewBuildingDto implements Building {
  @ApiProperty() id: number;

  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsNumber()
  @ApiProperty()
  societyId: number;

  @ApiProperty()
  @IsBoolean()
  isActive: boolean;
}