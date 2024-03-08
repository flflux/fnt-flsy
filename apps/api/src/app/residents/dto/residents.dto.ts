import { Resident } from '@fnt-flsy/data-transfer-types';
import { ApiProperty } from '@nestjs/swagger';
import { ResidentType } from '@prisma/client';
import { IsEmail, IsNotEmpty, IsBoolean , IsEnum} from 'class-validator';


export class ResidentDto implements Resident {
  @ApiProperty()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsEnum(ResidentType)
  type: ResidentType;

  @ApiProperty()
  @IsEmail()
  email ?: string;

  @ApiProperty()
  @IsNotEmpty()
  phoneNumber ?: string;

  @ApiProperty()
  @IsBoolean()
  isChild: boolean;

  @ApiProperty()
  @IsBoolean()
  isPrimary: boolean;

  @ApiProperty()
  @IsBoolean()
  isActive:boolean
}
