import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Request,
  Post,
  Put,
  Query,
  UseGuards,
  ParseFilePipeBuilder,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FlatsService } from './flats.service';
import { FlatDto } from './dto/flat.dto';
import { AddFlatDto } from './dto/add-flat.dto';
import { ViewFlatDto } from './dto/view-flat.dto';
import { ListFlatPageDto } from './dto/list-flat-page.dto';
import {
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { ListResidentByFlatDto as ResidentByFlatDto } from './dto/list-residents.dto';
import { ListFlatDto } from './dto/list-flat.dto';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileDto } from '../core/dto/page-base.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller()
export class FlatsController {
  constructor(private flatsService: FlatsService) {}

  @ApiTags('flats')
  @ApiOperation({ summary: 'get flats for the building' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.FOUNTLAB_ADMIN, Role.ORGANIZATION_ADMIN, Role.SOCIETY_ADMIN)
  @Get('/societies/:societyId/flats')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ListFlatPageDto })
  //   @Roles(Role.FOUNTLAB_ADMIN,Role.ORGANIZATION_ADMIN)
  async getFlatForSociety(
    @Request() req,
    @Param('societyId') societyId: number,
    @Query('pageSize') pageSize?: number,
    @Query('pageOffset') pageOffset?: number,
    @Query('number') number?: string,
    @Query('buildingName') buildingName?: string,
    @Query('floorNumber') floorNumber?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc'
  ): Promise<ListFlatPageDto> {
    const { user } = req;
    console.log(req.body, req.query, req.params)
    const listsite = await this.flatsService.getFilteredFlats(
      +pageSize,
      +pageOffset,
      number,
      buildingName,
      floorNumber,
      sortBy,
      sortOrder,
      user.id,
      +societyId,
      undefined,
      undefined,
      false //associatefloor
    );
    return listsite;
  }

  @ApiTags('schnell-backend')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'get cards associated with flat for the society' })
  @Get('/societies/:societyCode/flats/:flatNumber/cards')
  @HttpCode(HttpStatus.OK)
  // @ApiOkResponse({ type: ListFlatPageDto })
  async getCardsAssociatedWithFlatForSociety(
    @Request() req,
    @Param('societyCode') societyCode: string,
    @Param('flatNumber') flatNumber: string,
  ) {
    const { user } = req;
    const listsite = await this.flatsService.getCardsAssociatedWithFlatForSociety(
      societyCode,
      flatNumber
    );
    return listsite;
  }

  @ApiTags('flats')
  @ApiOperation({ summary: 'get flats for the building' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.FOUNTLAB_ADMIN, Role.ORGANIZATION_ADMIN, Role.SOCIETY_ADMIN)
  @Get('/societies/:societyId/buildings/:buildingId/flats')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ListFlatPageDto })
  //   @Roles(Role.FOUNTLAB_ADMIN,Role.ORGANIZATION_ADMIN)
  async getFlatForBuilding(
    @Request() req,
    @Param('societyId') societyId: number,
    @Param('buildingId') buildingId: number,
    @Query('pageSize') pageSize?: number,
    @Query('pageOffset') pageOffset?: number,
    @Query('number') number?: string,
    @Query('buildingName') buildingName?: string,
    @Query('floorNumber') floorNumber?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc'
  ): Promise<ListFlatPageDto> {
    const { user } = req;
    const listsite = await this.flatsService.getFilteredFlats(
      +pageSize,
      +pageOffset,
      number,
      buildingName,
      floorNumber,
      sortBy,
      sortOrder,
      user.id,
      +societyId,
      +buildingId,
      undefined,
      false //associatefloor
    );
    return listsite;
  }

  @ApiTags('flats')
  @ApiOperation({ summary: 'bulk flat data upload' })
  @ApiBody({ type: FileDto })
  @ApiConsumes('multipart/form-data') // Specify the media type for file upload
  @UseInterceptors(FileInterceptor('file'))
  // @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post(
    '/societies/:societyId/buildings/:buildingId/floors/:floorId/flats/bulkupload'
  )
  @HttpCode(HttpStatus.CREATED)
  // @ApiOkResponse({ type: ListSocietyDto })
  bulkUploadSocietyData(
    @Param('societyId') societyId: number,
    @Param('buildingId') buildingId: number,
    @Param('floorId') floorId: number,
    @Body() fileDto: FileDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        // .addFileTypeValidator({
        //     fileType: 'xlsx',
        // },)
        .addMaxSizeValidator({
          maxSize: 1048576 * 2, //2Mb
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        })
    )
    file: Express.Multer.File
  ) // : Promise<ListSocietyDto>
  {
    return this.flatsService.bulkUploadFlatData(
      +societyId,
      +buildingId,
      +floorId,
      fileDto,
      file
    );
  }

  @ApiTags('flats')
  @ApiOperation({ summary: 'bulk flat upload' })
  @ApiBody({ type: FileDto })
  @ApiConsumes('multipart/form-data') // Specify the media type for file upload
  @UseInterceptors(FileInterceptor('file'))
  // @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post('/societies/:societyId/flats/bulkupload')
  @HttpCode(HttpStatus.CREATED)
  // @ApiOkResponse({ type: ListSocietyDto })
  bulkUploadFlatsData(
    @Param('societyId') societyId: number,
    @Body() fileDto: FileDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        // .addFileTypeValidator({
        //     fileType: 'xlsx',
        // },)
        .addMaxSizeValidator({
          maxSize: 1048576 * 2, //2Mb
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        })
    )
    file: Express.Multer.File
  ) // : Promise<ListSocietyDto>
  {
    return this.flatsService.bulkUploadFlat(+societyId, fileDto, file);
  }

  @ApiTags('flats')
  @ApiOperation({ summary: 'add flat for the building' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.FOUNTLAB_ADMIN, Role.ORGANIZATION_ADMIN, Role.SOCIETY_ADMIN)
  @Post('/societies/:societyId/buildings/:buildingId/floors/:floorId/flats')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: FlatDto })
  //   @Roles(Role.FOUNTLAB_ADMIN)
  add(
    @Param('societyId') societyId: number,
    @Param('buildingId') buildingId: number,
    @Param('floorId') floorId: number,
    @Body() addFlatDto: AddFlatDto
  ): Promise<ViewFlatDto> {
    return this.flatsService.add(+societyId, +buildingId, +floorId, addFlatDto);
  }

  @ApiTags('flats')
  @ApiOperation({ summary: 'get flat by id for the building' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.FOUNTLAB_ADMIN, Role.ORGANIZATION_ADMIN, Role.SOCIETY_ADMIN)
  @Get('/societies/:societyId/buildings/:buildingId/floors/:floorId/flats/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ViewFlatDto })
  //   @Roles(Role.ORGANIZATION_ADMIN, Role.FOUNTLAB_ADMIN)
  findById(
    @Param('societyId') societyId: number,
    @Param('buildingId') buildingId: number,
    @Param('floorId') floorId: number,
    @Param('id') id: number,
    @Request() req
  ): Promise<ViewFlatDto> {
    const { user } = req;
    return this.flatsService.findById(
      +societyId,
      +buildingId,
      +floorId,
      +id,
      user.id
    );
  }

  @ApiTags('flats')
  @ApiOperation({ summary: 'edit flat for the building' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.FOUNTLAB_ADMIN, Role.ORGANIZATION_ADMIN, Role.SOCIETY_ADMIN)
  @Put('/societies/:societyId/buildings/:buildingId/floors/:floorId/flats/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: AddFlatDto })
  //   @Roles(Role.FOUNTLAB_ADMIN)
  edit(
    @Body() flatDto: AddFlatDto,
    @Param('societyId') societyId: number,
    @Param('buildingId') buildingId: number,
    @Param('floorId') floorId: number,
    @Param('id') id: number
  ): Promise<ListFlatDto> {
    return this.flatsService.edit(
      flatDto,
      +societyId,
      +buildingId,
      +floorId,
      +id
    );
  }

  @ApiTags('flats')
  @ApiOperation({ summary: 'get flats associated with floor for the building' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.FOUNTLAB_ADMIN, Role.ORGANIZATION_ADMIN, Role.SOCIETY_ADMIN)
  @Get('/societies/:societyId/buildings/:buildingId/floors/:floorId/flats')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ListFlatPageDto })
  //   @Roles(Role.FOUNTLAB_ADMIN,Role.ORGANIZATION_ADMIN)
  async getFilteredPosts(
    @Request() req,
    @Param('societyId') societyId: number,
    @Param('buildingId') buildingId: number,
    @Param('floorId') floorId: number,
    @Query('pageSize') pageSize?: number,
    @Query('pageOffset') pageOffset?: number,
    @Query('number') number?: string,
    @Query('buildingName') buildingName?: string,
    @Query('floorNumber') floorNumber?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc'
  ): Promise<ListFlatPageDto> {
    const { user } = req;
    const listsite = await this.flatsService.getFilteredFlats(
      +pageSize,
      +pageOffset,
      number,
      buildingName,
      floorNumber,
      sortBy,
      sortOrder,
      user.id,
      +societyId,
      +buildingId,
      +floorId,
      true
    );
    return listsite;
  }

  // @UseGuards(AuthGuard)
  // @Post('/societies/:societyId/buildings/:buildingId/floors/:floorId/flats/:id/:status')
  // @HttpCode(HttpStatus.NO_CONTENT)
  // @ApiOkResponse()
  // softDelete(@Param('id') id: number, @Param('status') status: string) {
  //   return this.flatsService.softDeleteFlat(id, status);
  // }

  @ApiTags('flats')
  @ApiOperation({ summary: 'delete flat associated with building' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.FOUNTLAB_ADMIN, Role.ORGANIZATION_ADMIN, Role.SOCIETY_ADMIN)
  @Delete(
    '/societies/:societyId/buildings/:buildingId/floors/:floorId/flats/:id'
  )
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse()
  //   @Roles(Role.FOUNTLAB_ADMIN)
  hardDeleteFlat(
    @Param('societyId') societyId: number,
    @Param('buildingId') buildingId: number,
    @Param('floorId') floorId: number,
    @Param('id') id: number
  ) {
    return this.flatsService.deleteFlat(+societyId, +buildingId, +floorId, +id);
  }
}
