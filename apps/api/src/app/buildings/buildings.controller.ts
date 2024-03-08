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
import { BuildingDto } from './dto/buildings.dto';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AddBuildingDto } from './dto/add-building.dto';
import { BuildingsService } from './buildings.service';
import { ViewBuildingDto } from './dto/view-building.dto';
import { ListBuildingInfoDto, ListBuildingPageDto } from './dto/list-building-page.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { FileDto } from '../core/dto/page-base.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags("buildings")
@Controller()
export class BuildingsController {
  constructor(private buildingService: BuildingsService) {}

  @ApiOperation({summary: 'add building to a society'})
  @UseGuards(AuthGuard,RolesGuard)
  @Roles(Role.FOUNTLAB_ADMIN, Role.ORGANIZATION_ADMIN,Role.SOCIETY_ADMIN)

  @Post('/societies/:societyId/buildings')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: ViewBuildingDto })
  add(
    @Param('societyId') societyId: number,
    @Body() addBuildingDto: AddBuildingDto): Promise<ViewBuildingDto> {
    return this.buildingService.add(+societyId,addBuildingDto);
  }


  @ApiOperation({summary:'bulk building data upload'})
  @ApiBody({ type: FileDto })
  @ApiConsumes('multipart/form-data') // Specify the media type for file upload
  @UseInterceptors(FileInterceptor('file'))
  // @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({summary: "bulk upload society data"})
  @Post('/societies/:societyId/buildings/bulkupload')
  @HttpCode(HttpStatus.CREATED)
  // @ApiOkResponse({ type: ListSocietyDto })
  bulkUploadSocietyData(
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
    return this.buildingService.bulkUploadBuildingData(+societyId, fileDto,file);
  }

  @ApiOperation({summary: 'Find buildings by id belonging to a society'})
  @UseGuards(AuthGuard,RolesGuard)
  @Roles(Role.FOUNTLAB_ADMIN, Role.ORGANIZATION_ADMIN,Role.SOCIETY_ADMIN)
  @Get('/societies/:societyId/buildings/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ViewBuildingDto })
  findById(@Param('societyId') societyId: number,@Param('id') id: number, @Request() req): Promise<ViewBuildingDto> {
    return this.buildingService.findById(+societyId,id);
  }

  @ApiOperation({summary: 'edit buildings by id belonging to a society'})
  @UseGuards(AuthGuard,RolesGuard)
  @Roles(Role.FOUNTLAB_ADMIN, Role.ORGANIZATION_ADMIN,Role.SOCIETY_ADMIN)
  @Put('/societies/:societyId/buildings/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ViewBuildingDto })
  edit(
    @Param('societyId') societyId: number,
    @Body() buildingDto: AddBuildingDto,
    @Param('id') id: number
  ): Promise<ViewBuildingDto> {
    return this.buildingService.edit(+societyId,buildingDto, +id);
  }

  @ApiOperation({summary: 'Find buildings belonging to a society'})
  @UseGuards(AuthGuard,RolesGuard)
  @Roles(Role.FOUNTLAB_ADMIN, Role.ORGANIZATION_ADMIN,Role.SOCIETY_ADMIN)
  @Get('/societies/:societyId/buildings')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ListBuildingPageDto })
  async getFilteredPosts(
    @Request() req,
    @Param('societyId') societyId: number,
    @Query('pageSize') pageSize?: number,
    @Query('pageOffset') pageOffset?: number,
    @Query('name') name?: string,
    // @Query('societyName') societyName?: string,
    // @Query('isActive') isActive?: boolean,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ): Promise<ListBuildingPageDto> {
    const listbuilding = await this.buildingService.getFilteredPosts(
      +pageSize,
      +pageOffset,
      name,
      // societyName,
      // isActive,
      sortBy,
      sortOrder,
      +societyId
    );
    return listbuilding;
  }


  @UseGuards(AuthGuard,RolesGuard)
  @Roles(Role.FOUNTLAB_ADMIN, Role.ORGANIZATION_ADMIN,Role.SOCIETY_ADMIN)
  @Get('/societies/:societyId/buildings-info')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ListBuildingInfoDto })
  async getBuildingsInfo(
    @Param('societyId') societyId: number,

  ): Promise<ListBuildingInfoDto> {
    const listbuilding = await this.buildingService.buildingsInfo(
      +societyId
    )
    return listbuilding;
  }


  @UseGuards(AuthGuard,RolesGuard)
  @Roles(Role.FOUNTLAB_ADMIN, Role.ORGANIZATION_ADMIN,Role.SOCIETY_ADMIN)
  @Put('/societies/:societyId/buildings/:id/:status')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOkResponse()
  softDelete(@Param('societyId') societyId: number,@Param('id') id: number, @Param('status') status: string) {
    return this.buildingService.softDeleteBuilding(+societyId,+id, status);
  }

  @ApiOperation({summary: 'delete building belonging to a society'})
  @UseGuards(AuthGuard,RolesGuard)
  @Roles(Role.FOUNTLAB_ADMIN, Role.ORGANIZATION_ADMIN,Role.SOCIETY_ADMIN)
  @Delete('/societies/:societyId/buildings/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse()
  delete(@Param('societyId') societyId: number,@Param('id') id: number) {
    return this.buildingService.deleteBuilding(+societyId,+id);
  }
}
