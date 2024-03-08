import {
  Controller,
  Post,
  Put,
  Get,
  UseGuards,
  Request,
  Query,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { SiteGroupsService } from './site-groups.service';
import { RolesGuard } from '../auth/roles.guard';
import { SiteGroupDto } from "./dto/site-group.dto";
import { AddSiteGroupDto } from "./dto/add-site-group.dto";
import { ListSiteGroupPageDto } from "./dto/list-site-group-page.dto";
import { Role } from '../auth/role.enum';
import { Roles } from '../auth/roles.decorator';
import { ApiOkResponse } from '@nestjs/swagger';
import { ViewSiteGroupDto } from './dto/view-site-group.dto';

@Controller('site-groups')
export class SiteGroupsController {
  constructor(private siteGroupsService: SiteGroupsService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({type: SiteGroupDto})
  @Roles(Role.FOUNTLAB_ADMIN)
  add(@Body() addSiteGroupDto:AddSiteGroupDto):Promise<SiteGroupDto> {
    return this.siteGroupsService.add(addSiteGroupDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({type: ViewSiteGroupDto})
  @Roles(Role.ORGANIZATION_ADMIN, Role.FOUNTLAB_ADMIN)
  findById(@Param('id') id: number, @Request() req):Promise<ViewSiteGroupDto> {
    const { user } = req;
    return this.siteGroupsService.findById(id, user.id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({type: SiteGroupDto})
  @Roles(Role.FOUNTLAB_ADMIN)
  edit(@Body() siteGroupDto:SiteGroupDto, @Param('id') id: number):Promise<SiteGroupDto> {
    return this.siteGroupsService.edit(siteGroupDto, id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({type: ListSiteGroupPageDto})
  @Roles(Role.ORGANIZATION_ADMIN,Role.FOUNTLAB_ADMIN)
  async getFilteredPosts(
    @Request() req,
    @Query('pageSize') pageSize?: number,
    @Query('pageOffset') pageOffset?: number,
    @Query('name') name?: string,
    @Query('organizationId') organizationId?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc'
  ):Promise<ListSiteGroupPageDto> {
    const {user} = req;
    const listgroup = await this.siteGroupsService.getFilteredPosts(
      +pageSize,
      +pageOffset,
      name,
      +organizationId,
      sortBy,
      sortOrder,
      user.id
    );
    return listgroup;
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse()
  @Roles(Role.FOUNTLAB_ADMIN)
  deleteGrp(@Param('id') id: number) {
    return this.siteGroupsService.deleteGrp(id);
  }
}
