import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  OrganizationRoleName,
  PrismaClient,
  SocietyRoleName,
  SuperRoleName,
} from '@prisma/client';
import { ListDevicesPageDto } from './dto/list-devices-page.dto';
import { AddDevicesDto, EditDevicesDto, EditDevicesKeyDto, EditDevicesSettingDto, EditDevicesStatusDto } from './dto/add-devices.dto';
import { ViewDeviceDto } from './dto/view-devices.dto';
import { encodePassword } from '../auth/bcrypt';
import { MainFluxService } from '../mainflux/mainflux.service';
import { EditDevicesStatus } from '@fnt-flsy/data-transfer-types';
import { CreateImageDto } from './dto/add-devices-images.dto';

@Injectable()
export class DevicesService {
  private prisma = new PrismaClient();
  constructor(private mainFluxService: MainFluxService) { }

  async addDevice(societyId: number, device: AddDevicesDto): Promise<ViewDeviceDto> {
    const society = await this.prisma.society.findFirst({
      where: {
        id: societyId
      }
    })
    if (!society) {
      throw new HttpException("society not exist", HttpStatus.NOT_FOUND);
    }
    const uniqueDevice = await this.prisma.device.findFirst({
      where: {
        deviceId: device.deviceId,
      },
    });
    if (uniqueDevice) {
      throw new HttpException('Device already exists', HttpStatus.BAD_REQUEST);
    }

    const thingResponse = await this.mainFluxService.createThing(
      device.deviceId
    );
    console.log('thingResponse', thingResponse);
    if (!(thingResponse && thingResponse.status == 201)) {
      throw new HttpException(
        'Error creating thing',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    const thingId = thingResponse.data.things[0].id;
    const thingKey = thingResponse.data.things[0].key;
    const channelResponse = await this.mainFluxService.createChannel(
      device.deviceId
    );
    console.log('thingId', thingId);
    console.log('thingKey', thingKey);

    if (!(channelResponse && channelResponse.status == 201)) {
      // delete thing if channel is not created
      await this.mainFluxService.deleteThing(thingId);
      throw new HttpException(
        'Error creating channel',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    const channelId = channelResponse.data.channels[0].id;
    const connectionResponse = await this.mainFluxService.connectThingChannel(
      thingId,
      channelId
    );
    if (!(connectionResponse && connectionResponse.status === 200)) {
      // delete thing and channel if connection fails
      await this.mainFluxService.deleteChannel(channelId);
      await this.mainFluxService.deleteThing(thingId);
      throw new HttpException(
        'Error connecting thing and channel',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    const deviceKey = encodePassword(device.deviceKey);



    // if(device.siteId!=0){
    //   const siteId = await this.prisma.site.findFirst({
    //     where: {
    //       id: device.siteId,
    //     },
    //   });
    //   if (!siteId) {
    //     throw new NotFoundException();
    //   }
    //  const newDevice = await this.prisma.device.create({
    //     data: {
    //       deviceId: device.deviceId,
    //       deviceKey: deviceKey,
    //       name: device.name,
    //       thingId: thingId,
    //       thingKey: thingKey,
    //       channelId: channelId,
    //       isActive: true,
    //       lastSyncTimestamp: 0,
    //       type:device.type,
    //       siteId: device.siteId,
    //     },
    //   });
    //   if (newDevice == undefined) {
    //     //delete thing and channel if device is not created
    //     await this.mainFluxService.deleteChannel(channelId);
    //     await this.mainFluxService.deleteThing(thingId);
    //     throw new HttpException(
    //       'Error creating device',
    //       HttpStatus.INTERNAL_SERVER_ERROR
    //     );
    //   }
    //   const newDeviceView = await this.getView(newDevice);
    //   return newDeviceView;
    // }
    if (societyId != 0) {

      const newDevice = await this.prisma.device.create({
        data: {
          deviceId: device.deviceId,
          deviceKey: deviceKey,
          name: device.name,
          thingId: thingId,
          thingKey: thingKey,
          channelId: channelId,
          isActive: true,
          lastSyncTimestamp: 0,
          type: device.type,
          societyId: societyId,
        },
      });
      if (newDevice == undefined) {
        //delete thing and channel if device is not created
        await this.mainFluxService.deleteChannel(channelId);
        await this.mainFluxService.deleteThing(thingId);
        throw new HttpException(
          'Error creating device',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
      const newDeviceView = await this.getView(newDevice);
      return newDeviceView;
    }



  }

  async addDeviceImage(societyId: number, createImageDto: CreateImageDto, file: Express.Multer.File) {

    const { device_id, } = createImageDto;

    const device = await this.prisma.device.findFirst({
      where: {
        id: Number(device_id)
      }
    })

    if (!device) {
      throw new NotFoundException('device not found');
    }

    // Check if the device image exists
    const deviceImage = await this.prisma.deviceImage.findFirst({
      where: { deviceId: Number(device_id) },
    });

    if (deviceImage) {
      throw new NotFoundException('device Is already uplodaded');
    }

    // Update the device with the image data
    const newdeviceImage = await this.prisma.deviceImage.create({
      data: {
        deviceId: Number(device_id),
        image: file.buffer
      }, // Assuming image is a base64-encoded string
    });

    if (!newdeviceImage) {
      throw new InternalServerErrorException('device image upload failed internally')
    }

    return newdeviceImage;

  }

  async deleteDeviceImage(id: number, societyId: number) {
    const society = await this.prisma.society.findFirst({
      where: {
        id: societyId
      }
    })
    if (!society) {
      throw new HttpException('society not found', HttpStatus.NOT_FOUND);
    }
    const deviceImage = await this.prisma.deviceImage.findFirst({
      where: {
        deviceId: id
      }
    })
    if (!deviceImage) {
      throw new HttpException(
        "device Image not found",
        HttpStatus.NOT_FOUND
      )
    }

    await this.prisma.deviceImage.delete({
      where: {
        id: deviceImage.id
      }
    })

    return
  }

  async deleteDevice(id: number, societyId: number): Promise<void> {
    const society = await this.prisma.society.findFirst({
      where: {
        id: societyId
      }
    })

    if (!society) {
      throw new HttpException("Society not found", HttpStatus.NOT_FOUND);
    }

    const device = await this.prisma.device.findFirst({
      where: {
        id: id,
      },
    });
    if (!device) {
      throw new HttpException('Device not found', HttpStatus.NOT_FOUND);
    }
    const channelResponse = await this.mainFluxService.deleteChannel(
      device.channelId
    );
    if (channelResponse.status !== 204) {
      throw new HttpException(
        'Error deleting channel',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    const thingResponse = await this.mainFluxService.deleteThing(
      device.thingId
    );
    if (thingResponse.status !== 204) {
      throw new HttpException(
        'Error deleting thing',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    const dele = await this.prisma.device.findUnique({
      where: { id: Number(id) },
    });
    if (!dele) {
      throw new NotFoundException();
    } else {
      await this.prisma.device.delete({ where: { id: Number(id) } });
      return;
    }
  }

  async findDeviceImage(id: number, societyId: number) {
    const society = await this.prisma.society.findFirst({
      where: {
        id: societyId
      }
    })
    if (!society) throw new HttpException("society not found", HttpStatus.NOT_FOUND);

    const device = await this.prisma.device.findFirst({
      where: {
        id: id
      }
    })

    if (!device) throw new HttpException("device not found", HttpStatus.NOT_FOUND);

    const image = await this.prisma.deviceImage.findFirst({
      where: {
        deviceId: id
      },
      select: {
        image: true,
      }
    })
    if(!image){
      throw new HttpException("image not found", HttpStatus.NOT_FOUND);
    }
    return image.image;
  }

  async findById(Id: number, societyId: number, userId: number): Promise<ViewDeviceDto> {
    const checkAdmin = await this.checkFntAdmin(userId);
    const checkSocietyAdmin = await this.checkSocietyAdmin(userId);

    if (checkAdmin || checkSocietyAdmin) {

      if (checkAdmin) {
        const device = await this.prisma.device.findUnique({
          where: {
            id: Number(Id),
            societyId: societyId
          },
          select: {
            id: true,
            deviceId: true,
            name: true,
            thingId: true,
            thingKey: true,
            channelId: true,
            type: true,
            isActive: true,
            society: {
              select: {
                id: true,
                name: true,
              }
            },
            // site: {
            //   select: {
            //     id: true,
            //     name: true,
            //     siteGroup: {
            //       select: {
            //         id: true,
            //         name: true,
            //         organization: { select: { id: true, name: true } },
            //       },
            //     },
            //   },
            // },
          },
        });
        return device;

      }
      else if (checkSocietyAdmin) {
        const device = await this.prisma.device.findUnique({
          where: {
            id: Number(Id),
            societyId: societyId
          },
          select: {
            id: true,
            name: true,
            type: true,
            isActive: true,
            // lastSyncTimestamp: true,
            society: {
              select: {
                id: true,
                name: true,
              }
            },
            // site: {
            //   select: {
            //     id: true,
            //     name: true,
            //     siteGroup: {
            //       select: {
            //         id: true,
            //         name: true,
            //         organization: { select: { id: true, name: true } },
            //       },
            //     },
            //   },
            // },
          },
        });
        return device;

      } else {
        throw new HttpException("user must be admin or superadmin", HttpStatus.BAD_REQUEST);
      }
    }


    // if (!device) {
    //   throw new NotFoundException();
    // } else {
    //   const checkAdmin = await this.checkFntAdmin(userId);
    //   if (checkAdmin) {
    //     const newdevice = await this.getView(device);
    //     return newdevice;
    //   } else {
    //     const check = await this.getUserAuth(Id, userId);
    //     if (!check) {
    //       throw new ForbiddenException();
    //     }
    //     const newdevice = await this.getView(device);
    //     return newdevice;
    //   }
    // }
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

  async checkSocietyAdmin(id: number) {
    const societyRole = await this.prisma.societyRole.findFirst({
      where: { name: SocietyRoleName.ADMIN },
    });
    const doAllow =
      (await this.prisma.userSocietyRole.count({
        where: { userId: Number(id), societyRoleId: societyRole.id },
      })) > 0;
    return doAllow;
  }

  async edit(editDevice: EditDevicesDto, Id: number, societyId: number, userId: number,): Promise<ViewDeviceDto> {
    const checkAdmin = await this.checkFntAdmin(userId);
    const checkSocietyAdmin = await this.checkSocietyAdmin(userId);
    if (checkAdmin || checkSocietyAdmin) {
      const society = await this.prisma.society.findFirst({
        where: {
          id: societyId
        }
      })

      if (!society) {
        throw new HttpException("Society not found", HttpStatus.NOT_FOUND);
      }

      const checkDevice = await this.prisma.device.findUnique({
        where: { id: Id },
      });

      if (!checkDevice) {
        throw new NotFoundException();
      }
      if (checkAdmin) {
        const updatedevice = await this.prisma.device.update({
          where: { id: Number(Id) },
          select: {
            id: true,
            deviceId: true,
            name: true,
            thingId: true,
            thingKey: true,
            channelId: true,
            isActive: true,
            type: true,
            society: {
              select: {
                id: true,
                name: true
              }
            }
          },
          data: {
            name: editDevice.name
          },
        });

        // const device = await this.getView(updatedevice);

        return updatedevice;

      } else if (checkSocietyAdmin) {
        const updatedevice = await this.prisma.device.update({
          where: { id: Number(Id) },
          select: {
            id: true,
            name: true,
            isActive: true,
            type: true,
            society: {
              select: {
                id: true,
                name: true
              }
            }
          },
          data: {
            name: editDevice.name
          },
        });

        // const device = await this.getView(updatedevice);

        return updatedevice;
      }
    }



  }

  async editDeviceSetting(editDevice: EditDevicesSettingDto, Id: number, societyId: number, userId: number,): Promise<ViewDeviceDto> {
    const checkAdmin = await this.checkFntAdmin(userId);
    const checkSocietyAdmin = await this.checkSocietyAdmin(userId);
    if (checkAdmin || checkSocietyAdmin) {
      const society = await this.prisma.society.findFirst({
        where: {
          id: societyId
        }
      })
      if (!society) {
        throw new HttpException("society not exist", HttpStatus.NOT_FOUND);
      }

      const checkDevice = await this.prisma.device.findUnique({
        where: { id: Id },
      });
      if (!checkDevice) {
        throw new NotFoundException();
      }

      if (checkAdmin) {
        const updatedevice = await this.prisma.device.update({
          where: { id: Number(Id) },
          select: {
            id: true,
            deviceId: true,
            name: true,
            thingId: true,
            thingKey: true,
            channelId: true,
            isActive: true,
            type: true,
            society: {
              select: {
                id: true,
                name: true
              }
            }
          },
          data: {
            deviceId: editDevice.deviceId,
            thingId: editDevice.thingId,
            thingKey: editDevice.thingKey,
            channelId: editDevice.channelId,
            type: editDevice.type
          },
        });

        return updatedevice;


      } else if (checkSocietyAdmin) {
        const updatedevice = await this.prisma.device.update({
          where: { id: Number(Id) },
          select: {
            id: true,
            name: true,
            isActive: true,
            type: true,
            society: {
              select: {
                id: true,
                name: true
              }
            }
          },
          data: {
            deviceId: editDevice.deviceId,
            thingId: editDevice.thingId,
            thingKey: editDevice.thingKey,
            channelId: editDevice.channelId,
            type: editDevice.type
          },
        });

        return updatedevice;

      }

    }



  }

  async editDeviceKey(editDevice: EditDevicesKeyDto, Id: number, societyId: number, userId: number,): Promise<void> {
    const checkAdmin = await this.checkFntAdmin(userId);
    const checkSocietyAdmin = await this.checkSocietyAdmin(userId);
    if (checkAdmin || checkSocietyAdmin) {
      const society = await this.prisma.society.findFirst({
        where: {
          id: societyId
        }
      })
      if (!society) {
        throw new HttpException("society not exist", HttpStatus.NOT_FOUND);
      }

      const checkDevice = await this.prisma.device.findUnique({
        where: { id: Id },
      });
      if (!checkDevice) {
        throw new NotFoundException();
      }
      const updatedevice = await this.prisma.device.update({
        where: { id: Number(Id) },
        data: {
          deviceKey: encodePassword(editDevice.deviceKey),
        },
      });


      return;

    }


  }

  async editDeviceStatus(editDevice: EditDevicesStatusDto, Id: number, societyId: number, userId: number,): Promise<EditDevicesStatusDto> {
    const society = await this.prisma.society.findFirst({
      where: {
        id: societyId
      }
    })
    if (!society) {
      throw new HttpException("society not exist", HttpStatus.NOT_FOUND);
    }

    const checkDevice = await this.prisma.device.findUnique({
      where: { id: Id },
    });
    if (!checkDevice) {
      throw new NotFoundException();
    }
    const updatedevice = await this.prisma.device.update({
      where: { id: Number(Id) },
      data: {
        isActive: editDevice.isActive,
      },
    });

    if (updatedevice) return editDevice;
  }

  // TODO: add societyName, deviceId, societyId, status for search Query.
  async getFilteredPosts(
    pageSize: number,
    pageOffset: number,
    sitesId: number,
    name: string,
    deviceId: string,
    societyName: string,
    societyId: number,
    status: string,
    sortBy: string,
    sortOrder: 'asc' | 'desc',
    userId: number,
    societyIdParam: number
  ): Promise<ListDevicesPageDto> {
    const whereArray = [];

    let siteIdFilter = [];

    let whereQuery = {};

    console.log(societyIdParam);


    const checkAdmin = await this.checkFntAdmin(userId);
    const checkSocietyAdmin = await this.checkSocietyAdmin(userId);

    if (checkAdmin || checkSocietyAdmin) {

      if (sitesId !== undefined && !isNaN(sitesId)) {
        siteIdFilter = await this.findAllSites(siteIdFilter);
        siteIdFilter = this.checkSiteinAray(sitesId, siteIdFilter);

        whereArray.push({ siteId: { in: siteIdFilter } });

      }


      if (name !== undefined) {
        whereArray.push({ name: { contains: name, mode: 'insensitive' } });
      }

      if (deviceId !== undefined) {
        whereArray.push({ deviceId: { contains: deviceId, mode: 'insensitive' } });
      }

      if (status !== undefined) {
        if (status == 'active') {
          whereArray.push({ isActive: true });

        } else if (status == 'inactive') {
          whereArray.push({ isActive: false });

        } else if (status == 'all') {
          whereArray.push({ isActive: true });
          whereArray.push({ isActive: false });

        } else {
          throw new HttpException("status should be one of 'active', 'inactive', 'all'. ", HttpStatus.BAD_REQUEST);
        }

      }

      if (societyName !== undefined) {
        whereArray.push({ society: { name: { contains: societyName, mode: 'insensitive' } } });
      }

      if ((societyId !== undefined && !isNaN(societyId)) || (societyIdParam != undefined)) {
        if (!isNaN(societyId)) whereArray.push({ societyId: societyId });
        else if ((societyIdParam != undefined)) whereArray.push({ societyId: societyIdParam });
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
      const count = await this.prisma.device.count({
        where: whereQuery,
      });

      if (checkAdmin) {
        const listDevices = await this.prisma.device.findMany({
          where: whereQuery,
          select: {
            id: true,
            deviceId: true,
            name: true,
            thingId: true,
            thingKey: true,
            channelId: true,
            isActive: true,
            type: true,
            site: {
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
            },
            society: {
              select: {
                id: true,
                name: true
              }
            }
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
          content: listDevices,
        };
      } else if (checkSocietyAdmin) {
        const listDevices = await this.prisma.device.findMany({
          where: whereQuery,
          select: {
            id: true,
            name: true,
            isActive: true,
            type: true,
            site: {
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
            },
            society: {
              select: {
                id: true,
                name: true
              }
            }
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
          content: listDevices,
        };

      }

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
        siteIdFilter.push(groupIds);
      }

      const allGroupsFilter = [].concat(...siteIdFilter);
      const allSites = [];
      for (const site of allGroupsFilter) {
        const siteIds = await this.listSites(site);
        allSites.push(siteIds);
      }

      let allSiteIds = [].concat(...allSites);
      allSiteIds = this.checkSiteinAray(sitesId, allSiteIds);
      whereArray.push({ siteId: { in: allSiteIds } });

      if (name !== undefined) {
        whereArray.push({ name: { contains: name, mode: 'insensitive' } });
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
      const count = await this.prisma.device.count({
        where: whereQuery,
      });

      const listDevices = await this.prisma.device.findMany({
        where: whereQuery,
        select: {
          id: true,
          deviceId: true,
          name: true,
          thingId: true,
          thingKey: true,
          channelId: true,
          site: {
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
        content: listDevices,
      };
    }
  }

  async findAllSites(siteIdFilter: number[]) {
    const allsites = await this.prisma.device.findMany({
      select: { siteId: true },
    });
    allsites.forEach((value) => siteIdFilter.push(value.siteId));
    return siteIdFilter;
  }

  checkSiteinAray(sitesId: number, allSites: number[]) {
    if (sitesId) {
      if (allSites.includes(Number(sitesId))) {
        const allSites = [];
        allSites.push(sitesId);
        return allSites;
      } else {
        throw new ForbiddenException();
      }
    } else {
      return allSites;
    }
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

  async listSites(id: number) {
    const AssociatedSites = await this.prisma.site.findMany({
      where: {
        siteGroupId: id,
      },
      select: {
        id: true,
      },
    });
    const listSites = [];
    AssociatedSites.forEach((value) => listSites.push(value.id));
    return listSites;
  }

  async getView(device) {
    if (device.societyId != 0) {
      const society = await this.prisma.society.findFirst({
        where: {
          id: device.societyId
        }
      })
      return {
        id: device.id,
        deviceId: device.deviceId,
        name: device.name,
        thingId: device.thingId,
        thingKey: device.thingKey,
        channelId: device.channelId,
        type: device.type,
        isActive: device.isActive,
        lastSyncTimestamp: device.lastSyncTimeStamp,
        society: {
          id: society.id,
          name: society.name,
        },
      };

    }
    else if (device.siteId != 0) {
      const site = await this.prisma.site.findFirst({
        where: { id: device.id },
      });

      const siteGroup = await this.prisma.siteGroup.findFirst({
        where: { id: site.siteGroupId },
      });

      const organization = await this.prisma.organization.findFirst({
        where: { id: siteGroup.organizationId },
        select: { id: true, name: true },
      });

      return {
        id: device.id,
        deviceId: device.deviceId,
        name: device.name,
        thingId: device.thingId,
        thingKey: device.thingKey,
        channelId: device.channelId,
        lastSyncTimestamp: device.lastSyncTimeStamp,
        site: {
          id: site.id,
          name: site.name,
          siteGroup: {
            id: siteGroup.id,
            name: siteGroup.name,
            organization: {
              id: organization.id,
              name: organization.name,
            },
          },
        },
      };

    } else {
      return {
        id: device.id,
        deviceId: device.deviceId,
        name: device.name,
        thingId: device.thingId,
        thingKey: device.thingKey,
        channelId: device.channelId,
        lastSyncTimestamp: device.lastSyncTimeStamp,
      };
    }

  }

  async transformDeviceArray(deviceArray) {
    const transformedDeviceArray = await Promise.all(
      deviceArray.map(async (item) => {
        const site = await this.prisma.site.findFirst({
          where: { id: item.siteId },
        });

        const siteGroup = await this.prisma.siteGroup.findFirst({
          where: { id: site.siteGroupId },
        });

        const organization = await this.prisma.organization.findFirst({
          where: { id: siteGroup.organizationId },
          select: { id: true, name: true },
        });

        return {
          id: item.id,
          deviceId: item.deviceId,
          name: item.name,
          thingId: item.thingId,
          thingKey: item.thingKey,
          channelId: item.channelId,
          site: {
            id: site.id,
            name: site.name,
            siteGroup: {
              id: siteGroup.id,
              name: siteGroup.name,
              organization: {
                id: organization.id,
                name: organization.name,
              },
            },
          },
        };
      })
    );

    return transformedDeviceArray;
  }
}