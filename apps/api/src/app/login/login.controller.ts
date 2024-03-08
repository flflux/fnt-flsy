import { Controller, Post, UseGuards, Request, Body, Get, HttpStatus, Param, HttpCode } from '@nestjs/common';
import { LocalAuthGuard } from './../auth/local-auth.guard';
import { LoginDto } from '../core/dto/user-login.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { UsersService } from '../users/users.service';
import { AuthGuard } from '../auth/auth.guard';
import { UserDto } from '../users/dto/user.dto';
import { ViewUserDto } from '../users/dto/view-user.dto';

@Controller('')
export class LoginController {
  constructor(private usersService: UsersService) {}
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  login(@Body() loginDto:LoginDto, @Request() req) {
    return this.usersService.findByIdForSwitch(req.user.id);
  }

  @UseGuards(AuthGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: UserDto })
  findByIdForSwitch(@Request() req): Promise<UserDto> {
    const UserId = req.user.id
    return this.usersService.findByIdForSwitch(UserId);
  }

  @Post('/logout')
  @ApiOkResponse()
  logout(@Request() req): string {
    req.session.destroy();
    return 'You are logged out'
  }
}
