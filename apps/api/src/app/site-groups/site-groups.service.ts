import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  OrganizationRoleName,
  PrismaClient,
  SuperRoleName,
} from '@prisma/client';
import { SiteGroupDto } from './dto/site-group.dto';
import { ListSiteGroupPageDto } from './dto/list-site-group-page.dto';
import { AddSiteGroupDto } from './dto/add-site-group.dto';
import { ViewSiteGroupDto } from './dto/view-site-group.dto';

@Injectable()
export class SiteGroupsService {
  private prisma = new PrismaClient();

  async add(addSiteGroupDto: AddSiteGroupDto): Promise<SiteGroupDto> {
    const orgCheck = await this.prisma.organization.findFirst({
      where: { id: addSiteGroupDto.organizationId },
    });
    if (!orgCheck) {
      throw new NotFoundException();
    } else {
      const addsitegroups = await this.prisma.siteGroup.create({
        data: addSiteGroupDto,
      });
      return addsitegroups;
    }
  }

  async findById(id: number, userId: number): Promise<ViewSiteGroupDto> {
    const groupView = await this.prisma.siteGroup.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        name: true,
        organization: { select: { id: true, name: true } },
      },
    });
    if (!groupView) {
      throw new NotFoundException();
    } else {
      const checkAdmin = await this.checkFntAdmin(userId);
      if (checkAdmin) {
        return groupView;
      } else {
        const check = await this.getUserAuth(groupView.organization.id, userId);
        if (!check) {
          throw new ForbiddenException();
        }
        return groupView;
      }
    }
  }

  async edit(siteGroupDto: SiteGroupDto, id: number): Promise<SiteGroupDto> {
    const check = await this.prisma.siteGroup.findUnique({
      where: { id: Number(id) },
    });
    if (!check) {
      throw new NotFoundException();
    } else {
      const checkgroup = await this.prisma.organization.findFirst({
        where: { id: siteGroupDto.organizationId },
      });
      if (!checkgroup) {
        throw new NotFoundException();
      } else {
        const updatgrp = await this.prisma.siteGroup.update({
          where: { id: Number(id) },
          data: siteGroupDto,
        });

        return updatgrp;
      }
    }
  }

  async getFilteredPosts(
    pageSize: number,
    pageOffset: number,
    name: string,
    organizationsId: number,
    sortBy: string,
    sortOrder: 'asc' | 'desc',
    userID: number
  ): Promise<ListSiteGroupPageDto> {
    const whereArray = [];

    let organizationIdFilter = [];

    let whereQuery = {};
    const checkAdmin = await this.checkFntAdmin(userID);
    if (checkAdmin) {
      organizationIdFilter = await this.findAllGroups(organizationIdFilter);
      organizationIdFilter = this.checkOrganizationinAray(
        organizationsId,
        organizationIdFilter
      );

      whereArray.push({ organizationId: { in: organizationIdFilter } });

      if (name !== undefined) {
        whereArray.push({ name: { contains: name,mode:'insensitive' } });
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
      const count = await this.prisma.siteGroup.count({
        where: whereQuery,
      });

      const list = await this.prisma.siteGroup.findMany({
        where: whereQuery,
        select: {
          id: true,
          name: true,
          organization: { select: { id: true, name: true } },
        },
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
        content: list,
      };
    } else {
      const orgId = await this.listOrgId(userID);

      for (const org of orgId) {
        const orgIds = await this.getUserAuth(org, userID);
        if (orgIds) {
          organizationIdFilter.push(org);
        }
      }

      organizationIdFilter = this.checkOrganizationinAray(
        organizationsId,
        organizationIdFilter
      );

      whereArray.push({ organizationId: { in: organizationIdFilter } });

      if (name !== undefined) {
        whereArray.push({ name: { contains: name ,mode:'insensitive'} });
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
      const count = await this.prisma.siteGroup.count({
        where: whereQuery,
      });

      const list = await this.prisma.siteGroup.findMany({
        where: whereQuery,
        select: {
          id: true,
          name: true,
          organization: { select: { id: true, name: true } },
        },
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
        content: list,
      };
    }
  }

  async deleteGrp(id: number): Promise<void> {
    const check = await this.prisma.siteGroup.findUnique({
      where: { id: Number(id) },
    });
    if (!check) {
      throw new NotFoundException();
    } else {
      await this.prisma.siteGroup.delete({
        where: { id: Number(id) },
      });
      return;
    }
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
    //console.log('is he admin o forganizatioans', orcondition);
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

  async listOrgId(id: number) {
    const orgrole = await this.prisma.organizationRole.findFirst({
      where: { name: OrganizationRoleName.ADMIN },
    });
    const orcondition = await this.prisma.userOrganizationRole.findMany({
      where: {
        userId: id,
        organizationRoleId: orgrole.id,
      },
      select: {
        organizationId: true,
      },
    });
    const organizations = [];
    orcondition.forEach((value) => organizations.push(value.organizationId));
    return organizations;
  }

  async findAllGroups(organizationIdFilter: number[]) {
    const allGroups = await this.prisma.siteGroup.findMany({
      select: { organizationId: true },
    });
    allGroups.forEach((value) =>
      organizationIdFilter.push(value.organizationId)
    );
    return organizationIdFilter;
  }

  checkOrganizationinAray(orgId: number, organizationIdFilter: number[]) {
    if (orgId) {
      if (organizationIdFilter.includes(Number(orgId))) {
        const organizationIdFilter = [];
        organizationIdFilter.push(orgId);
        return organizationIdFilter;
      } else {
        throw new ForbiddenException();
      }
    } else {
      return organizationIdFilter;
    }
  }
}
