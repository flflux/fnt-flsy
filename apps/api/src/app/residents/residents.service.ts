import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ResidentDto } from './dto/residents.dto';
import { PrismaClient, ResidentFlat } from '@prisma/client';
import { AddResidentDto } from './dto/add-resident.dto';
import { ViewResidentDto } from './dto/view-resident.dto';
import { ListResidentPageDto } from './dto/list-resident-page.dto';
import { FileDto } from '../core/dto/page-base.dto';
import * as xlsx from 'xlsx';

@Injectable()
export class ResidentsService {
  private prisma = new PrismaClient();

  async exportResidentsDetailsForSociety(societyId: number){
    const society = await this.prisma.society.findFirst({
      where:{
        id: societyId
      }
    })

    if(!society) throw new HttpException("society not found", HttpStatus.NOT_FOUND);

    // generate vehicle data for the society where the vehicle is associated for the flat
    const residents = await  this.prisma.resident.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        isChild: true,
        isActive: true,
        flats: { 
          select: { 
            flat:{
              select:{
                id: true,
                number:true,
                floor:{
                  select:{
                    id: true,
                    number: true,
                    building: {
                      select:{
                        id: true,
                        name: true,
                        society: {
                          select: {
                            id: true,
                            name: true
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          } 
        },
      },
      where:{
        flats:{
          some:{
            flat:{
              floor:{
                building:{
                  society:{
                    id: societyId
                  }
                }
              }
            }
          }
        }
      }
    })


    const data = [
      ['Id', 'Name', 'Email',"Phone Number", "Is Child", "Is Active", "Flat Number", "Floor Number", "Building Name"  ],
    ];
    
    residents.map((resident)=>{
        data.push([String(resident.id), resident.name,resident.email, String(resident.isChild) , String(resident.isActive), resident.flats[0].flat.number, resident.flats[0].flat.floor.number, resident.flats[0].flat.floor.building.name])
    })

    return data;
  }

  async bulkUploadResidentData(societyId: number,fileDto:FileDto,file){
    const society = await this.prisma.society.findFirst({
      where:{
        id: societyId
      }
    })
    if(!society) throw new HttpException("society not found", HttpStatus.NOT_FOUND);

   
    const workbook = xlsx.read(file.buffer);
    const sheetNames = workbook.SheetNames;
    const sheet = workbook.Sheets[sheetNames[0]];

    const jsonData = xlsx.utils.sheet_to_json(sheet);

    try {
      
        this.prisma.$transaction(async (tx) => {

          let buildingId:number;
          let floorId:number;
          let flatId:number;
          let residentId: number;
        
          console.log("inside the transection");
          for (const flatData of jsonData) {
            
            // section for create building if not exist..
            console.log(flatData);
            const building = await tx.building.findFirst({
              where:{
                societyId: societyId,
                name: flatData['Building Name']
              }
            });
            if(!building){
              const newbuilding  = await tx.building.create({
                data:{
                  'name': flatData['Building Name'],
                  'isActive': true,
                  'societyId': societyId
                }
              });

              buildingId = newbuilding.id;
            }else{
              buildingId = building.id;
            }


            //section for creating floor if not exist.
            
            const floor = await tx.floor.findFirst({
              where:{
                number: flatData['Floor Number'],
                buildingId: buildingId
              }
            });

            if(!floor){
              const newFloor = await tx.floor.create({
                data:{
                  'number': flatData['Floor Number'],
                  "buildingId": buildingId,
                  "isActive": true
                }
              });
              floorId = newFloor.id
            }else{
              floorId = floor.id;
            }

            //Section for creating flat if not exist.
            const flat = await tx.flat.findFirst({
              where:{
                floorId: floorId,
                number: flatData['Flat Number'],
              }
            })
            if(!flat){
              const newFlat = await tx.flat.create({
                data:{
                  number: flatData['Flat Number'],
                  floorId: floorId,
                  isActive: true
                }
              });
              flatId = newFlat.id;
              if(!newFlat){
                throw new HttpException("transection error while creating flat please recheck the excel sheet", HttpStatus.CONFLICT);
              }
            }else{
              flatId = flat.id;
            }

            //Section for creating resident if not exist.
            const resident = await tx.resident.findFirst({
              where:{
                name: flatData['Name'],
                email: flatData['Email'],
                phoneNumber: String(flatData['Phone Number']),
                isChild: Boolean(flatData['Is Child?']),
              }
            })

            if(!resident){
              const newResident = await tx.resident.create({
                data:{
                  name: flatData['Name'],
                  email: flatData['Email'],
                  phoneNumber: String(flatData['Phone Number']),
                  isChild: Boolean(flatData['Is Child?']),
                  isActive: true
                }
              });
              residentId = newResident.id;

              const addResidentFlat = await tx.residentFlat.create({
                data: {
                  flatId: flatId,
                  residentId: residentId,
                  type: flatData['Type'],
                  isPrimary: Boolean(flatData['Is Primary?']),

                },
              });
            }
          }

      })
          
    } catch (error) {
      throw new HttpException(error,HttpStatus.NOT_IMPLEMENTED)
    }
  
  
  return 'accepted';
    
   
  }


  async bulkUploadResidentsData(societyId: number,buildingId: number,floorId:number,flatId: number,fileDto:FileDto,file){
    const society = await this.prisma.society.findFirst({
      where:{
        id: societyId
      }
    })
    if(!society) throw new HttpException("society not found", HttpStatus.NOT_FOUND);

    const building = await this.prisma.building.findFirst({
      where: { AND: [
        {id: buildingId},
        {societyId: societyId}
      ]}
    })

    if(!building) throw new HttpException("building not found",HttpStatus.NOT_FOUND);

    const floor = await this.prisma.floor.findFirst({where:{
      buildingId: buildingId,
      id: floorId,
    }})

    if(!floor) throw new HttpException("floor not found",HttpStatus.NOT_FOUND);

    const flat = await this.prisma.flat.findFirst({where:{
      floorId: floorId,
      id: flatId,
    }})

    if(!flat) throw new HttpException("flat not found",HttpStatus.NOT_FOUND);

    const workbook = xlsx.read(file.buffer);
    const sheetNames = workbook.SheetNames;
    const sheet = workbook.Sheets[sheetNames[0]];

    const jsonData = xlsx.utils.sheet_to_json(sheet);


    jsonData.map(async (resident )=>{
      const res = await this.prisma.resident.create({
          data: {
            name: resident['name'],
            email: resident["email"],
            phoneNumber: String(resident['phoneNumber']),
            isChild: resident['isChild'],
            isActive: true
        }
      })

      const addResidentFlat = await this.prisma.residentFlat.create({
        data: {
          flatId: flatId,
          residentId: res.id,
          type: resident['type'],
          isPrimary: resident['isPrimary'],
        },
      });
    })

    return "ok";
    
   
  }

  isValidMobileNumber(mobileNumber: string): boolean {
    // Define a regex pattern for a 10-digit mobile number
    const pattern = /^[0-9]{10}$/;

    // Test the provided mobile number against the pattern
    return pattern.test(mobileNumber);
  }

  async add(
    societyId: number,
    buildingId: number,
    floorId: number,
    flatId: number,
    addResidentdto: AddResidentDto
  ): Promise<ResidentDto & {flatId:number}> {
    if (Number.isNaN(societyId)) {
      throw new HttpException(
        'society id is missing in params',
        HttpStatus.BAD_REQUEST
      );
    }

    // TODO: implement transaction

    const society = await this.prisma.society.findUnique({
      where: {
        id: societyId,
      },
      select: {
        buildings: {
          where: {
            id: buildingId,
          },
          select: {
            floors: {
              where: {
                id: floorId,
              },
              select: {
                flats: {
                  where: {
                    id: flatId,
                  },
                },
              },
            },
          },
        },
      },
    });
    if (society) {
      if (society.buildings[0] != undefined) {
        if (society.buildings[0].floors[0] != undefined) {
          if (society.buildings[0].floors[0].flats[0] != undefined) {
            console.log('all set');
          } else {
            throw new HttpException(
              'flat not found check FlatId',
              HttpStatus.NOT_FOUND
            );
          }
        } else {
          throw new HttpException(
            'floor not found check floorId',
            HttpStatus.NOT_FOUND
          );
        }
      } else {
        throw new HttpException(
          'building not found check buildingId',
          HttpStatus.NOT_FOUND
        );
      }
    } else {
      throw new HttpException(
        'society not found check societyId',
        HttpStatus.NOT_FOUND
      );
    }

    const isPhoneNumberValid = this.isValidMobileNumber(
      addResidentdto.phoneNumber
    );

    if (!isPhoneNumberValid) {
      throw new HttpException(
        `${addResidentdto.phoneNumber} is a valid 10-digit mobile number.`,
        HttpStatus.BAD_REQUEST
      );
    }

    const resident = await this.prisma.resident.findFirst({
      where:{
        name: addResidentdto.name,
        email: addResidentdto.email,
        phoneNumber: addResidentdto.phoneNumber,
        isChild: addResidentdto.isChild,
        isActive: addResidentdto.isActive
      }
    });
    if (resident) {
      const residentFlat = await this.prisma.residentFlat.findFirst({
        where: {
          flatId: flatId,
          residentId: resident.id,
        },
      });
      if (residentFlat) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Resident already exists',
          },
          HttpStatus.BAD_REQUEST
        );
      }
      const checkFlat = await this.prisma.flat.findFirst({
        where: { id: flatId },
      });
      if (!checkFlat) {
        throw new NotFoundException();
      } else {
        const { type } = addResidentdto;
        const addResidentData = {
          flatId: flatId,
          residentId: resident.id,
          type: type,
          isPrimary: addResidentdto.isPrimary,
        };
        const addResidentFlat = await this.prisma.residentFlat.create({
          data: addResidentData,
        });
        if (addResidentData.isPrimary) {
          // set other residents of this flat as not primary
          await this.prisma.residentFlat.updateMany({
            where: { flatId: flatId, residentId: { not: resident.id } },
            data: { isPrimary: false },
          });
        }
        return {
          id: resident.id,
          name: resident.name,
          type: addResidentFlat.type,
          email: resident.email,
          phoneNumber: resident.phoneNumber,
          isChild: resident.isChild,
          flatId: addResidentFlat.flatId,
          isPrimary: addResidentFlat.isPrimary,
          isActive: resident.isActive,
        };
      }
    }

    const checkFlat = await this.prisma.flat.findFirst({
      where: { id: flatId },
    });
    if (!checkFlat) {
      throw new NotFoundException();
    } else {
      const { type, ...addResidentDto } = addResidentdto;
      const addResident = await this.prisma.resident.create({
        data: {
          name: addResidentDto.name,
          email: addResidentDto.email,
          phoneNumber: addResidentDto.phoneNumber,
          isChild: addResidentDto.isChild,
          isActive: addResidentDto.isActive
        },
      });
      const addResidentData = {
        flatId: flatId,
        residentId: addResident.id,
        type: type,
        isPrimary: addResidentDto.isPrimary,
      };
      const addResidentFlat = await this.prisma.residentFlat.create({
        data: addResidentData,
      });
      if (addResidentData.isPrimary) {
        // set other residents of this flat as not primary
        await this.prisma.residentFlat.updateMany({
          where: { flatId: flatId, residentId: { not: addResident.id } },
          data: { isPrimary: false },
        });
      }
      return {
        id: addResident.id,
        name: addResident.name,
        type: addResidentFlat.type,
        email: addResident.email,
        phoneNumber: addResident.phoneNumber,
        isChild: addResident.isChild,
        flatId: addResidentFlat.flatId,
        isPrimary: addResidentFlat.isPrimary,
        isActive: addResident.isActive,
      };
    }
  }

  async findById(
    societyId: number,
    buildingId: number,
    floorId: number,
    flatId: number,
    id: number,
    userId: number
  ): Promise<ViewResidentDto> {
    if (Number.isNaN(societyId) || Number.isNaN(id)) {
      throw new HttpException(
        'society id is missing in params',
        HttpStatus.BAD_REQUEST
      );
    }

    const society = await this.prisma.society.findUnique({
      where: {
        id: societyId,
      },
      select: {
        buildings: {
          where: {
            id: buildingId,
          },
          select: {
            floors: {
              where: {
                id: floorId,
              },
              select: {
                flats: {
                  where: {
                    id: flatId,
                  },
                },
              },
            },
          },
        },
      },
    });
    if (society) {
      if (society.buildings[0] != undefined) {
        if (society.buildings[0].floors[0] != undefined) {
          if (society.buildings[0].floors[0].flats[0] != undefined) {
            console.log('all set');
          } else {
            throw new HttpException(
              'flat not found check FlatId',
              HttpStatus.NOT_FOUND
            );
          }
        } else {
          throw new HttpException(
            'floor not found check floorId',
            HttpStatus.NOT_FOUND
          );
        }
      } else {
        throw new HttpException(
          'building not found check buildingId',
          HttpStatus.NOT_FOUND
        );
      }
    } else {
      throw new HttpException(
        'society not found check societyId',
        HttpStatus.NOT_FOUND
      );
    }

    const residentview = await this.prisma.resident.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        isChild: true,
        isActive: true,
        flats: {
          select: {
            isPrimary: true,
            type: true,
            flat: {
              select: {
                id: true,
                number: true,
                floor: {
                  select: {
                    id: true,
                    number: true,
                    building: {
                      select: {
                        id: true,
                        name: true,
                        society: {
                          select: {
                            id: true,
                            name: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
    if (!residentview) {
      throw new NotFoundException();
    } else {
      if (residentview.isActive) {
        return residentview;
      } else {
        throw new NotFoundException();
      }
    }
  }

  async edit(
    societyId: number,
    buildingId: number,
    floorId: number,
    flatId: number,
    residentDto: AddResidentDto,
    id: number
  ): Promise<ResidentDto & {flatId:number}> {
    if (Number.isNaN(societyId) || Number.isNaN(id)) {
      throw new HttpException(
        'society id is missing in params',
        HttpStatus.BAD_REQUEST
      );
    }

    const society = await this.prisma.society.findUnique({
      where: {
        id: societyId,
      },
      select: {
        buildings: {
          where: {
            id: buildingId,
          },
          select: {
            floors: {
              where: {
                id: floorId,
              },
              select: {
                flats: {
                  where: {
                    id: flatId,
                  },
                },
              },
            },
          },
        },
      },
    });
    if (society) {
      if (society.buildings[0] != undefined) {
        if (society.buildings[0].floors[0] != undefined) {
          if (society.buildings[0].floors[0].flats[0] != undefined) {
            console.log('all set');
          } else {
            throw new HttpException(
              'flat not found check FlatId',
              HttpStatus.NOT_FOUND
            );
          }
        } else {
          throw new HttpException(
            'floor not found check floorId',
            HttpStatus.NOT_FOUND
          );
        }
      } else {
        throw new HttpException(
          'building not found check buildingId',
          HttpStatus.NOT_FOUND
        );
      }
    } else {
      throw new HttpException(
        'society not found check societyId',
        HttpStatus.NOT_FOUND
      );
    }

    const isPhoneNumberValid = this.isValidMobileNumber(
      residentDto.phoneNumber
    );

    if (!isPhoneNumberValid) {
      throw new HttpException(
        `${residentDto.phoneNumber} is a valid 10-digit mobile number.`,
        HttpStatus.BAD_REQUEST
      );
    }

    const checkresident = await this.prisma.resident.findUnique({
      where: { id: Number(id) },
    });
    const resident = await this.prisma.resident.findFirst({
      where: {
        name: residentDto.name,
        email: residentDto.email,
        phoneNumber: residentDto.phoneNumber,
        isChild: residentDto.isChild,
        isActive: residentDto.isActive
      },
    });

    if (!checkresident) {
      throw new NotFoundException();
    } else {
      const residentFlat = await this.createResidentFlat(
        residentDto,
        id,
        flatId
      );

      const checkflat = await this.prisma.flat.findFirst({
        where: { id: flatId },
      });
      if (!checkflat) {
        throw new NotFoundException();
      } else {
        if (resident && resident.id != id) {
          throw new HttpException(
            'User with same email already exists',
            HttpStatus.BAD_REQUEST
          );
        }
        const { type, ...addResidentDto } = residentDto;
        const updateResident = await this.prisma.resident.update({
          where: { id: Number(id) },
          data: {
            name: addResidentDto.name,
            email: addResidentDto.email,
            phoneNumber: addResidentDto.phoneNumber,
            isChild:addResidentDto.isChild
          },
        });

        if (addResidentDto.isPrimary) {
          // set other residents of this flat as not primary
          await this.prisma.residentFlat.updateMany({
            where: { flatId: flatId, residentId: { not: updateResident.id } },
            data: { isPrimary: false },
          });
        }
        await this.prisma.residentFlat.updateMany({
          where: { residentId: updateResident.id, flatId: flatId },
          data: { isPrimary: addResidentDto.isPrimary, type: type },
        });
        return {
          id: updateResident.id,
          name: updateResident.name,
          type: residentFlat.type,
          email: updateResident.email,
          phoneNumber: updateResident.phoneNumber,
          isChild: updateResident.isChild,
          flatId: flatId,
          isPrimary: addResidentDto.isPrimary,
          isActive: updateResident.isActive,
        };
      }
    }
  }

  async getFilteredResidents(
    pageSize: number,
    pageOffset: number,
    name: string,
    email: string,
    phoneNumber: string,
    sortBy: string,
    sortOrder: 'asc' | 'desc',
    userId: number,
    societyId: number,
    buildingId: number,
    floorId: number,
    flatId: number,
    associateFlatId: boolean
  ): Promise<ListResidentPageDto> {
    if (Number.isNaN(societyId)) {
      throw new HttpException(
        'society id is missing in params',
        HttpStatus.BAD_REQUEST
      );
    }

    if (associateFlatId) {
      const society = await this.prisma.society.findUnique({
        where: {
          id: societyId,
        },
        select: {
          buildings: {
            where: {
              id: buildingId,
            },
            select: {
              floors: {
                where: {
                  id: floorId,
                },
                select: {
                  flats: {
                    where: {
                      id: flatId,
                    },
                  },
                },
              },
            },
          },
        },
      });
      if (society) {
        if (society.buildings[0] != undefined) {
          if (society.buildings[0].floors[0] != undefined) {
            if (society.buildings[0].floors[0].flats[0] != undefined) {
              console.log('all set');
            } else {
              throw new HttpException(
                'flat not found check FlatId',
                HttpStatus.NOT_FOUND
              );
            }
          } else {
            throw new HttpException(
              'floor not found check floorId',
              HttpStatus.NOT_FOUND
            );
          }
        } else {
          throw new HttpException(
            'building not found check buildingId',
            HttpStatus.NOT_FOUND
          );
        }
      } else {
        throw new HttpException(
          'society not found check societyId',
          HttpStatus.NOT_FOUND
        );
      }

      const sort = (sortBy ? sortBy : 'name').toString();
      const order = sortOrder ? sortOrder : 'asc';
      const size = pageSize ? pageSize : 10;
      const offset = pageOffset ? pageOffset : 0;
      const orderBy = { [sort]: order };
      const count = await this.prisma.resident.count({
        where: {
          flats: {
            some: {
              flatId: flatId,
            },
          },
        },
      });

      const residents = await this.prisma.resident.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          phoneNumber: true,
          isChild: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          flats: {
            select: {
              isPrimary: true,
              type: true,
              flat: {
                select: {
                  id: true,
                  number: true,
                  floor: {
                    select: {
                      id: true,
                      number: true,
                      building: {
                        select: {
                          id: true,
                          name: true,
                          society: {
                            select: {
                              id: true,
                              name: true,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        where: {
          flats: {
            some: {
              flatId: flatId,
              flat: {
                floor: {
                  id: floorId,
                  building: {
                    id: buildingId,
                    society: {
                      id: societyId,
                    },
                  },
                },
              },
            },
          },
        },
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
        content: residents,
      };
    }

    const whereArray = [];

    let whereQuery = {};

    whereArray.push({
      flats: {
        some: {
          flat: {
            floor: {
              building: {
                society: {
                  id: societyId,
                },
              },
            },
          },
        },
      },
    });

    if (name !== undefined) {
      whereArray.push({ name: { contains: name, mode: 'insensitive' } });
    }

    if (email !== undefined) {
      whereArray.push({ email: { contains: email, mode: 'insensitive' } });
    }

    if (phoneNumber !== undefined) {
      whereArray.push({
        phoneNumber: { contains: phoneNumber, mode: 'insensitive' },
      });
    }

    if (whereArray.length > 0) {
      if (whereArray.length > 1) {
        whereQuery = { AND: whereArray };
      } else {
        whereQuery = whereArray[0];
      }
    }
    const sort = (sortBy ? sortBy : 'name').toString();
    const order = sortOrder ? sortOrder : 'asc';
    const size = pageSize ? pageSize : 10;
    const offset = pageOffset ? pageOffset : 0;
    const orderBy = { [sort]: order };
    const count = await this.prisma.resident.count({
      where: whereQuery,
    });

    const listresident = await this.prisma.resident.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        isChild: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        flats: {
          select: {
            isPrimary: true,
            type: true,
            flat: {
              select: {
                id: true,
                number: true,
                floor: {
                  select: {
                    id: true,
                    number: true,
                    building: {
                      select: {
                        id: true,
                        name: true,
                        society: {
                          select: {
                            id: true,
                            name: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
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
      content: listresident,
    };
  }

  async deleteResident(
    societyId: number,
    buildingId: number,
    floorId: number,
    flatId: number,
    id: number
  ): Promise<void> {
    if (Number.isNaN(societyId) || Number.isNaN(id)) {
      throw new HttpException(
        'society id is missing in params',
        HttpStatus.BAD_REQUEST
      );
    }

    const society = await this.prisma.society.findUnique({
      where: {
        id: societyId,
      },
      select: {
        buildings: {
          where: {
            id: buildingId,
          },
          select: {
            floors: {
              where: {
                id: floorId,
              },
              select: {
                flats: {
                  where: {
                    id: flatId,
                  },
                },
              },
            },
          },
        },
      },
    });
    if (society) {
      if (society.buildings[0] != undefined) {
        if (society.buildings[0].floors[0] != undefined) {
          if (society.buildings[0].floors[0].flats[0] != undefined) {
            console.log('all set');
          } else {
            throw new HttpException(
              'flat not found check FlatId',
              HttpStatus.NOT_FOUND
            );
          }
        } else {
          throw new HttpException(
            'floor not found check floorId',
            HttpStatus.NOT_FOUND
          );
        }
      } else {
        throw new HttpException(
          'building not found check buildingId',
          HttpStatus.NOT_FOUND
        );
      }
    } else {
      throw new HttpException(
        'society not found check societyId',
        HttpStatus.NOT_FOUND
      );
    }

    const residentFlatRelation = await this.prisma.residentFlat.findFirst({
      where: {
        residentId: id,
        flatId: flatId,
      },
    });
    if (residentFlatRelation) {
      await this.prisma.residentFlat.delete({
        where: {
          id: residentFlatRelation.id,
        },
      });
    }

    const resident = await this.prisma.resident.delete({
      where: { id: Number(id) },
    });
    if (!resident) {
      throw new NotFoundException();
    } else {
      return;
    }
  }

  async softDeleteResident(
    societyId: number,
    id: number,
    status: string
  ): Promise<void> {
    if (Number.isNaN(societyId) || Number.isNaN(id)) {
      throw new HttpException(
        'society id is missing in params',
        HttpStatus.BAD_REQUEST
      );
    }

    const society = await this.prisma.society.findUnique({
      where: {
        id: societyId,
      },
    });
    if (!society) {
      throw new HttpException('society not found', HttpStatus.NOT_FOUND);
    }

    const checkresident = await this.prisma.resident.findUnique({
      where: { id: Number(id) },
    });
    if (!checkresident) {
      throw new NotFoundException();
    } else {
      const flag = status === 'true';
      if (checkresident.isActive != flag) {
        const dele = await this.prisma.resident.update({
          where: { id: Number(id) },
          data: { isActive: flag },
        });
        if (!dele) {
          throw new NotFoundException();
        } else {
          return;
        }
      }
    }
  }

  async createResidentFlat(
    addResidentDto: AddResidentDto,
    id: number,
    flatId: number
  ): Promise<ResidentFlat> {
    const residentFlat = await this.prisma.residentFlat.findFirst({
      where: {
        flatId: flatId,
        residentId: Number(id),
      },
    });
    if (!residentFlat) {
      const addResidentData = {
        flatId: flatId,
        residentId: Number(id),
        type: addResidentDto.type,
      };
      const addResidentFlat = await this.prisma.residentFlat.create({
        data: addResidentData,
      });
      return addResidentFlat;
    }
    if (residentFlat) {
      if (residentFlat.type != addResidentDto.type) {
        const residentflat = await this.prisma.residentFlat.update({
          where: { id: residentFlat.id },
          data: { type: addResidentDto.type },
        });
        return residentflat;
      }
    }
    return residentFlat;
  }
}
