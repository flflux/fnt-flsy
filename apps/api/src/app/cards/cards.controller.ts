import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Request,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { AddCardDto } from './dto/add-card.dto';
import { CardDto, SbCardDto } from './dto/card.dto';
import { ViewCardDto } from './dto/view-card.dto';
import { ListCardDto } from './dto/list-card.dto';
import { AuthGuard } from '../auth/auth.guard';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ListCardPageDto } from './dto/list-card-page.dto';
import { CardType } from '@prisma/client';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller()
export class CardsController {
  constructor(private cardsService: CardsService) {}

  @ApiTags('cards')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.FOUNTLAB_ADMIN, Role.ORGANIZATION_ADMIN, Role.SOCIETY_ADMIN)
  @Post('/societies/:societyId/cards')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: CardDto })
  add(
    @Param('societyId') societyId: number,
    @Body() addCardDto: AddCardDto
  ): Promise<CardDto> {
    return this.cardsService.add(+societyId, addCardDto);
  }

  @ApiTags('cards')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.FOUNTLAB_ADMIN, Role.ORGANIZATION_ADMIN, Role.SOCIETY_ADMIN)
  @Get('/societies/:societyId/cards/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ViewCardDto })
  //   @Roles(Role.ORGANIZATION_ADMIN, Role.FOUNTLAB_ADMIN)
  findById(
    @Param('societyId') societyId: number,
    @Param('id') id: number,
    @Request() req
  ): Promise<ViewCardDto> {
    const { user } = req;
    return this.cardsService.findById(+societyId, +id, user.id);
  }

  @ApiTags('cards')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.FOUNTLAB_ADMIN, Role.ORGANIZATION_ADMIN, Role.SOCIETY_ADMIN)
  @Put('/societies/:societyId/cards/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: CardDto })
  //   @Roles(Role.FOUNTLAB_ADMIN)
  edit(
    @Param('societyId') societyId: number,
    @Body() cardDto: CardDto,
    @Param('id') id: number
  ): Promise<CardDto> {
    return this.cardsService.edit(+societyId, cardDto, +id);
  }

  @ApiTags('cards')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.FOUNTLAB_ADMIN, Role.ORGANIZATION_ADMIN, Role.SOCIETY_ADMIN)
  @Get('/societies/:societyId/cards')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ListCardDto })
  //   @Roles(Role.FOUNTLAB_ADMIN,Role.ORGANIZATION_ADMIN)
  async getFilteredCards(
    @Request() req,
    @Param('societyId') societyId: number,
    @Query('pageSize') pageSize?: number,
    @Query('pageOffset') pageOffset?: number,
    @Query('number') name?: string,
    @Query('vehicleId') vehicleId?: number,
    @Query('isActive') isActive?: string,
    @Query('type') type?: CardType,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc'
  ): Promise<ListCardPageDto> {
    const { user } = req;
    const listsite = await this.cardsService.getFilteredCards(
      +pageSize,
      +pageOffset,
      name,
      isActive,
      type,
      +vehicleId,
      sortBy,
      sortOrder,
      user.id,
      +societyId
    );
    return listsite;
  }

  // @UseGuards(AuthGuard)
  // @Delete('/societies/:societyId/cards/:id')
  // @HttpCode(HttpStatus.NO_CONTENT)
  // @ApiOkResponse()
  // //   @Roles(Role.FOUNTLAB_ADMIN)
  // softDeleteCard(
  //   @Param('societyId') societyId: number,
  //   @Param('id') id: number) {
  //   return this.cardsService.softDeleteCard(+societyId,+id);
  // }

  @ApiTags('cards')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.FOUNTLAB_ADMIN, Role.ORGANIZATION_ADMIN, Role.SOCIETY_ADMIN)
  @Delete('/societies/:societyId/cards/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse()
  //   @Roles(Role.FOUNTLAB_ADMIN)
  hardDeleteFlat(
    @Param('societyId') societyId: number,
    @Param('id') id: number
  ) {
    return this.cardsService.deleteCard(+societyId, +id);
  }


  @ApiTags('schnell-backend')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Activate or Deactivate cards associated with flat for the society' })
  @Put('/societies/:societyCode/flats/:flatNumber/cards')
  @HttpCode(HttpStatus.ACCEPTED)
  async changeCardStatusAssoiatedWithFlatForSociety(
    @Request() req,
    @Param('societyCode') societyCode: string,
    @Param('flatNumber') flatNumber: string,
    @Body() sbCardDto: SbCardDto,
  ) {
    const { user } = req;
    const listsite = await this.cardsService.changeCardStatusAssoiatedWithFlatForSociety(
      societyCode,
      flatNumber,
      sbCardDto
    );
    return listsite;
  }
}
