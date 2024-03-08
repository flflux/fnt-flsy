import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  OrganizationRoleName,
  PrismaClient,
  SuperRoleName,
} from '@prisma/client';
import { OrganizationDto } from './dto/organization.dto';
import { ListOrganizationPageDto } from './dto/list-organization-page.dto';
import { AddOrganizationDto } from './dto/add-organization.dto';

@Injectable()
export class OrganizationsService {
  private prisma = new PrismaClient();

  async add(addOrganizationDto: AddOrganizationDto): Promise<OrganizationDto> {
    const checkOrganization = await this.prisma.organization.findUnique({
      where: {
        email: addOrganizationDto.email,
      },
    });
    if (checkOrganization) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Organization already exists',
        },
        HttpStatus.BAD_REQUEST
      );
    }
    const addorg = await this.prisma.organization.create({
      data: addOrganizationDto,
    });
    return addorg;
  }

  async findById(id: number, userId: number): Promise<OrganizationDto> {
    const orgview = await this.prisma.organization.findUnique({
      where: { id: Number(id) },
    });
    if (!orgview) {
      throw new NotFoundException();
    } else {
      const checkAdmin = await this.checkFntAdmin(userId);
      if (checkAdmin) {
        return orgview;
      } else {
        const check = await this.getUserAuth(id, userId);
        if (!check) {
          throw new ForbiddenException();
        }
        return orgview;
      }
    }
  }

  async edit(
    organizationDto: OrganizationDto,
    id: number
  ): Promise<OrganizationDto> {
    const checkOrganization = await this.prisma.organization.findUnique({
      where: { id: Number(id) },
    });
    if (!checkOrganization) {
      throw new NotFoundException();
    } else {
      const org = await this.prisma.organization.findUnique({
        where: {
          email: organizationDto.email,
        },
      });
      if (org.id != id) {
        throw new HttpException(
          'Organization with same email already exists',
          HttpStatus.BAD_REQUEST
        );
      } else {
        const updateorg = this.prisma.organization.update({
          where: { id: Number(id) },
          data: organizationDto,
        });
        return updateorg;
      }
    }
  }

  async deleteOrg(id: number): Promise<void> {
    const dele = await this.prisma.organization.findUnique({
      where: { id: Number(id) },
    });
    if (!dele) {
      throw new NotFoundException();
    } else {
      await this.prisma.organization.delete({ where: { id: Number(id) } });
      return;
    }
  }

  async getFilteredPosts(
    pageSize: number,
    pageOffset: number,
    name: string,
    type: string,
    sortBy: string,
    sortOrder: 'asc' | 'desc'
  ): Promise<ListOrganizationPageDto> {
    const whereArray = [];
    let whereQuery = {};

    if (name !== undefined) {
      whereArray.push({ name: { contains: name ,mode:'insensitive'} });
    }

    if (type !== undefined) {
      whereArray.push({ type: { contains: type ,mode:'insensitive'} });
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
    const count = await this.prisma.organization.count({
      where: whereQuery,
    });

    const listorg = await this.prisma.organization.findMany({
      select: { id: true, name: true, type: true },
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
      content: listorg,
    };
  }

  async getUserAuth(id: number, userId: number) {
    const orgrole = await this.prisma.organizationRole.findFirst({
      where: { name: OrganizationRoleName.ADMIN },
    });
    const orcondition =
      (await this.prisma.userOrganizationRole.count({
        where: {
          userId: userId,
          organizationRoleId: orgrole.id,
          organizationId: Number(id),
        },
      })) > 0;
    return orcondition;
  }

  async checkFntAdmin(id: number) {
    const fntRole = await this.prisma.superRole.findFirst({
      where: { name: SuperRoleName.ADMIN },
    });
    const frcondition =
      (await this.prisma.userSuperRole.count({
        where: { userId: Number(id), superRoleId: fntRole.id },
      })) > 0;
    return frcondition;
  }
}
