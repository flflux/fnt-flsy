import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Put,
  Query,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Body,
} from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { OrganizationDto } from './dto/organization.dto';
import { ListOrganizationPageDto } from './dto/list-organization-page.dto';
import { AddOrganizationDto } from './dto/add-organization.dto';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller('organizations')
export class OrganizationsController {
  constructor(private orgnService: OrganizationsService) {}
  // @UseGuards(AuthGuard, RolesGuard)
  // @Post()
  // @HttpCode(HttpStatus.CREATED)
  // @ApiOkResponse({type: OrganizationDto})
  // @Roles(Role.FOUNTLAB_ADMIN)
  // add(
  //   @Body() addOrganizationDto: AddOrganizationDto
  // ): Promise<OrganizationDto> {
  //   return this.orgnService.add(addOrganizationDto);
  // }

  // @UseGuards(AuthGuard, RolesGuard)
  // @Get('/:id')
  // @HttpCode(HttpStatus.OK)
  // @ApiOkResponse({type: OrganizationDto})
  // @Roles(Role.FOUNTLAB_ADMIN, Role.ORGANIZATION_ADMIN)
  // findById(@Param('id') id: number, @Request() req): Promise<OrganizationDto> {
  //   const { user } = req;
  //   return this.orgnService.findById(id, user.id);
  // }

  // @UseGuards(AuthGuard, RolesGuard)
  // @Put('/:id')
  // @HttpCode(HttpStatus.OK)
  // @ApiOkResponse({type: OrganizationDto})
  // @Roles(Role.FOUNTLAB_ADMIN)
  // edit(
  //   @Body() organizationDto: OrganizationDto,
  //   @Param('id') id: number
  // ): Promise<OrganizationDto> {
  //   return this.orgnService.edit(organizationDto, id);
  // }

  // @UseGuards(AuthGuard, RolesGuard)
  // @Delete('/:id')
  // @HttpCode(HttpStatus.NO_CONTENT)
  // @Roles(Role.FOUNTLAB_ADMIN)
  // deleteOrg(@Param('id') id: number): Promise<void> {
  //   return this.orgnService.deleteOrg(id);
  // }

  // @UseGuards(AuthGuard, RolesGuard)
  // @Get()
  // @HttpCode(HttpStatus.OK)
  // @ApiOkResponse({ type: ListOrganizationPageDto })
  // @Roles(Role.FOUNTLAB_ADMIN)
  // async getFilteredPosts(
  //   @Query('pageSize') pageSize?: number,
  //   @Query('pageOffset') pageOffset?: number,
  //   @Query('name') name?: string,
  //   @Query('type') type?: string,
  //   @Query('sortBy') sortBy?: string,
  //   @Query('sortOrder') sortOrder?: 'asc' | 'desc'
  // ): Promise<ListOrganizationPageDto> {
  //   const listorg = await this.orgnService.getFilteredPosts(
  //     +pageSize,
  //     +pageOffset,
  //     name,
  //     type,
  //     sortBy,
  //     sortOrder
  //   );
  //   return listorg;
  // }
}
