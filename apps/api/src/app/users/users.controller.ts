import {
  Body,
  Controller,
  Post,
  Get,
  Request,
  Put,
  UseGuards,
  Param,
  Query,
  Delete,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { AddUserDto } from './dto/add-user.dto';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { ListUserPageDto } from './dto/list-user-page.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AssetCountDashboardDto, UserDto } from './dto/user.dto';
import { EditUserStatus, ViewUserDto } from './dto/view-user.dto';
import { ForgotPasswordDto, LoginDto, UpdatePasswordDto, UpdatePasswordThroughProfileDto } from '../core/dto/user-login.dto';
import { LocalAuthGuard } from '../auth/local-auth.guard';

@ApiTags("Users")
@Controller()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Post('/admins')
  @ApiOkResponse({ type: UserDto })
  @Roles(Role.FOUNTLAB_ADMIN)
  @HttpCode(HttpStatus.CREATED)
  createAdminUser(@Body() data: AddUserDto & {isPrimary: boolean}): Promise<UserDto> {
    return this.usersService.createAdminUser(data);
  }


  @UseGuards(AuthGuard, RolesGuard)
  @Get('/admins')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ListUserPageDto })
  @Roles(Role.FOUNTLAB_ADMIN)
  listAdmins(
    @Query('pageSize') pageSize?: number,
    @Query('pageOffset') pageOffset?: number,
    @Query('name') name?: string,
    @Query('email') email?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc'
  ) : Promise<ListUserPageDto> {
    return this.usersService.listAdmins(
      +pageSize,
      +pageOffset,
      name,
      email,
      sortBy,
      sortOrder
    );
  }


  @UseGuards(AuthGuard, RolesGuard)
  @Get('asset-count')
  @ApiOkResponse({ type: AssetCountDashboardDto })
  @HttpCode(HttpStatus.OK)
  @Roles(Role.FOUNTLAB_ADMIN)
  assetCount() {
    return this.usersService.assetCount();
  }


  @UseGuards(AuthGuard)
  @Put('/admins/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: UserDto })
  @Roles(Role.FOUNTLAB_ADMIN)
  editAdmin(@Body() data: AddUserDto , @Param('id') id: number): Promise<UserDto> {
    return this.usersService.editAdmin(data,+id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Post('/societies/:societyId/manager')
  @ApiOkResponse({ type: UserDto })
  @Roles(Role.FOUNTLAB_ADMIN,  Role.SOCIETY_ADMIN)
  @HttpCode(HttpStatus.CREATED)
  create(@Param('societyId') societyId: number,@Body() data: AddUserDto & {isPrimary: boolean}): Promise<UserDto & {isPrimary: boolean}> {
    return this.usersService.create(+societyId,data);
  }

  
  @Put('update-password/email/:emailId/token/:token')
  @ApiOkResponse({ type: UserDto })
  @HttpCode(HttpStatus.CREATED)
  updatePassword(@Body() updatePasswordDto: UpdatePasswordDto): Promise<UserDto> {
    return this.usersService.updatePassword(updatePasswordDto);
  }


  @Post('forgot-password')
  @ApiOkResponse({ type: UserDto })
  @HttpCode(HttpStatus.ACCEPTED)
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto){
    return this.usersService.forgotPassword(forgotPasswordDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Get('/societies/:societyId/managers')
  @HttpCode(HttpStatus.OK)
  // @ApiOkResponse({ type: ViewUserDto })
  @Roles(Role.FOUNTLAB_ADMIN, Role.SOCIETY_ADMIN)
  listMangers(@Param('societyId') societyId: number) {
    return this.usersService.listMangers(+societyId);
  }
  

  @UseGuards(AuthGuard, RolesGuard)
  @Get('users/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ViewUserDto })
  @Roles(Role.FOUNTLAB_ADMIN, Role.SOCIETY_ADMIN)
  findById(@Param('id') id: number): Promise<ViewUserDto> {
    return this.usersService.findById(id);
  }


  @UseGuards(AuthGuard, RolesGuard)
  @Put('users/change-password')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ViewUserDto })
  @Roles(Role.FOUNTLAB_ADMIN,Role.SOCIETY_ADMIN,Role.ORGANIZATION_ADMIN)
  editUserPassword( @Body() editUserPassword: UpdatePasswordThroughProfileDto,@Request() req): Promise<UserDto> {
    const { user } = req;
    return this.usersService.editUserPassword(+user.id,editUserPassword);
  }


  @UseGuards(AuthGuard, RolesGuard)
  @Put('users/:id/status')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ViewUserDto })
  @Roles(Role.FOUNTLAB_ADMIN)
  editUserStatus(@Param('id') id: number,@Body() editUserStatus:EditUserStatus): Promise<EditUserStatus> {
    return this.usersService.editUserStatus(+id,editUserStatus);
  }

  @UseGuards(AuthGuard)
  @Put('/societies/:societyId/managers/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: UserDto })
  @Roles(Role.FOUNTLAB_ADMIN, Role.SOCIETY_ADMIN)
  edit(@Body() data: AddUserDto & {isPrimary: boolean}, @Param('societyId') societyId: number, @Param('id') id: number): Promise<UserDto & {isPrimary: boolean}> {
    return this.usersService.edit(data, +societyId,+id);
  }

  @UseGuards(AuthGuard)
  @Delete('/societies/:societyId/managers/:id')
  @Roles(Role.FOUNTLAB_ADMIN, Role.SOCIETY_ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteUser(@Param('societyId') societyId: number,@Param('id') id: number): Promise<void> {
    return this.usersService.deleteUser(+societyId,+id);
  }


  @UseGuards(AuthGuard)
  @Get('users')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ListUserPageDto })
  @Roles(Role.FOUNTLAB_ADMIN)
  async getFilteredPosts(
    @Query('pageSize') pageSize?: number,
    @Query('pageOffset') pageOffset?: number,
    @Query('name') name?: string,
    @Query('email') email?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc'
  ): Promise<ListUserPageDto> {
    const listusers = await this.usersService.getFilteredPosts(
      +pageSize,
      +pageOffset,
      name,
      email,
      sortBy,
      sortOrder
    );
    return listusers;
  }
}

