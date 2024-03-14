import {
  Controller,
  Get,
  Post,
  Put,
  UseGuards,
  Request,
  Query,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Body,
} from '@nestjs/common';
import { SitesService } from './sites.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Role } from '../auth/role.enum';
import { Roles } from '../auth/roles.decorator';
import { SiteDto } from "./dto/site.dto";
import { ListSitePageDto } from "./dto/list-site-page.dto";
import { AddSiteDto } from "./dto/add-site.dto";
import { ApiOkResponse } from "@nestjs/swagger";
import { ViewSiteDto } from './dto/view-site.dto';


@Controller('sites')
export class SitesController {
  constructor(private sitesService: SitesService) {}

  // @UseGuards(AuthGuard, RolesGuard)
  // @Post()
  // @HttpCode(HttpStatus.CREATED)
  // @ApiOkResponse({type: SiteDto})
  // @Roles(Role.FOUNTLAB_ADMIN)
  // add(@Body() addSiteDto:AddSiteDto):Promise<SiteDto> {
  //   return this.sitesService.add(addSiteDto);
  // }

  // @UseGuards(AuthGuard, RolesGuard)
  // @Get('/:id')
  // @HttpCode(HttpStatus.OK)
  // @ApiOkResponse({type: ViewSiteDto})
  // @Roles(Role.ORGANIZATION_ADMIN, Role.FOUNTLAB_ADMIN)
  // findById(@Param('id') id: number, @Request() req):Promise<ViewSiteDto> {
  //   const { user } = req;
  //   return this.sitesService.findById(id, user.id);
  // }

  // @UseGuards(AuthGuard, RolesGuard)
  // @Put('/:id')
  // @HttpCode(HttpStatus.OK)
  // @ApiOkResponse({type: SiteDto})
  // @Roles(Role.FOUNTLAB_ADMIN)
  // edit(@Body() siteDto:SiteDto, @Param('id') id: number): Promise<SiteDto>{
  //   return this.sitesService.edit(siteDto, id);
  // }

  // @UseGuards(AuthGuard, RolesGuard)
  // @Get()
  // @HttpCode(HttpStatus.OK)
  // @ApiOkResponse({type: ListSitePageDto})
  // @Roles(Role.FOUNTLAB_ADMIN,Role.ORGANIZATION_ADMIN)
  // async getFilteredPosts(
  //   @Request() req,
  //   @Query('pageSize') pageSize?: number,
  //   @Query('pageOffset') pageOffset?: number,
  //   @Query('name') name?: string,
  //   @Query('siteGroupId') siteGroupId?: number,
  //   @Query('sortBy') sortBy?: string,
  //   @Query('sortOrder') sortOrder?: 'asc' | 'desc'
  // ):Promise<ListSitePageDto> {
  //   const {user}=req;
  //   const listsite = await this.sitesService.getFilteredPosts(
  //     +pageSize,
  //     +pageOffset,
  //     name,
  //     +siteGroupId,
  //     sortBy,
  //     sortOrder,
  //     user.id
  //   );
  //   return listsite;
  // }

  // @UseGuards(AuthGuard, RolesGuard)
  // @Delete('/:id')
  // @HttpCode(HttpStatus.NO_CONTENT)
  // @ApiOkResponse()
  // @Roles(Role.FOUNTLAB_ADMIN)
  // deleteOrg(@Param('id') id: number) {
  //   return this.sitesService.deleteSite(id);
  // }
}
