import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  UseGuards,
  Request,
  Post,
  Get,
  Put,
  Body,
  ParseFilePipeBuilder,
  UploadedFile,
  UseInterceptors,
  Res,
} from '@nestjs/common';
import { ResidentsService } from './residents.service';
import { AuthGuard } from '../auth/auth.guard';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ListResidentPageDto } from './dto/list-resident-page.dto';
import { ResidentDto } from './dto/residents.dto';
import { AddResidentDto } from './dto/add-resident.dto';
import { ViewResidentDto } from './dto/view-resident.dto';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileDto } from '../core/dto/page-base.dto';
import * as xlsx from 'xlsx';

@ApiTags('residents')
@Controller()
export class ResidentsController {
  constructor(private residentsService: ResidentsService) {}

  @UseGuards(AuthGuard,RolesGuard)
  @Roles(Role.FOUNTLAB_ADMIN, Role.ORGANIZATION_ADMIN,Role.SOCIETY_ADMIN)  
  @Get('/societies/:societyId/residents')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ListResidentPageDto })
  async getResidentForSociety(
    @Request() req,
    @Param('societyId') societyId: number,
    @Query('pageSize') pageSize?: number,
    @Query('pageOffset') pageOffset?: number,
    @Query('name') name?: string,
    @Query('email') email?: string,
    @Query('phoneNumber') phoneNumber?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc'
  ): Promise<ListResidentPageDto> {
    const { user } = req;
    const listsite = await this.residentsService.getFilteredResidents(
      +pageSize,
      +pageOffset,
      name,
      email,
      phoneNumber,
      sortBy,
      sortOrder,
      user.id,
      +societyId,undefined,undefined,undefined,
      false
    );
    return listsite;
  }

  @ApiOperation({summary: "export residents data by society"})
  @UseGuards(AuthGuard,RolesGuard)
  @Roles(Role.FOUNTLAB_ADMIN, Role.ORGANIZATION_ADMIN,Role.SOCIETY_ADMIN)  
  @Get('/societies/:societyId/residents/export')
  @HttpCode(HttpStatus.OK)
  async exportVehicleData(@Param('societyId') societyId: number,@Res() res) {
    const data = await this.residentsService.exportResidentsDetailsForSociety(+societyId);

    // Create a workbook and add a worksheet
    const ws = xlsx.utils.aoa_to_sheet(data);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Sheet 1');

    // Save the workbook to a buffer
    const buffer = xlsx.write(wb, { bookType: 'xlsx', type: 'buffer' });

    // Set the response headers
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=residentDetails.xlsx',
    });

    // Send the buffer as the response
    res.send(buffer);
  }

  
  @ApiOperation({summary:'Resident bulk data upload'})
  @ApiBody({ type: FileDto })
  @ApiConsumes('multipart/form-data') // Specify the media type for file upload
  @UseInterceptors(FileInterceptor('file'))
  // @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post('/societies/:societyId/residents/bulkupload')
  @HttpCode(HttpStatus.CREATED)
  // @ApiOkResponse({ type: ListSocietyDto })
  bulkUploadResidentData(
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
    return this.residentsService.bulkUploadResidentData(+societyId, fileDto,file);
  }

    @ApiOperation({summary:'bulk resident data upload'})
    @ApiBody({ type: FileDto })
    @ApiConsumes('multipart/form-data') // Specify the media type for file upload
    @UseInterceptors(FileInterceptor('file'))
    // @UseGuards(AuthGuard, RolesGuard)
    @HttpCode(HttpStatus.CREATED)
    @Post('/societies/:societyId/buildings/:buildingId/floors/:floorId/flats/:flatId/bulkupload')
    @HttpCode(HttpStatus.CREATED)
    // @ApiOkResponse({ type: ListSocietyDto })
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
      return this.residentsService.bulkUploadResidentsData(+societyId,+buildingId,+floorId,+flatId, fileDto,file);
    }

  @ApiOperation({summary: "add residents for the society"})
  @UseGuards(AuthGuard,RolesGuard)
  @Roles(Role.FOUNTLAB_ADMIN, Role.ORGANIZATION_ADMIN,Role.SOCIETY_ADMIN)  
  @Post('/societies/:societyId/buildings/:buildingId/floors/:floorId/flats/:flatId/residents')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: ResidentDto })
  add(
    @Param('societyId') societyId: number,
    @Param('buildingId') buildingId: number,
    @Param('floorId') floorId: number,
    @Param('flatId') flatId: number,
    @Body() addResidentDto: AddResidentDto
  ): Promise<ResidentDto> {
    return this.residentsService.add(+societyId,+buildingId,+floorId,+flatId, addResidentDto);
  }

  @UseGuards(AuthGuard,RolesGuard)
  @Roles(Role.FOUNTLAB_ADMIN, Role.ORGANIZATION_ADMIN,Role.SOCIETY_ADMIN)  
  @Get('/societies/:societyId/buildings/:buildingId/floors/:floorId/flats/:flatId/residents/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ViewResidentDto })
  findById(
    @Param('societyId') societyId: number,
    @Param('buildingId') buildingId: number,
    @Param('floorId') floorId: number,
    @Param('flatId') flatId: number,
    @Param('id') id: number,
    @Request() req
  ): Promise<ViewResidentDto> {
    const { user } = req;
    return this.residentsService.findById(+societyId,+buildingId,+floorId,+flatId, +id, user.id);
  }

  @UseGuards(AuthGuard,RolesGuard)
  @Roles(Role.FOUNTLAB_ADMIN, Role.ORGANIZATION_ADMIN,Role.SOCIETY_ADMIN)  
  @Put('/societies/:societyId/buildings/:buildingId/floors/:floorId/flats/:flatId/residents/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ResidentDto })
  edit(
    @Param('societyId') societyId: number,
    @Param('buildingId') buildingId: number,
    @Param('floorId') floorId: number,
    @Param('flatId') flatId: number,
    @Body() residentDto: AddResidentDto,
    @Param('id') id: number
  ): Promise<ResidentDto> {
    return this.residentsService.edit(+societyId,+buildingId,+floorId,+flatId, residentDto, id);
  }



  @UseGuards(AuthGuard,RolesGuard)
  @Roles(Role.FOUNTLAB_ADMIN, Role.ORGANIZATION_ADMIN,Role.SOCIETY_ADMIN)  
  @Get('/societies/:societyId/buildings/:buildingId/floors/:floorId/flats/:flatId/residents')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ListResidentPageDto })
  async getFilteredPosts(
    @Request() req,
    @Param('societyId') societyId: number,
    @Param('buildingId') buildingId: number,
    @Param('floorId') floorId: number,
    @Param('flatId') flatId: number,
    @Query('pageSize') pageSize?: number,
    @Query('pageOffset') pageOffset?: number,
    @Query('name') name?: string,
    @Query('email') email?: string,
    @Query('phoneNumber') phoneNumber?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc'
  ): Promise<ListResidentPageDto> {
    const { user } = req;
    const listsite = await this.residentsService.getFilteredResidents(
      +pageSize,
      +pageOffset,
      name,
      email,
      phoneNumber,
      sortBy,
      sortOrder,
      user.id,
      +societyId,+buildingId,+floorId,+flatId,
      true
    );
    return listsite;
  }

  @UseGuards(AuthGuard,RolesGuard)
  @Roles(Role.FOUNTLAB_ADMIN, Role.ORGANIZATION_ADMIN,Role.SOCIETY_ADMIN)  
  @Delete('/societies/:societyId/buildings/:buildingId/floors/:floorId/flats/:flatId/residents/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse()
  delete( @Param('societyId') societyId: number,
  @Param('buildingId') buildingId: number,
  @Param('floorId') floorId: number,
  @Param('flatId') flatId: number, @Param('id') id: number) {
    return this.residentsService.deleteResident(+societyId,+buildingId,+floorId,+flatId, +id);
  }

  @UseGuards(AuthGuard,RolesGuard)
  @Roles(Role.FOUNTLAB_ADMIN, Role.ORGANIZATION_ADMIN,Role.SOCIETY_ADMIN)  
  @Post('/societies/:societyId/buildings/:buildingId/floors/:floorId/flats/:flatId/residents/:id/:status')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse()
  softDelete(
    @Param('societyId') societyId: number,
    @Param('buildingId') buildingId: number,
    @Param('floorId') floorId: number,
    @Param('flatId') flatId: number,
    @Param('id') id: number,
    @Param('status') status: string
  ) {
    return this.residentsService.softDeleteResident(+societyId, +id, status);
  }
}
