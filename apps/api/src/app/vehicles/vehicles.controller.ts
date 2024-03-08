import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards , Get, Put, Delete, Request,Query,Param, Patch, ParseFilePipeBuilder, UploadedFile, UseInterceptors, Res, Response} from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { AuthGuard } from '../auth/auth.guard';
import { AddVehicleDto } from './dto/add-vehicle.dto';
import { VehicleDto } from './dto/vehicle.dto';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ListVehiclePageDto } from './dto/list-vehicle-page.dto';
import { ViewVehicleDto } from './dto/view-vehicle.dto';
import { EditVehicleDto } from './dto/edit-vehicle.dto';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileDto } from '../core/dto/page-base.dto';
import * as xlsx from 'xlsx';

@Controller()
@ApiTags('vehicles')
export class VehiclesController {
  constructor(private vehiclesService: VehiclesService) {}

  @ApiOperation({summary: "get filter vehicles for the society by id"})
  @UseGuards(AuthGuard,RolesGuard)
  @Roles(Role.FOUNTLAB_ADMIN)  
  @ApiQuery({ name: 'pageSize', required: false })
  @ApiQuery({ name: 'pageOffset', required: false })
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'number', required: false })
  @ApiQuery({ name: 'isActive', required: false })
  @ApiQuery({ name: 'sortBy', required: false })
  @ApiQuery({ name: 'sortOrder', required: false })
  @UseGuards(AuthGuard,RolesGuard)
  @Roles(Role.FOUNTLAB_ADMIN, Role.ORGANIZATION_ADMIN,Role.SOCIETY_ADMIN)  
  @Get('/vehicles')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({type: ListVehiclePageDto})
  async getVehicles(
    @Request() req,
    @Query('pageSize') pageSize?: number,
    @Query('pageOffset') pageOffset?: number,
    @Query('name') name?: string,
    @Query('number') number?: string,
    @Query('isActive') isActive?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc'
  ):Promise<ListVehiclePageDto> {
    const {user}=req;
    const listsite = await this.vehiclesService.getFilteredVehicles(
      +pageSize,
      +pageOffset,
      name,
      number,
      isActive,
      sortBy,
      sortOrder,
    );
    return listsite;
  }

  @ApiOperation({summary: "get filter vehicles for the society by id"})
  @UseGuards(AuthGuard,RolesGuard)
  @Roles(Role.FOUNTLAB_ADMIN, Role.ORGANIZATION_ADMIN,Role.SOCIETY_ADMIN)  
  @Get('/societies/:societyId/vehicles')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({type: ListVehiclePageDto})
  async getFilteredVehiclesforSociety(
    @Request() req,
    @Param('societyId') societyId: number,
    @Param('buildingId') buildingId: number,
    @Param('floorId') floorId: number,
    @Param('flatId') flatId: number,
    @Query('pageSize') pageSize?: number,
    @Query('pageOffset') pageOffset?: number,
    @Query('name') name?: string,
    @Query('number') number?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc'
  ):Promise<ListVehiclePageDto> {
    const {user}=req;
    const listsite = await this.vehiclesService.getFilteredPosts(
      +pageSize,
      +pageOffset,
      name,
      number,
      sortBy,
      sortOrder,
      user.id,
      +societyId,+buildingId,+floorId,+flatId,
      false
    );
    return listsite;
  }

  @ApiOperation({summary: "export vehicle data by society"})
  @UseGuards(AuthGuard,RolesGuard)
  @Roles(Role.FOUNTLAB_ADMIN, Role.ORGANIZATION_ADMIN,Role.SOCIETY_ADMIN)  
  @Get('/societies/:societyId/vehicles/export')
  @HttpCode(HttpStatus.OK)
  async exportVehicleData(@Param('societyId') societyId: number,@Res() res) {
    const data = await this.vehiclesService.exportVehicleDetailsForSociety(+societyId);

    // Create a workbook and add a worksheet
    const ws = xlsx.utils.aoa_to_sheet(data);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Sheet 1');

    // Save the workbook to a buffer
    const buffer = xlsx.write(wb, { bookType: 'xlsx', type: 'buffer' });

    // Set the response headers
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=vehicleDetails.xlsx',
    });

    // Send the buffer as the response
    res.send(buffer);
  }


  @ApiOperation({summary:'bulk vehicle data upload'})
  @ApiBody({ type: FileDto })
  @ApiConsumes('multipart/form-data') // Specify the media type for file upload
  @UseInterceptors(FileInterceptor('file'))
  // @UseGuards(AuthGuard, RolesGuard)
  // @Roles(Role.FOUNTLAB_ADMIN, Role.ORGANIZATION_ADMIN,Role.SOCIETY_ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @Post('/societies/:societyId/vehicles/bulkupload')
  @HttpCode(HttpStatus.CREATED)
  bulkVehicleUploadData(
    @Param('societyId') societyId: number,
    @Body() fileDto : FileDto ,
    @UploadedFile(
        new ParseFilePipeBuilder()
        // .addFileTypeValidator({
        //     fileType: 'xlsx',
        // },)
        .addMaxSizeValidator({
            maxSize: 1048576 * 2 //2Mb
        })
        .build({
            errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
        }),
    )
    file: Express.Multer.File,
  )
  // : Promise<ListSocietyDto> 
  {
    return this.vehiclesService.bulkVehicleUploadData(+societyId, fileDto,file);
  }


    @ApiOperation({summary:'bulk vehicle data upload'})
    @ApiBody({ type: FileDto })
    @ApiConsumes('multipart/form-data') // Specify the media type for file upload
    @UseInterceptors(FileInterceptor('file'))
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.FOUNTLAB_ADMIN, Role.ORGANIZATION_ADMIN,Role.SOCIETY_ADMIN)
    @HttpCode(HttpStatus.CREATED)
    @Post('/societies/:societyId/buildings/:buildingId/floors/:floorId/flats/:flatId/vehicles/bulkupload')
    @HttpCode(HttpStatus.CREATED)
    bulkUploadSocietyData(
      @Param('societyId') societyId: number,
      @Param('buildingId') buildingId: number,
      @Param('floorId') floorId: number,
      @Param('flatId') flatId: number,
      @Body() fileDto : FileDto ,
      @UploadedFile(
          new ParseFilePipeBuilder()
          // .addFileTypeValidator({
          //     fileType: 'xlsx',
          // },)
          .addMaxSizeValidator({
              maxSize: 1048576 * 2 //2Mb
          })
          .build({
              errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
          }),
      )
      file: Express.Multer.File,
    )
    // : Promise<ListSocietyDto> 
    {
      return this.vehiclesService.bulkUploadVehiclesData(+societyId,+buildingId,+floorId,+flatId, fileDto,file);
    }


  @ApiOperation({summary: "add vehicles for the society"})
  @UseGuards(AuthGuard,RolesGuard)
  @Roles(Role.FOUNTLAB_ADMIN, Role.ORGANIZATION_ADMIN,Role.SOCIETY_ADMIN)  
  @Post('/societies/:societyId/buildings/:buildingId/floors/:floorId/flat/:flatId/vehicles')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({type: VehicleDto})
  add(
    @Param('societyId') societyId: number,
    @Param('buildingId') buildingId: number,
    @Param('floorId') floorId: number,
    @Param('flatId') flatId: number,
    @Body() addVehicleDto:AddVehicleDto):Promise<VehicleDto> {
    return this.vehiclesService.add(+societyId,+buildingId,+floorId,+flatId,addVehicleDto);
  }

  @ApiOperation({summary: "get vehicles for the society by id"})
  @UseGuards(AuthGuard,RolesGuard)
  @Roles(Role.FOUNTLAB_ADMIN, Role.ORGANIZATION_ADMIN,Role.SOCIETY_ADMIN)  
  @Get('/societies/:societyId/buildings/:buildingId/floors/:floorId/flat/:flatId/vehicles/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({type: ViewVehicleDto})
  findById(
    @Param('societyId') societyId: number,
    @Param('buildingId') buildingId: number,
    @Param('floorId') floorId: number,
    @Param('flatId') flatId: number,
    @Param('id') id: number, @Request() req):Promise<ViewVehicleDto> {
    const { user } = req;
    return this.vehiclesService.findById(+societyId,+buildingId,+floorId,+flatId,+id, user.id);
  }
  

  @ApiOperation({summary: "edit vehicles for the society by id"})
  @UseGuards(AuthGuard,RolesGuard)
  @Roles(Role.FOUNTLAB_ADMIN, Role.ORGANIZATION_ADMIN,Role.SOCIETY_ADMIN)  
  @Put('/societies/:societyId/buildings/:buildingId/floors/:floorId/flat/:flatId/vehicles/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({type: EditVehicleDto})
  edit(
    @Param('societyId') societyId: number,
    @Param('buildingId') buildingId: number,
    @Param('floorId') floorId: number,
    @Param('flatId') flatId: number,
    @Body() editVehicleDto:EditVehicleDto, @Param('id') id: number): Promise<EditVehicleDto>{
    return this.vehiclesService.edit(+societyId,+buildingId,+floorId,+flatId,editVehicleDto, id);
  }

  @ApiOperation({summary: "get filter vehicles for the flat by id"})
  @UseGuards(AuthGuard,RolesGuard)
  @Roles(Role.FOUNTLAB_ADMIN, Role.ORGANIZATION_ADMIN,Role.SOCIETY_ADMIN)  
  @Get('/societies/:societyId/buildings/:buildingId/floors/:floorId/flat/:flatId/vehicles')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({type: ListVehiclePageDto})
  async getFilteredPosts(
    @Request() req,
    @Param('societyId') societyId: number,
    @Param('buildingId') buildingId: number,
    @Param('floorId') floorId: number,
    @Param('flatId') flatId: number,
    @Query('pageSize') pageSize?: number,
    @Query('pageOffset') pageOffset?: number,
    @Query('name') name?: string,
    @Query('number') number?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc'
  ):Promise<ListVehiclePageDto> {
    const {user}=req;
    const listsite = await this.vehiclesService.getFilteredPosts(
      +pageSize,
      +pageOffset,
      name,
      number,
      sortBy,
      sortOrder,
      user.id,
      +societyId,+buildingId,+floorId,+flatId,
      true
    );
    return listsite;
  }

  @ApiOperation({summary: "delete vehicles for the society by id"})
  @UseGuards(AuthGuard,RolesGuard)
  @Roles(Role.FOUNTLAB_ADMIN, Role.ORGANIZATION_ADMIN,Role.SOCIETY_ADMIN)  
  @Delete('/societies/:societyId/buildings/:buildingId/floors/:floorId/flat/:flatId/vehicles/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse()
  delete(
    @Param('societyId') societyId: number,
    @Param('buildingId') buildingId: number,
    @Param('floorId') floorId: number,
    @Param('flatId') flatId: number,
    @Param('id') id: number) {
    return this.vehiclesService.deleteVehicle(+societyId,+buildingId,+floorId,+flatId,id);
  }

  @UseGuards(AuthGuard,RolesGuard)
  @Roles(Role.FOUNTLAB_ADMIN, Role.ORGANIZATION_ADMIN,Role.SOCIETY_ADMIN)  
  @Put('/vehicles/:id/:status')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse()
  softDelete(@Param('id') id: number,@Param('status') status:string) {
    return this.vehiclesService.softDeleteVehicle(id,status);
  }
}
