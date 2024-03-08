import { Organization } from '@fnt-flsy/data-transfer-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';


export class OrganizationDto implements Organization {
  @ApiProperty() id: number;

  @IsNotEmpty()
  @ApiProperty() name: string;

  @IsNotEmpty()
  @ApiProperty() type: string;

  @IsEmail()
  @MaxLength(250)
  @ApiProperty() email: string;

  @IsNotEmpty()
  @ApiProperty() phoneNumber: string;

  @IsNotEmpty()
  @ApiProperty() addressLine1: string;

  @ApiProperty() addressLine2: string;

  @IsNotEmpty()
  @ApiProperty() city: string;

  @ApiProperty() stateCode: string;

  @IsNotEmpty()
  @ApiProperty() countryCode: string;

  @IsNotEmpty()
  @ApiProperty() postalCode: string;
}
