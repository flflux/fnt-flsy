import { User } from '@fnt-flsy/data-transfer-types';
import { ApiProperty } from '@nestjs/swagger';
import { SuperRoleName,SocietyRoleName } from '@prisma/client';
import { IsEmail, IsNotEmpty, MaxLength, } from 'class-validator';
import { OrganizationRolesDto } from '../../core/dto/organizationRoles.dto';

export class UserDto implements User {
  @ApiProperty() id: number;

  @IsEmail()
  @MaxLength(250)
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @ApiProperty()
  phoneNumber: string;

  @IsNotEmpty()
  @ApiProperty()
  firstName: string;

  @IsNotEmpty()
  @ApiProperty() lastName: string;

  @ApiProperty() SocietyRole?: SocietyRoleName

  @ApiProperty()
  organizationRoles?:OrganizationRolesDto[];

  @ApiProperty()
  superRole?: SuperRoleName;
}


export class AssetCountDashboardDto  {
  @ApiProperty() Societies: number;

  @ApiProperty()
  Buildings: number;

  @ApiProperty()
  Flats: number;

  @ApiProperty() Residents: number;

  @ApiProperty() Vehicles: number

  @ApiProperty()
  Users:number;

  @ApiProperty()
  Devices: number
}
