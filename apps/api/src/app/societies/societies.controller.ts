import {
  Controller,
  Get,
  Post,
  Request,
  Put,
  Query,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Body,
  UseGuards,
  UseInterceptors,
  ParseFilePipeBuilder,
  UploadedFile,
} from '@nestjs/common';
import { SocietiesService } from './societies.service';
import { AuthGuard } from '../auth/auth.guard';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { SocietyDto } from './dto/society.dto';
import { ListSocietyPageDto } from './dto/list-society-page.dto';
import { AddSocietyDto, AddSocietyResponseDto } from './dto/add-society.dto';
import { ListSocietyDto } from './dto/list-society.dto';
import { EditSocietyDto,EditSocietyStatusDto } from './dto/edit-society.dto';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { FileDto } from '../core/dto/page-base.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('societies')
@Controller('societies')
export class SocietiesController {
  constructor(private societyService: SocietiesService) {}

  @UseGuards(AuthGuard,RolesGuard)
  @Roles(Role.FOUNTLAB_ADMIN, Role.ORGANIZATION_ADMIN,Role.SOCIETY_ADMIN)  
  @ApiOperation({summary: "add society"})
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: AddSocietyResponseDto })
  add(@Body() addSocietyDto: AddSocietyDto): Promise<AddSocietyResponseDto> {
    return this.societyService.add(addSocietyDto);
  }

  @UseGuards(AuthGuard,RolesGuard)
  @Roles(Role.FOUNTLAB_ADMIN, Role.ORGANIZATION_ADMIN,Role.SOCIETY_ADMIN)  
  @ApiOperation({summary: "get societie by id"})
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ListSocietyDto })
  findById(@Param('id') id: number): Promise<ListSocietyDto> {
    return this.societyService.findById(+id);
  }

  @ApiOperation({summary:'bulk society data upload'})
  @ApiBody({ type: FileDto })
  @ApiConsumes('multipart/form-data') // Specify the media type for file upload
  @UseInterceptors(FileInterceptor('file'))
  // @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({summary: "bulk upload society data"})
  @Post('/bulkupload')
  @HttpCode(HttpStatus.CREATED)
  // @ApiOkResponse({ type: ListSocietyDto })
  bulkUploadSocietyData(
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
    return this.societyService.bulkUploadSocietyData(fileDto,file);
  }


  @UseGuards(AuthGuard,RolesGuard)
  @Roles(Role.FOUNTLAB_ADMIN, Role.ORGANIZATION_ADMIN,Role.SOCIETY_ADMIN)  
  @ApiOperation({summary: "Edit society"})
  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: SocietyDto })
  edit(
    @Body() societyDto: EditSocietyDto,
    @Param('id') id: number
  ): Promise<SocietyDto> {
    return this.societyService.edit(societyDto, +id);
  }

  @UseGuards(AuthGuard,RolesGuard)
  @Roles(Role.FOUNTLAB_ADMIN, Role.ORGANIZATION_ADMIN,Role.SOCIETY_ADMIN)  
  @ApiOperation({summary: "get asset count for society by id"})
  @Get('/:id/asset-count')
  @HttpCode(HttpStatus.OK)
  giveAssetCount(@Param('id') id: number){
    return this.societyService.giveAssetCount(+id);
  }

  @UseGuards(AuthGuard,RolesGuard)
  @Roles(Role.FOUNTLAB_ADMIN, Role.ORGANIZATION_ADMIN,Role.SOCIETY_ADMIN)  
  @ApiOperation({summary: "Delete society"})
  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteSociety(@Param('id') id: number): Promise<void> {
    return this.societyService.deleteSociety(+id);
  }

  @UseGuards(AuthGuard,RolesGuard)
  @Roles(Role.FOUNTLAB_ADMIN, Role.ORGANIZATION_ADMIN,Role.SOCIETY_ADMIN)  
  @ApiOperation({summary: "Edit society active status"})
  @Put('/:id/status')
  @ApiOkResponse({ type: EditSocietyStatusDto })
  softDeleteSociety(@Body() editSocietyStatusDto: EditSocietyStatusDto, @Param('id') id: number): Promise<EditSocietyStatusDto> {
    return this.societyService.softDeleteSociety(+id, editSocietyStatusDto);
  }

  @UseGuards(AuthGuard,RolesGuard)
  @Roles(Role.FOUNTLAB_ADMIN, Role.ORGANIZATION_ADMIN,Role.SOCIETY_ADMIN)  
  @ApiOperation({summary: "get filtered societies"})
  @ApiQuery({ name: 'pageSize', type: 'number', required: false })
  @ApiQuery({ name: 'pageOffset', type: 'number', required: false })
  @ApiQuery({ name: 'name', type: 'string', required: false })
  @ApiQuery({ name: 'city', type: 'string', required: false })
  @ApiQuery({ name: 'status', type: "'active'| 'inactive'| 'all'", required: false })
  @ApiQuery({ name: 'sortBy', type: 'string', required: false })
  @ApiQuery({ name: 'sortOrder', type: "'asc' | 'desc'", required: false })
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ListSocietyPageDto })
  async getFilteredSocieties(
    @Query('pageSize') pageSize?: number,
    @Query('pageOffset') pageOffset?: number,
    @Query('name') name?: string,
    @Query('city') city?: string,
    @Query('status') status?: 'active'| 'inactive'| 'all' ,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc'
  ): Promise<ListSocietyPageDto> {
    const listSocieties = await this.societyService.getFilteredSocieties(
      +pageSize,
      +pageOffset,
      name,
      city,
      status,
      sortBy,
      sortOrder
    );
    return listSocieties;
  }
}
