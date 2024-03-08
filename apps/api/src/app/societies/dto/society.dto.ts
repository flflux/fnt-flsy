import { Society } from '@fnt-flsy/data-transfer-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

export class SocietyDto implements Society {
  @ApiProperty() id: number;

  @IsNotEmpty()
  @ApiProperty()
  code: string;

  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @ApiProperty()
  phoneNumber: string;


  @IsNotEmpty()
  @ApiProperty()
  addressLine1: string;

  @ApiProperty() addressLine2: string;

  @IsNotEmpty()
  @ApiProperty()
  city: string;

  @ApiProperty() stateCode: string;

  @IsNotEmpty()
  @ApiProperty()
  countryCode: string;

  @IsNotEmpty()
  @ApiProperty()
  postalCode: string;

  @ApiProperty()
  isActive: boolean;
}
