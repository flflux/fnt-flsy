import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AddCardDto } from './dto/add-card.dto';
import { CardDto } from './dto/card.dto';
import { ViewCard } from '@fnt-flsy/data-transfer-types';
import { ViewCardDto } from './dto/view-card.dto';
import { Card, CardType, PrismaClient } from '@prisma/client';
import { ListCardPageDto } from './dto/list-card-page.dto';

@Injectable()
export class CardsService {
  private prisma = new PrismaClient();

  async add(societyId: number, addCardDto: AddCardDto): Promise<CardDto> {
    if (Number.isNaN(societyId))
      throw new HttpException(
        'society id is missing in params',
        HttpStatus.BAD_REQUEST
      );

    const society = await this.prisma.society.findUnique({
      where: {
        id: societyId,
      },
    });
    if (!society)
      throw new HttpException('society not found', HttpStatus.NOT_FOUND);

    const card = await this.prisma.card.findFirst({
      where: {
        number: addCardDto.number,
      },
    });
    if (card)
      throw new HttpException('card already exist!', HttpStatus.BAD_REQUEST);

    return this.prisma.card.create({
      data: {
        number: addCardDto.number,
        vehicleId: addCardDto.vehicleId,
        isActive: addCardDto.isActive,
        type: addCardDto.type,
      },
    });
  }

  async findById(
    societyId: number,
    id: number,
    userId: number
  ): Promise<ViewCardDto> {
    if (Number.isNaN(societyId) || Number.isNaN(id))
      throw new HttpException(
        'society id is missing in params',
        HttpStatus.BAD_REQUEST
      );

    const society = await this.prisma.society.findUnique({
      where: {
        id: societyId,
      },
    });
    if (!society)
      throw new HttpException('society not found', HttpStatus.NOT_FOUND);

    const card = await this.prisma.card.findUnique({
      where: { id: Number(id) },
    });
    if (!card) {
      throw new HttpException('card not found', HttpStatus.NOT_FOUND);
    } else {
      return card;
      //   const checkAdmin = await this.checkFntAdmin(userId);
      //   if (checkAdmin) {
      //     return siteView;
      //   }
      //    else {
      //     const orgId = await this.prisma.siteGroup.findUnique({
      //       where: { id: siteview.siteGroupId },
      //     });
      //     const check = await this.getUserAuth(orgId.organizationId, userId);
      //     if (!check) {
      //       throw new ForbiddenException();
      //     }
      //     return siteView;
    }
  }

  async edit(
    societyId: number,
    cardDto: CardDto,
    id: number
  ): Promise<CardDto> {
    if (Number.isNaN(societyId) || Number.isNaN(id))
      throw new HttpException(
        'society id is missing in params',
        HttpStatus.BAD_REQUEST
      );

    const society = await this.prisma.society.findUnique({
      where: {
        id: societyId,
      },
    });
    if (!society)
      throw new HttpException('society not found', HttpStatus.NOT_FOUND);

    if (!cardDto || !id)
      throw new HttpException(
        'cardDto or id is missing',
        HttpStatus.BAD_REQUEST
      );
    const checkCard = await this.prisma.card.findUnique({
      where: { id: Number(id) },
    });
    if (!checkCard) {
      throw new HttpException('card not found', HttpStatus.NOT_FOUND);
    } else {
      const checkVehicle = await this.prisma.vehicle.findFirst({
        where: { id: cardDto.vehicleId },
      });
      if (!checkVehicle) {
        throw new HttpException('vehicle not found', HttpStatus.NOT_FOUND);
      } else {
        const updatedCard = await this.prisma.card.update({
          where: { id: Number(id) },
          data: cardDto,
        });
        return updatedCard;
      }
    }
  }

  async getFilteredCards(
    pageSize: number,
    pageOffset: number,
    number: string,
    isActive: string,
    type: CardType,
    vehicleId: number,
    sortBy: string,
    sortOrder: 'asc' | 'desc',
    userId: number,
    societyId: number
  ): Promise<ListCardPageDto> {
    if (Number.isNaN(societyId))
      throw new HttpException(
        'society id is missing in params',
        HttpStatus.BAD_REQUEST
      );

    const society = await this.prisma.society.findUnique({
      where: {
        id: societyId,
      },
    });
    if (!society)
      throw new HttpException('society not found', HttpStatus.NOT_FOUND);

    const whereArray = [];

    // let groupIdFilter = [];

    let whereQuery = {};
    // const checkAdmin = await this.checkFntAdmin(userId);

    // if (checkAdmin) {
    //   groupIdFilter = await this.findAllSites(groupIdFilter);
    //   groupIdFilter = this.checkGroupinAray(groupsId, groupIdFilter);

    //   whereArray.push({ siteGroupId: { in: groupIdFilter } });

    //   if (name !== undefined) {
    //     whereArray.push({ name: { contains: name } });
    //   }
    //   if (whereArray.length > 0) {
    //     if (whereArray.length > 1) {
    //       whereQuery = { AND: whereArray };
    //     } else {
    //       whereQuery = whereArray[0];
    //     }
    //   }
    //   const sort = (sortBy ? sortBy : 'id').toString();
    //   const order = sortOrder ? sortOrder : 'asc';
    //   const size = pageSize ? pageSize : 10;
    //   const offset = pageOffset ? pageOffset : 0;
    //   const orderBy = { [sort]: order };
    //   const count = await this.prisma.site.count({
    //     where: whereQuery,
    //   });

    //   const listsite = await this.prisma.site.findMany({
    //     where: whereQuery,
    //     take: Number(size),
    //     skip: Number(size * offset),
    //     orderBy,
    //   });

    //   const listSites=await this.transformSiteArray(listsite)

    //   return {
    //     size: size,
    //     number: offset,
    //     total: count,
    //     sort: [
    //       {
    //         by: sort,
    //         order: order,
    //       },
    //     ],
    //     content: listSites,
    //   };
    // }
    //
    // else {
    //   const organizationIdFilter = [];
    //   const orgId = await this.listOrgId(userId);

    //   for (const org of orgId) {
    //     const orgIds = await this.getUserAuth(org, userId);
    //     if (orgIds) {
    //       organizationIdFilter.push(org);
    //     }
    //   }
    //   for (const orgId of organizationIdFilter) {
    //     const groupIds = await this.listGroups(orgId);
    //     groupIdFilter.push(groupIds);
    //   }

    //   let allGroupsFilter = [].concat(...groupIdFilter);
    //   allGroupsFilter = this.checkGroupinAray(groupsId, allGroupsFilter);
    //   whereArray.push({ siteGroupId: { in: allGroupsFilter } });

    if (number !== undefined) {
      whereArray.push({ number: { contains: number ,mode:'insensitive'} });
    }

    if (isActive !== undefined) {
      if (isActive == 'true') whereArray.push({ isActive: true });
      else if (isActive == 'false') whereArray.push({ isActive: false });
      else
        throw new HttpException(
          'isActive should be either true or false',
          HttpStatus.BAD_REQUEST
        );
    }

    if (vehicleId !== undefined) {
      if (!isNaN(vehicleId)) whereArray.push({ vehicleId: vehicleId });
    }

    if (type !== undefined) {
      whereArray.push({ type: CardType[type] });
    }

    if (whereArray.length > 0) {
      if (whereArray.length > 1) {
        whereQuery = { AND: whereArray };
      } else {
        whereQuery = whereArray[0];
      }
    }

    const sort = (sortBy ? sortBy : 'id').toString();
    const order = sortOrder ? sortOrder : 'asc';
    const size = pageSize ? pageSize : 10;
    const offset = pageOffset ? pageOffset : 0;
    const orderBy = { [sort]: order };

    console.log(whereQuery);

    const count = await this.prisma.flat.count({
      where: whereQuery,
    });

    const ListCard = await this.prisma.card.findMany({
      where: whereQuery,

      take: Number(size),
      skip: Number(size * offset),
      orderBy,
    });

    return {
      size: size,
      number: offset,
      total: count,
      sort: [
        {
          by: sort,
          order: order,
        },
      ],
      content: ListCard,
    };
    // }
  }

  async softDeleteCard(societyId: number, id: number): Promise<void> {
    if (Number.isNaN(societyId) || Number.isNaN(id))
      throw new HttpException(
        'society id is missing in params',
        HttpStatus.BAD_REQUEST
      );

    const society = await this.prisma.society.findUnique({
      where: {
        id: societyId,
      },
    });
    if (!society)
      throw new HttpException('society not found', HttpStatus.NOT_FOUND);

    const card = await this.prisma.card.findFirst({
      where: { id: id },
    });
    if (!card) throw new HttpException('card not found', HttpStatus.NOT_FOUND);
    const updatedCard = await this.prisma.card.update({
      where: {
        id: id,
      },
      data: {
        isActive: false,
      },
    });
    if (!updatedCard)
      throw new HttpException(
        'Error in the softdelete',
        HttpStatus.BAD_REQUEST
      );
    return;
  }

  async deleteCard(societyId: number, id: number): Promise<void> {
    if (Number.isNaN(societyId) || Number.isNaN(id))
      throw new HttpException(
        'society id is missing in params',
        HttpStatus.BAD_REQUEST
      );

    const society = await this.prisma.society.findUnique({
      where: {
        id: societyId,
      },
    });
    if (!society)
      throw new HttpException('society not found', HttpStatus.NOT_FOUND);

    const card = await this.prisma.card.findFirst({
      where: { id: id },
    });
    if (!card) throw new HttpException('card not found', HttpStatus.NOT_FOUND);

    const deletedCard = await this.prisma.card.delete({
      where: { id: Number(id) },
    });


    if (!deletedCard) {
      throw new HttpException('Error in hard delete', HttpStatus.NOT_FOUND);
    }
    return;
  }
}
