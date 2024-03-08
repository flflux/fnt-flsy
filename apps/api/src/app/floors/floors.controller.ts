import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Query,
    Param,
    HttpCode,
    HttpStatus,
    Body,
    ParseFilePipeBuilder,
    UploadedFile,
    UseInterceptors,
  } from '@nestjs/common';
  import { FloorsService } from './floors.service';
  import { FloorDto } from './dto/floor.dto';
  import { ListFloorPageDto } from './dto/list-floor-page.dto';
  import { AddFloorDto } from './dto/add-floor.dto';
  import { ApiBody, ApiConsumes, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
  import { ViewFloorDto } from './dto/view-floor.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileDto } from '../core/dto/page-base.dto';
  
  @ApiTags('floors')
  @Controller()
  export class FloorsController {
    constructor(private floorsService: FloorsService) {}
  
    @ApiOperation({summary: "add floor for building"})
    @Post('/societies/:societyId/buildings/:buildingId/floors')
    @HttpCode(HttpStatus.CREATED)
    @ApiOkResponse({ type: ViewFloorDto })
    add(@Param('societyId') societyId: number,
    @Param('buildingId') buildingId: number,@Body() addFloorDto: AddFloorDto): Promise<ViewFloorDto> {
      return this.floorsService.add(+societyId, +buildingId,addFloorDto);
    }

    @ApiOperation({summary:'bulk floor data upload'})
    @ApiBody({ type: FileDto })
    @ApiConsumes('multipart/form-data') // Specify the media type for file upload
    @UseInterceptors(FileInterceptor('file'))
    // @UseGuards(AuthGuard, RolesGuard)
    @HttpCode(HttpStatus.CREATED)
    @Post('/societies/:societyId/buildings/:buildingId/floors/bulkupload')
    @HttpCode(HttpStatus.CREATED)
    // @ApiOkResponse({ type: ListSocietyDto })
    bulkUploadSocietyData(
      @Param('societyId') societyId: number,
      @Param('buildingId') buildingId: number,
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
      return this.floorsService.bulkUploadFloorData(+societyId,+buildingId, fileDto,file);
    }
  
    @ApiOperation({summary: "get floor by id for building"})
    @Get('/societies/:societyId/buildings/:buildingId/floors/:id')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: ViewFloorDto })
    findById( @Param('societyId') societyId: number,
    @Param('buildingId') buildingId: number,@Param('id') id: number): Promise<ViewFloorDto> {
      return this.floorsService.findById(+societyId,+buildingId, +id);
    }
  
    @ApiOperation({summary: "edit floor for the building"})
    @Put('/societies/:societyId/buildings/:buildingId/floors/:id')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: ViewFloorDto })
    edit(
      @Param('societyId') societyId: number,
      @Param('buildingId') buildingId: number,
      @Body() floorDto: AddFloorDto,
      @Param('id') id: number
    ): Promise<ViewFloorDto> {
      return this.floorsService.edit(floorDto, +societyId,+buildingId, +id);
    }
  
    @ApiOperation({summary: "get floors for the building"})
    @Get('/societies/:societyId/buildings/:buildingId/floors')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: ListFloorPageDto })
    async getFilteredFloors(
      @Param('societyId') societyId: number,
      @Param('buildingId') buildingId: number,
      @Query('pageSize') pageSize?: number,
      @Query('pageOffset') pageOffset?: number,
      @Query('name') name?: string,
      @Query('sortBy') sortBy?: string,
      @Query('sortOrder') sortOrder?: 'asc' | 'desc'
    ): Promise<ListFloorPageDto> {
      const listFloors = await this.floorsService.getFilteredFloors(
        +pageSize,
        +pageOffset,
        name,
        sortBy,
        sortOrder,
        +societyId,
        +buildingId
      );
      return listFloors;
    }
  
    @ApiOperation({summary: "delete floor for the building"})
    @Delete('/societies/:societyId/buildings/:buildingId/floors/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOkResponse()
    deleteFloor(@Param('societyId') societyId: number,
    @Param('buildingId') buildingId: number,@Param('id') id: number): Promise<void> {
      return this.floorsService.deleteFloor(+societyId, +buildingId,+id);
    }

  
  }
  