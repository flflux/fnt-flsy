import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { VehicleDeviceService } from './vehicle-device.service';
import { AuthGuard } from '../auth/auth.guard';
import { ApiTags, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { AddDeviceVehicleDto, AddVehicleDeviceDto } from './dto/add-vehicledevice.dto';
import { VehicleDeviceDto } from './dto/vehicledevice.dto';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { RolesGuard } from '../auth/roles.guard';
import { listVehicleDevicePageDto } from './dto/list-vehicle-device-page.dto';



@ApiTags('vehicle-device')
@Controller('')
export class VehicleDeviceController {
    constructor(private vehicleDeviceService: VehicleDeviceService) {}

    @ApiOperation({summary: "add vehicle to the device for the society"})
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.FOUNTLAB_ADMIN, Role.ORGANIZATION_ADMIN, Role.SOCIETY_ADMIN)
    @Post('/societies/:societyId/device/:deviceId/vehicle')
    @HttpCode(HttpStatus.CREATED)
    @ApiOkResponse({ type: AddVehicleDeviceDto })
    //   @Roles(Role.FOUNTLAB_ADMIN)
    add(
        @Param('societyId') societyId: number,
        @Param('deviceId') deviceId: number,@Body() addVehicleDeviceDto: AddVehicleDeviceDto): Promise<VehicleDeviceDto> {
        return this.vehicleDeviceService.add(+societyId, +deviceId,addVehicleDeviceDto);
    }



    @ApiOperation({summary: "add device to the vehicle for the society"})
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.FOUNTLAB_ADMIN, Role.ORGANIZATION_ADMIN, Role.SOCIETY_ADMIN)
    @Post('/societies/:societyId/vehicle/:vehicleId/device')
    @HttpCode(HttpStatus.CREATED)
    @ApiOkResponse({ type: AddDeviceVehicleDto })
    //   @Roles(Role.FOUNTLAB_ADMIN)
    addVehicleDevice(
        @Param('societyId') societyId: number,
        @Param('vehicleId') vehicleId: number,@Body() addVehicleDeviceDto: AddDeviceVehicleDto): Promise<VehicleDeviceDto> {
        return this.vehicleDeviceService.addVehicleDevice(+societyId, +vehicleId,addVehicleDeviceDto);
    }


    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.FOUNTLAB_ADMIN, Role.ORGANIZATION_ADMIN, Role.SOCIETY_ADMIN)
    @Get('/societies/:societyId/device/:deviceId/vehicles')
    @HttpCode(HttpStatus.CREATED)
    @ApiOkResponse({ type: listVehicleDevicePageDto })
    //   @Roles(Role.FOUNTLAB_ADMIN)
    list(
        @Param('societyId') societyId: number,
        @Param('deviceId') deviceId: number,
        @Query('pageSize') pageSize?: number,
        @Query('pageOffset') pageOffset?: number,
        @Query('sortBy') sortBy?: string,
        @Query('sortOrder') sortOrder?: 'asc' | 'desc',
        ) {
        return this.vehicleDeviceService.listAllVehicles(+societyId,+deviceId,+pageSize,+pageOffset,sortBy, sortOrder);
    }


    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.FOUNTLAB_ADMIN, Role.ORGANIZATION_ADMIN, Role.SOCIETY_ADMIN)
    @Get('/societies/:societyId/vehicles/:vehicleId/devices')
    @HttpCode(HttpStatus.CREATED)
    @ApiOkResponse({ type: listVehicleDevicePageDto })
    //   @Roles(Role.FOUNTLAB_ADMIN)
    listDevicesForVehicle(
        @Param('societyId') societyId: number,
        @Param('vehicleId') vehicleId: number,
        @Query('pageSize') pageSize?: number,
        @Query('pageOffset') pageOffset?: number,
        @Query('sortBy') sortBy?: string,
        @Query('sortOrder') sortOrder?: 'asc' | 'desc',
        ) {
        return this.vehicleDeviceService.listDevicesForVehicle(+societyId,+vehicleId,+pageSize,+pageOffset,sortBy, sortOrder);
    }



    @UseGuards(AuthGuard)
    @Get('vehicledevice/:id')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: VehicleDeviceDto })
    //   @Roles(Role.ORGANIZATION_ADMIN, Role.FOUNTLAB_ADMIN)
    findById(@Param('id') id: number){
        return this.vehicleDeviceService.findById(+id);
    }



    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.FOUNTLAB_ADMIN, Role.ORGANIZATION_ADMIN,Role.SOCIETY_ADMIN)
    @Put('vehicledevice/:id')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: VehicleDeviceDto })
    //   @Roles(Role.FOUNTLAB_ADMIN)
    edit(@Body() vehicleDeviceDto: VehicleDeviceDto, @Param('id') id: number): Promise<VehicleDeviceDto> {
        return this.vehicleDeviceService.edit(vehicleDeviceDto, id);
    }

    // @UseGuards(AuthGuard)
    // @Get()
    // @HttpCode(HttpStatus.OK)
    // @ApiOkResponse({ type: ListFlatPageDto })
    // //   @Roles(Role.FOUNTLAB_ADMIN,Role.ORGANIZATION_ADMIN)
    // async getFilteredPosts(
    //     @Request() req,
    //     @Query('pageSize') pageSize?: number,
    //     @Query('pageOffset') pageOffset?: number,
    //     @Query('isActive') isActive?: string,
    //     @Query('number') number?: string,
    //     @Query('floorNumber') floorNumber?: string,
    //     @Query('name') name?: string,
    //     @Query('sortBy') sortBy?: string,
    //     @Query('sortOrder') sortOrder?: 'asc' | 'desc'
    // ): Promise<ListFlatPageDto> {
    //     const { user } = req;
    //     const listsite = await this.flatsService.getFilteredFlats(
    //     +pageSize,
    //     +pageOffset,
    //     number,
    //     floorNumber,
    //     name,
    //     isActive,
    //     sortBy,
    //     sortOrder,
    //     user.id
    //     );
    //     return listsite;
    // }

    // @UseGuards(AuthGuard)
    // @Post('/:id/:status')
    // @HttpCode(HttpStatus.NO_CONTENT)
    // @ApiOkResponse()
    // softDelete(@Param('id') id: number, @Param('status') status: string) {
    //     return this.flatsService.softDeleteFlat(id, status);
    // }

    @UseGuards(AuthGuard)
    @Delete('/societies/:societyId/device/:deviceId/vehicle/:vehicleId')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOkResponse()
    //   @Roles(Role.FOUNTLAB_ADMIN)
    hardDeleteFlat(
        @Param('societyId') societyId: number,
        @Param('deviceId') deviceId: number,@Param('vehicleId') vehicleId: number) {
        return this.vehicleDeviceService.deleteVehicleDevice(+societyId,+deviceId,+vehicleId);
    }



}
