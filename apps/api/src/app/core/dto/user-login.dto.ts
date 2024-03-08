import { Login } from '@fnt-flsy/data-transfer-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

export class LoginDto implements Login {

  @IsEmail()
  @MaxLength(250)
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @ApiProperty()
  password: string;
}


export class UpdatePasswordThroughProfileDto{
  @IsNotEmpty()
  @ApiProperty()
  old_password: string;

  @IsNotEmpty()
  @ApiProperty()
  new_password: string;
}

export class UpdatePasswordDto{

  @IsEmail()
  @MaxLength(250)
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @ApiProperty()
  password: string;

  @IsNotEmpty()
  @ApiProperty()
  token: string;
}


export class ForgotPasswordDto{

  @IsEmail()
  @MaxLength(250)
  @ApiProperty()
  email: string;

}
