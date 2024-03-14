import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Post,
  Put,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { DevicesService } from './devices.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Role } from '../auth/role.enum';
import { Roles } from '../auth/roles.decorator';
import { AddDevicesDto, EditDevicesDto, EditDevicesKeyDto, EditDevicesSettingDto, EditDevicesStatusDto, SbForceOpen } from './dto/add-devices.dto';

import { ListDevicesPageDto } from './dto/list-devices-page.dto';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ViewDeviceDto } from './dto/view-devices.dto';
import { CreateImageDto } from './dto/add-devices-images.dto';
import { FileInterceptor } from '@nestjs/platform-express';

import 'multer';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';


@Controller()
export class DevicesController {
  constructor(private deviceService: DevicesService) {}

  @ApiTags('devices')
  @ApiOperation({summary:'add device'})
  @UseGuards(AuthGuard, RolesGuard)
  @Post('/societies/:societyId/devices')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: ViewDeviceDto })
  @Roles(Role.FOUNTLAB_ADMIN)
  add( @Param('societyId') societyId: number, @Body() deviceDto:AddDevicesDto): Promise<ViewDeviceDto> {
    return this.deviceService.addDevice(+societyId,deviceDto);
  }

  @ApiTags('schnell-backend')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({summary:'force open gate'})
  @Post('/societies/:societyCode/devices/force-open')
  @HttpCode(HttpStatus.CREATED)
  forceOpenDeviceForSociety( @Param('societyCode') societyCode: string, @Body() deviceDto:SbForceOpen) {
    return this.deviceService.forceOpenDeviceForSociety(societyCode,deviceDto);
  }




  @ApiTags('devices')
  @ApiOperation({summary:'add device Image'})
  @ApiBody({ type: CreateImageDto })
  @ApiConsumes('multipart/form-data') // Specify the media type for file upload
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthGuard, // RolesGuard)
  )
  @Post('/societies/:societyId/devices/images')
  @HttpCode(HttpStatus.CREATED)
  // @Roles(Role.FOUNTLAB_ADMIN,Role.ORGANIZATION_ADMIN,Role.SOCIETY_ADMIN)
  addDeviceImage( 
    @Param('societyId') societyId: number, 
    @Body() createImageDto:CreateImageDto ,
    @UploadedFile(
        new ParseFilePipeBuilder()
        .addFileTypeValidator({
            fileType: '.(png|jpeg|jpg)',
        },)
        .addMaxSizeValidator({
            maxSize: 1048576 * 2 //2Mb
        })
        .build({
            errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
        }),
    )
    file: Express.Multer.File,
  
  ) {
    return this.deviceService.addDeviceImage(+societyId,createImageDto,file);
  }


  @ApiTags('devices')
  @ApiOperation({summary:"Find a device image belonging to a society"})
  @UseGuards(AuthGuard, RolesGuard)
  @Get('/societies/:societyId/devices/:id/images')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.FOUNTLAB_ADMIN, Role.ORGANIZATION_ADMIN,Role.SOCIETY_ADMIN)
  findDeviceImage(@Param('id') id: number, @Request() req,@Param('societyId') societyId: number,) {
    return this.deviceService.findDeviceImage(+id,+societyId);
  }


  @ApiTags('devices')
  @ApiOperation({summary:'Find devices belonging to a society'})
  @UseGuards(AuthGuard, RolesGuard)
  @Get('/societies/:societyId/devices')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ListDevicesPageDto })
  @Roles(Role.FOUNTLAB_ADMIN, Role.ORGANIZATION_ADMIN,Role.SOCIETY_ADMIN)
  async getFilteredDevicesForSociety(
    @Request() req,
    @Param('societyId') societyIdParam?: number,
    @Query('pageSize') pageSize?: number,
    @Query('pageOffset') pageOffset?: number,
    @Query('siteId') sitesId?: number,
    @Query('name') name?: string,
    @Query('deviceId') deviceId?: string,
    @Query('societyName') societyName?: string,
    @Query('societyId') societyId?: string,
    @Query('status') status?: 'active'|'inactive'|'all',
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc'
  ): Promise<ListDevicesPageDto> {
    const { user } = req;
    const listdevices = await this.deviceService.getFilteredPosts(
      +pageSize,
      +pageOffset,
      +sitesId,
      name,
      deviceId,
      societyName,
      +societyId,
      status,
      sortBy,
      sortOrder,
      user.id,
      +societyIdParam
    );
    return listdevices;
  }


  @ApiTags('devices')
  @ApiOperation({summary:"Find a device belonging to a society"})
  @UseGuards(AuthGuard, RolesGuard)
  @Get('/societies/:societyId/devices/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ViewDeviceDto })
  @Roles(Role.FOUNTLAB_ADMIN, Role.ORGANIZATION_ADMIN,Role.SOCIETY_ADMIN)
  findById(@Param('id') id: number, @Request() req,@Param('societyId') societyId: number,): Promise<ViewDeviceDto> {
    const { user } = req;
    return this.deviceService.findById(+id,+societyId, user.id);
  }

  @ApiTags('devices')
  @ApiOperation({summary: 'Edit device'})
  @UseGuards(AuthGuard, RolesGuard)
  @Put('/societies/:societyId/devices/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ViewDeviceDto })
  @Roles(Role.FOUNTLAB_ADMIN, Role.ORGANIZATION_ADMIN,Role.SOCIETY_ADMIN)
  edit(@Request() req,@Body() deviceDto:EditDevicesDto, @Param('id') id: number,@Param('societyId') societyId: number): Promise<ViewDeviceDto> {
    const { user } = req;

    return this.deviceService.edit(deviceDto, +id,+societyId,user.id);
  }


  @ApiTags('devices')
  @ApiOperation({summary: 'Edit device setting'})
  @UseGuards(AuthGuard, RolesGuard)
  @Put('/societies/:societyId/devices/:id/settings')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ViewDeviceDto })
  @Roles(Role.FOUNTLAB_ADMIN)
  editDeviceSetting(@Body() deviceDto:EditDevicesSettingDto, @Param('id') id: number,@Param('societyId') societyId: number,@Request() req,): Promise<ViewDeviceDto> {
    const { user } = req;
    return this.deviceService.editDeviceSetting(deviceDto, +id,+societyId,user.id);
  }

  @ApiTags('devices')
  @ApiOperation({summary: 'Edit device key'})
  @UseGuards(AuthGuard, RolesGuard)
  @Put('/societies/:societyId/devices/:id/key')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.FOUNTLAB_ADMIN)
  editDeviceKey(@Body() deviceDto:EditDevicesKeyDto, @Param('id') id: number,@Param('societyId') societyId: number,@Request() req,): Promise<void> {
    const { user } = req;
    return this.deviceService.editDeviceKey(deviceDto, +id,+societyId,user.id);
  }

  @ApiTags('devices')
  @ApiOperation({summary: 'Edit device active Status'})
  @UseGuards(AuthGuard, RolesGuard)
  @Put('/societies/:societyId/devices/:id/status')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: EditDevicesStatusDto })
  @Roles(Role.FOUNTLAB_ADMIN)
  editDeviceStatus(@Body() deviceDto:EditDevicesStatusDto, @Param('id') id: number,@Param('societyId') societyId: number,@Request() req,): Promise<EditDevicesStatusDto> {
    const { user } = req;
    return this.deviceService.editDeviceStatus(deviceDto, +id,+societyId,user.id);
  }


  @ApiTags('devices')
  @ApiOperation({summary: 'delete device'})
  @UseGuards(AuthGuard, RolesGuard)
  @Delete('/societies/:societyId/devices/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.FOUNTLAB_ADMIN)
  deleteDevice(@Param('id') id: number,@Param('societyId') societyId: number,): Promise<void> {
    return this.deviceService.deleteDevice(+id,+societyId);
  }



  @ApiTags('devices')
  @ApiOperation({summary: 'delete device Image'})
  @UseGuards(AuthGuard, RolesGuard)
  @Delete('/societies/:societyId/devices/:deviceId/image')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.FOUNTLAB_ADMIN, Role.SOCIETY_ADMIN)
  deleteDeviceImage(@Param('deviceId') deviceId: number,@Param('societyId') societyId: number,): Promise<void> {
    return this.deviceService.deleteDeviceImage(+deviceId,+societyId);
  }

  

  @ApiTags('devices')
  @ApiOperation({summary:'find devices'})
  @UseGuards(AuthGuard, RolesGuard)
  @Get('/devices')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ListDevicesPageDto })
  @Roles(Role.FOUNTLAB_ADMIN, Role.ORGANIZATION_ADMIN)
  async getFilteredPosts(
    @Request() req,
    @Query('pageSize') pageSize?: number,
    @Query('pageOffset') pageOffset?: number,
    @Query('siteId') sitesId?: number,
    @Query('name') name?: string,
    @Query('deviceId') deviceId?: string,
    @Query('societyName') societyName?: string,
    @Query('societyId') societyId?: string,
    @Query('status') status?: 'active'|'inactive'|'all',
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc'
  ): Promise<ListDevicesPageDto> {
    const { user } = req;
    const listdevices = await this.deviceService.getFilteredPosts(
      +pageSize,
      +pageOffset,
      +sitesId,
      name,
      deviceId,
      societyName,
      +societyId,
      status,
      sortBy,
      sortOrder,
      user.id,
      undefined
    );
    return listdevices;
  }
}