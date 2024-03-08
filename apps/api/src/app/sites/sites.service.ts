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
import { SiteDto } from './dto/site.dto';
import { AddSiteDto } from './dto/add-site.dto';
import { ListSitePageDto } from './dto/list-site-page.dto';
import { ViewSiteDto } from './dto/view-site.dto';

@Injectable()
export class SitesService {
  private prisma = new PrismaClient();

  async add(addSiteDto: AddSiteDto): Promise<SiteDto> {
    const checkgroup = await this.prisma.siteGroup.findFirst({
      where: { id: addSiteDto.siteGroupId },
    });
    if (!checkgroup) {
      throw new NotFoundException();
    } else {
      const addgrp = await this.prisma.site.create({ data: addSiteDto });
      return addgrp;
    }
  }

  async findById(id: number, userId: number): Promise<ViewSiteDto> {
    const siteview = await this.prisma.site.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        name: true,
        siteGroup: {
          select: {
            id: true,
            name: true,
            organization: { select: { id: true, name: true } },
          },
        },
      },
    });
    if (!siteview) {
      throw new NotFoundException();
    } else {
      const checkAdmin = await this.checkFntAdmin(userId);
      if (checkAdmin) {
        return siteview;
      } else {
        const orgId = await this.prisma.siteGroup.findUnique({
          where: { id: siteview.siteGroup.id },
        });
        const check = await this.getUserAuth(orgId.organizationId, userId);
        if (!check) {
          throw new ForbiddenException();
        }
        return siteview;
      }
    }
  }

  async edit(siteDto: SiteDto, id: number): Promise<SiteDto> {
    const checksite = await this.prisma.site.findUnique({
      where: { id: Number(id) },
    });
    if (!checksite) {
      throw new NotFoundException();
    } else {
      const checkgroup = await this.prisma.siteGroup.findFirst({
        where: { id: siteDto.siteGroupId },
      });
      if (!checkgroup) {
        throw new NotFoundException();
      } else {
        const updasite = await this.prisma.site.update({
          where: { id: Number(id) },
          data: siteDto,
        });
        return updasite;
      }
    }
  }

  async getFilteredPosts(
    pageSize: number,
    pageOffset: number,
    name: string,
    groupsId: number,
    sortBy: string,
    sortOrder: 'asc' | 'desc',
    userId: number
  ): Promise<ListSitePageDto> {
    const whereArray = [];

    let groupIdFilter = [];

    let whereQuery = {};
    const checkAdmin = await this.checkFntAdmin(userId);

    if (checkAdmin) {
      groupIdFilter = await this.findAllSites(groupIdFilter);
      groupIdFilter = this.checkGroupinAray(groupsId, groupIdFilter);

      whereArray.push({ siteGroupId: { in: groupIdFilter } });

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
      const count = await this.prisma.site.count({
        where: whereQuery,
      });

      const listsite = await this.prisma.site.findMany({
        where: whereQuery,
        select: {
          id: true,
          name: true,
          siteGroup: {
            select: {
              id: true,
              name: true,
              organization: { select: { id: true, name: true } },
            },
          },
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
        content: listsite,
      };
    } else {
      const organizationIdFilter = [];
      const orgId = await this.listOrgId(userId);

      for (const org of orgId) {
        const orgIds = await this.getUserAuth(org, userId);
        if (orgIds) {
          organizationIdFilter.push(org);
        }
      }
      for (const orgId of organizationIdFilter) {
        const groupIds = await this.listGroups(orgId);
        groupIdFilter.push(groupIds);
      }

      let allGroupsFilter = [].concat(...groupIdFilter);
      allGroupsFilter = this.checkGroupinAray(groupsId, allGroupsFilter);
      whereArray.push({ siteGroupId: { in: allGroupsFilter } });

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
      const count = await this.prisma.site.count({
        where: whereQuery,
      });

      const listsite = await this.prisma.site.findMany({
        where: whereQuery,
        select: {
          id: true,
          name: true,
          siteGroup: {
            select: {
              id: true,
              name: true,
              organization: { select: { id: true, name: true } },
            },
          },
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
        content: listsite,
      };
    }
  }

  async deleteSite(id: number): Promise<void> {
    const dele = await this.prisma.site.delete({ where: { id: Number(id) } });
    if (!dele) {
      throw new NotFoundException();
    } else {
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

  async findAllSites(groupIdFilter: number[]) {
    const allGroups = await this.prisma.site.findMany({
      select: { siteGroupId: true },
    });
    allGroups.forEach((value) => groupIdFilter.push(value.siteGroupId));
    return groupIdFilter;
  }

  checkGroupinAray(siteGroupId: number, groupIdFilter: number[]) {
    if (siteGroupId) {
      if (groupIdFilter.includes(Number(siteGroupId))) {
        const groupIdFilter = [];
        groupIdFilter.push(siteGroupId);
        return groupIdFilter;
      } else {
        throw new ForbiddenException();
      }
    } else {
      return groupIdFilter;
    }
  }

  async listGroups(id: number) {
    const AssociatedSiteGroups = await this.prisma.siteGroup.findMany({
      where: {
        organizationId: id,
      },
      select: {
        id: true,
      },
    });
    const AssociatedSiteGroup = [];
    AssociatedSiteGroups.forEach((value) => AssociatedSiteGroup.push(value.id));
    return AssociatedSiteGroup;
  }
}
