import { Vehicle } from '@fnt-flsy/data-transfer-types';
import { ApiProperty } from '@nestjs/swagger';
import { VehicleType } from '@prisma/client';
import { IsBoolean, IsEnum, IsNotEmpty ,IsNumber} from 'class-validator';


export class VehicleDto implements Vehicle {
  @ApiProperty()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsEnum(VehicleType)
  type: VehicleType;

  @ApiProperty()
  @IsNotEmpty()
  number: string;

  @ApiProperty()
  @IsNumber()
  flatId: number;

  @ApiProperty()
  @IsBoolean()
  isActive:boolean
}
