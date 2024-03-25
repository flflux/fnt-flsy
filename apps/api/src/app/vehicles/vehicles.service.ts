import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AddVehicleDto } from './dto/add-vehicle.dto';
import { VehicleDto } from './dto/vehicle.dto';
import { ViewVehicleDto } from './dto/view-vehicle.dto';
import { ListVehiclePageDto } from './dto/list-vehicle-page.dto';
import { EditVehicleDto } from './dto/edit-vehicle.dto';
import { FileDto } from '../core/dto/page-base.dto';
import * as xlsx from 'xlsx';

@Injectable()
export class VehiclesService {
  private prisma = new PrismaClient();

  isValidIndianVehicleNumber(vehicleNumber: string): boolean {
    // Define a regex pattern for a generic Indian vehicle number
    const pattern = /^[A-Z]{2}[0-9]{1,2}[A-Z]{1,2}[0-9]{1,4}$/;
  
    // Test the provided vehicle number against the pattern
    return pattern.test(vehicleNumber);
  }

  async exportVehicleDetailsForSociety(societyId: number){
    const society = await this.prisma.society.findFirst({
      where:{
        id: societyId
      }
    })

    if(!society) throw new HttpException("society not found", HttpStatus.NOT_FOUND);

    // generate vehicle data for the society where the vehicle is associated for the flat
    const vehicles = await  this.prisma.vehicle.findMany({
      select: {
        id: true,
        number: true,
        name: true,
        type: true,
        flats: { 
          select: { 
            flats:{
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
        isActive: true,
      },
      where:{
        flats:{
          some:{
            flats:{
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
      ['Id', 'Number', 'Name',"Type", "flat Number", "Floor Number", "Building name",  ],
    ];
    
    vehicles.map((vehicle)=>{
        data.push([String(vehicle.id), vehicle.number,vehicle.name, vehicle.type, vehicle.flats[0].flats.number,vehicle.flats[0].flats.floor.number,vehicle.flats[0].flats.floor.building.name])
    })

    return data;
  }

  async bulkVehicleUploadData(societyId: number,fileDto:FileDto,file){
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
          let vehicleId: number;
        
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
                number: String(flatData['Floor Number']),
                buildingId: buildingId
              }
            });

            if(!floor){
              const newFloor = await tx.floor.create({
                data:{
                  'number': String(flatData['Floor Number']),
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
                number: String(flatData['Flat Number']),
              }
            })
            if(!flat){
              const newFlat = await tx.flat.create({
                data:{
                  number: String(flatData['Flat Number']),
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


            if(flatData['Vehicle Number'] && flatData['Vehicle Type']){
              //Section for creating resident if not exist.
            const vehicle = await tx.vehicle.findFirst({
              where:{
                name: flatData['Vehicle Make']? flatData['Vehicle Make'] : " ",
                number: flatData['Vehicle Number'],
                type: flatData['Vehicle Type']
              }
            })

            if(!vehicle){
              const newVehicle = await tx.vehicle.create({
                data:{
                  name: flatData['Vehicle Make']? flatData['Vehicle Make'] : " ",
                  number: flatData['Vehicle Number'],
                  type: flatData['Vehicle Type'],
                  isActive: true
                }
              });
              vehicleId = newVehicle.id;

            }else{
              vehicleId = vehicle.id;
            }
            const vehicleFlat = await tx.vehicleFlat.findFirst({
              where: {
                flatId: flatId,
                vehicleId: vehicleId,
              },
            });

            if(!vehicleFlat){
              const newVehicleFlat = await tx.vehicleFlat.create({
                data:{
                  flatId: flatId,
                  vehicleId: vehicleId
                }
              })
            }

            }else{
              vehicleId = null
            }
            

            const device = await tx.device.findFirst({
              where:{
                deviceId: flatData['Device Name']
              }
            })

            const card = await tx.card.findFirst({
              where:{
                number: String(flatData['Card Number']),
                type: flatData['Card Type'],
                isActive: flatData['Active']==true ? true: false,
                deviceId: device.id,
              }
            })

            if(!card){
              if(flatData['Card Number'] && flatData['Card Type']){
                const newCard = await tx.card.create({
                  data:{
                    number: String(flatData['Card Number']),
                    type: flatData['Card Type'],
                    isActive: flatData['Active']==true ? true: false,
                    vehicleId: vehicleId,
                    deviceId: device.id,
                    flatId: flatId
                  }
                })
              }
            }
          }
      })
          
    } catch (error) {
      throw new HttpException(error,HttpStatus.NOT_IMPLEMENTED)
    }
  
  
    return 'accepted';
    
   
  }


  async bulkUploadVehiclesData(societyId: number,buildingId: number,floorId:number,flatId: number,fileDto:FileDto,file){
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


    jsonData.map(async (vehicle )=>{
      const newVehicle = await this.prisma.vehicle.create({
          data: {
            number: vehicle['number'],
            type: vehicle['type'],
            name: vehicle['name'],
            isActive: true
        }
      })

      const addvehicleFlat = await this.prisma.vehicleFlat.create({
        data: {
          flatId: flatId,
          vehicleId: newVehicle.id,
        },
      });
    })

    return "ok";
    
   
  }

  

  async add(
    societyId: number,
    buildingId: number,
    floorId: number,
    flatId: number,
    addVehicleDto: AddVehicleDto): Promise<VehicleDto> {


      if (Number.isNaN(societyId))
      throw new HttpException(
        'society id is missing in params',
        HttpStatus.BAD_REQUEST
      );

    const society = await this.prisma.society.findUnique({
      where: {
        id: societyId,
      },
      select:{
        buildings:{
          where:{
            id: buildingId,
          },
          select:{
            floors:{
              where:{
                id: floorId
              },
              select:{
                flats:{
                  where:{
                    id: flatId
                  }
                }
              }
            }
          }
        }
      }
    });
    if(society){
      if(society.buildings[0]!=undefined){
        if(society.buildings[0].floors[0]!=undefined){
          if(society.buildings[0].floors[0].flats[0]!=undefined){
            console.log("all set")
          }else  throw new HttpException("flat not found check FlatId", HttpStatus.NOT_FOUND);
        } else  throw new HttpException("floor not found check floorId", HttpStatus.NOT_FOUND);
      }else  throw new HttpException("building not found check buildingId", HttpStatus.NOT_FOUND);
    }else  throw new HttpException("society not found check societyId", HttpStatus.NOT_FOUND);
    

    const isvalid = this.isValidIndianVehicleNumber(addVehicleDto.number);

    if (!isvalid) {
      throw new HttpException(`${addVehicleDto.number} is not a valid Indian vehicle number.`,HttpStatus.BAD_REQUEST);
    } 

    const checkvehicle = await this.prisma.vehicle.findFirst({
      where: { number: addVehicleDto.number },
    });
    if (checkvehicle) {
      const vehicleFlat = await this.prisma.vehicleFlat.findFirst({
        where: {
          flatId: flatId,
          vehicleId: checkvehicle.id,
        },
      });
      if (vehicleFlat) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Vehicle already exists',
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
        const addResidentData = {
          flatId: flatId,
          vehicleId: checkvehicle.id,
        };
        const entryVehicleFlat = await this.prisma.vehicleFlat.create({
          data: addResidentData,
        });
        const residentReturn = {
          id: checkvehicle.id,
          name: checkvehicle.name,
          number: checkvehicle.number,
          flatId: entryVehicleFlat.flatId,
          isActive: checkvehicle.isActive,
          type: checkvehicle.type,
        };
        return residentReturn;
      }
    }
    const checkflat = await this.prisma.flat.findFirst({
      where: { id: flatId },
    });
    if (!checkflat) {
      throw new NotFoundException();
    } else {
      const { ...addVehicledto } = addVehicleDto;
      const addvehicle = await this.prisma.vehicle.create({
        data: addVehicledto,
      });
      const vehicleFlat = {
        vehicleId: addvehicle.id,
        flatId: flatId,
      };
      const entryVehicleFlat = await this.prisma.vehicleFlat.create({
        data: vehicleFlat,
      });
      const returnData = {
        id: addvehicle.id,
        name: addvehicle.name,
        number: addvehicle.number,
        flatId: entryVehicleFlat.flatId,
        isActive: addvehicle.isActive,
        type: addvehicle.type,
      };
      return returnData;
    }
  }

  async findById(
    societyId: number,
    buildingId: number,
    floorId: number,
    flatId: number,
    id: number, userId: number): Promise<ViewVehicleDto> {



      if (Number.isNaN(societyId))
      throw new HttpException(
        'society id is missing in params',
        HttpStatus.BAD_REQUEST
      );

    const society = await this.prisma.society.findUnique({
      where: {
        id: societyId,
      },
      select:{
        buildings:{
          where:{
            id: buildingId,
          },
          select:{
            floors:{
              where:{
                id: floorId
              },
              select:{
                flats:{
                  where:{
                    id: flatId
                  }
                }
              }
            }
          }
        }
      }
    });
    if(society){
      if(society.buildings[0]!=undefined){
        if(society.buildings[0].floors[0]!=undefined){
          if(society.buildings[0].floors[0].flats[0]!=undefined){
            console.log("all set")
          }else  throw new HttpException("flat not found check FlatId", HttpStatus.NOT_FOUND);
        } else  throw new HttpException("floor not found check floorId", HttpStatus.NOT_FOUND);
      }else  throw new HttpException("building not found check buildingId", HttpStatus.NOT_FOUND);
    }else  throw new HttpException("society not found check societyId", HttpStatus.NOT_FOUND);
    

    const vehicle = await this.prisma.vehicle.findUnique({
      where: { 
        id: Number(id) ,
        isActive: true
      },
      select:{
        id: true,
        name: true,
        type: true,
        number: true,
        isActive: true,
        cards:{
          select: {
            id:true,
            number: true,
            type: true
          }
        },
        flats:{
          select:{
            flats:{
              select:{
                id: true,
                number:true,
                floor:{
                  select:{
                    id: true,
                    number:true,
                    building:{
                      select:{
                        id: true,
                        name: true,
                        society:{
                          select:{
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
        }
      },
    });
    
    
    if (!vehicle) {
      throw new NotFoundException();
    } else {
      return vehicle
    }
  }

  async edit(
    societyId: number,
    buildingId: number,
    floorId: number,
    flatId: number,
    editVehicleDto: EditVehicleDto, id: number): Promise<EditVehicleDto> {

      
      if (Number.isNaN(societyId))
      throw new HttpException(
        'society id is missing in params',
        HttpStatus.BAD_REQUEST
      );

    const society = await this.prisma.society.findUnique({
      where: {
        id: societyId,
      },
      select:{
        buildings:{
          where:{
            id: buildingId,
          },
          select:{
            floors:{
              where:{
                id: floorId
              },
              select:{
                flats:{
                  where:{
                    id: flatId
                  }
                }
              }
            }
          }
        }
      }
    });
    if(society){
      if(society.buildings[0]!=undefined){
        if(society.buildings[0].floors[0]!=undefined){
          if(society.buildings[0].floors[0].flats[0]!=undefined){
            console.log("all set")
          }else  throw new HttpException("flat not found check FlatId", HttpStatus.NOT_FOUND);
        } else  throw new HttpException("floor not found check floorId", HttpStatus.NOT_FOUND);
      }else  throw new HttpException("building not found check buildingId", HttpStatus.NOT_FOUND);
    }else  throw new HttpException("society not found check societyId", HttpStatus.NOT_FOUND);

    const checkVehicle = await this.prisma.vehicle.findUnique({
      where: { id: Number(id) ,isActive: true},
    });
    if (!checkVehicle) {
      throw new NotFoundException();
    } else {
      
        const updateVehicle = await this.prisma.vehicle.update({
          where: { id: Number(id) },
          data: {
            name: editVehicleDto.name,
            isActive: editVehicleDto.isActive,
            type: editVehicleDto.type,
          },
        });

        const residentReturn = {
          id: updateVehicle.id,
          name: updateVehicle.name,
          isActive: updateVehicle.isActive,
          type: updateVehicle.type,
        };
        return residentReturn;
      }
    }


    async getFilteredVehicles(
      pageSize: number,
      pageOffset: number,
      name:string,
      number: string,
      // type: string,
      isActive: string,
      // flatNumber: string,
      sortBy: string,
      sortOrder: 'asc' | 'desc',
    ): Promise<ListVehiclePageDto> {

      const whereArray = [];
      let whereQuery = {};

      
      if (number !== undefined) {
        whereArray.push({ number: { contains: number, mode: 'insensitive' } });
      }
      if (name !== undefined) {
        whereArray.push({ name: { contains: name, mode: 'insensitive' } });
      }
      if (isActive !== undefined) {
        if(isActive=='true') whereArray.push({isActive: true});
        else if(isActive=='false') whereArray.push({isActive: false });
      }
      if (whereArray.length > 0) {
        if (whereArray.length > 1) {
          whereQuery = { AND: whereArray };
        } else {
          whereQuery = whereArray[0];
        }
      }

      console.log(whereQuery)
      const sort = (sortBy ? sortBy : 'id').toString();
      const order = sortOrder ? sortOrder : 'asc';
      const size = pageSize ? pageSize : 10;
      const offset = pageOffset ? pageOffset : 0;
      const orderBy = { [sort]: order };
      const count = await this.prisma.vehicle.count({
        where: whereQuery,
      });
  
      const listVehicle = await this.prisma.vehicle.findMany({
        where: whereQuery,
        select: {
          id: true,
          number: true,
          name: true,
          type: true,
          flats: { 
            select: { 
              flats:{
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
          isActive: true,
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
        content: listVehicle,
      };

    }
  

  async getFilteredPosts(
    pageSize: number,
    pageOffset: number,
    name:string,
    number: string,
    sortBy: string,
    sortOrder: 'asc' | 'desc',
    userId: number,
    societyId: number,
    buildingId: number,
    floorId: number,
    flatId: number,
    associateFlatId: boolean
  ): Promise<ListVehiclePageDto> {

    if (Number.isNaN(societyId))
    throw new HttpException(
      'society id is missing in params',
      HttpStatus.BAD_REQUEST
    );

    if(associateFlatId){
        const society = await this.prisma.society.findUnique({
          where: {
            id: societyId,
          },
          select:{
            buildings:{
              where:{
                id: buildingId,
              },
              select:{
                floors:{
                  where:{
                    id: floorId
                  },
                  select:{
                    flats:{
                      where:{
                        id: flatId
                      }
                    }
                  }
                }
              }
            }
          }
        });
        if(society){
          if(society.buildings[0]!=undefined){
            if(society.buildings[0].floors[0]!=undefined){
              if(society.buildings[0].floors[0].flats[0]!=undefined){
                console.log("all set")
              }else  throw new HttpException("flat not found check FlatId", HttpStatus.NOT_FOUND);
            } else  throw new HttpException("floor not found check floorId", HttpStatus.NOT_FOUND);
          }else  throw new HttpException("building not found check buildingId", HttpStatus.NOT_FOUND);
        }else  throw new HttpException("society not found check societyId", HttpStatus.NOT_FOUND);
    
        const whereArray = [];
        let whereQuery = {};
        
        whereArray.push({
          flats:{
            some:{
              flats:{
                id: flatId,
                floor:{
                  id: floorId,
                  building:{
                    id: buildingId,
                    society:{
                      id: societyId
                    }
                  }
                }
              }
            }
          }
        })
    
        if (number !== undefined) {
          whereArray.push({ number: { contains: number, mode: 'insensitive' } });
        }
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
        const count = await this.prisma.vehicle.count({
          where: whereQuery,
        });
    
        const listVehicle = await this.prisma.vehicle.findMany({
          where: whereQuery,
          select: {
            id: true,
            number: true,
            name: true,
            type: true,
            flats: { 
              select: { 
                flats:{
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
            isActive: true,
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
          content: listVehicle,
        };
      }
      
      const whereArray = [];
      let whereQuery = {};

      whereArray.push({
        flats:{
          some:{
            flats:{
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
      })

  
      if (number !== undefined) {
        whereArray.push({ number: { contains: number, mode: 'insensitive' } });
      }
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
      const count = await this.prisma.vehicle.count({
        where: whereQuery
      });
  
      const listVehicle = await this.prisma.vehicle.findMany({
        where: whereQuery,
        select: {
          id: true,
          number: true,
          name: true,
          type: true,
          flats: { 
            select: { 
              flats:{
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
          isActive: true,
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
        content: listVehicle,
      };
    }

    
  async deleteVehicle(
    societyId: number,
    buildingId: number,
    floorId: number,
    flatId: number,
    id: number): Promise<void> {

      if (Number.isNaN(societyId))
    throw new HttpException(
      'society id is missing in params',
      HttpStatus.BAD_REQUEST
    );

      const society = await this.prisma.society.findUnique({
        where: {
          id: societyId,
        },
        select:{
          buildings:{
            where:{
              id: buildingId,
            },
            select:{
              floors:{
                where:{
                  id: floorId
                },
                select:{
                  flats:{
                    where:{
                      id: flatId
                    }
                  }
                }
              }
            }
          }
        }
      });
      if(society){
        if(society.buildings[0]!=undefined){
          if(society.buildings[0].floors[0]!=undefined){
            if(society.buildings[0].floors[0].flats[0]!=undefined){
              console.log("all set")
            }else  throw new HttpException("flat not found check FlatId", HttpStatus.NOT_FOUND);
          } else  throw new HttpException("floor not found check floorId", HttpStatus.NOT_FOUND);
        }else  throw new HttpException("building not found check buildingId", HttpStatus.NOT_FOUND);
      }else  throw new HttpException("society not found check societyId", HttpStatus.NOT_FOUND);
  
    const vehicleFlatEntries = await this.prisma.vehicleFlat.findMany({
      where: {
        vehicleId: Number(id),
      },
      select: {
        id: true,
      },
    });

    for (const vehicle of vehicleFlatEntries) {
      const deleteVehicleFlatEntries = await this.prisma.vehicleFlat.delete({
        where: {
          id: vehicle.id,
        },
      });
    }
    const dele = await this.prisma.vehicle.delete({
      where: { id: Number(id) },
    });
    if (!dele) {
      throw new NotFoundException();
    } else {
      return;
    }
  }

  async softDeleteVehicle(id: number, status: string): Promise<void> {
    const checkvehicle = await this.prisma.vehicle.findUnique({
      where: { id: Number(id) },
    });
    if (!checkvehicle) {
      throw new NotFoundException();
    } else {
      const flag = status === 'true';
      if (checkvehicle.isActive != flag) {
        const dele = await this.prisma.vehicle.update({
          where: { id: Number(id) },
          data: { isActive: flag },
        });
        // if vehicle is deactive then delete the vehicle device association first.
        await this.prisma.vehicleDevice.deleteMany({
          where:{
            vehicleId: Number(id)
          }
        })
        if (!dele) {
          throw new NotFoundException();
        } else {
          return;
        }
      }
    }
  }

  async createResidentFlat(flatId: number, vehicleId: number) {
    console.log('inside create resident', flatId, vehicleId);
    const vehicleFlat = await this.prisma.vehicleFlat.findFirst({
      where: {
        flatId: flatId,
        vehicleId: vehicleId,
      },
    });
    console.log('vehicleFlat', vehicleFlat);
    if (!vehicleFlat) {
      const addVehicleData = {
        flatId: flatId,
        vehicleId: vehicleId,
      };
      console.log('addVehicleData', addVehicleData);
      const entryVehicleFlat = await this.prisma.vehicleFlat.create({
        data: addVehicleData,
      });
      console.log('entry_vehicle', entryVehicleFlat);
      return entryVehicleFlat;
    }
    return vehicleFlat;
  }

//   async addSocietyVehicle(
//     addVehicleDto: AddVehicleDto,
//     id: number
//   ): Promise<VehicleDto> {
//     const checkvehicle = await this.prisma.vehicle.findFirst({
//       where: { number: addVehicleDto.number },
//     });
//     if (checkvehicle) {
//       const vehicleFlat = await this.prisma.vehicleFlat.findFirst({
//         where: {
//           flatId: addVehicleDto.flatId,
//           vehicleId: checkvehicle.id,
//         },
//       });
//       if (vehicleFlat) {
//         throw new HttpException(
//           {
//             status: HttpStatus.BAD_REQUEST,
//             error: 'Vehicle already exists',
//           },
//           HttpStatus.BAD_REQUEST
//         );
//       }
//       const checkFlat = await this.prisma.flat.findFirst({
//         where: { id: addVehicleDto.flatId },
//       });
//       if (!checkFlat) {
//         throw new NotFoundException();
//       } else {
//         const checkSocityFlat = await this.prisma.flat.findUnique({
//           where: { id: addVehicleDto.flatId },
//           select: {
//             floor: { select: { building: { select: { societyId: true } } } },
//           },
//         });
//         if (checkSocityFlat.floor.building.societyId != id) {
//           throw new BadRequestException();
//         }
//         const addResidentData = {
//           flatId: addVehicleDto.flatId,
//           vehicleId: checkvehicle.id,
//         };
//         const entryVehicleFlat = await this.prisma.vehicleFlat.create({
//           data: addResidentData,
//         });
//         const residentReturn = {
//           id: checkvehicle.id,
//           name: checkvehicle.name,
//           number: checkvehicle.number,
//           flatId: entryVehicleFlat.flatId,
//           isActive: checkvehicle.isActive,
//           type: checkvehicle.type,
//         };
//         return residentReturn;
//       }
//     }
//     const checkflat = await this.prisma.flat.findFirst({
//       where: { id: addVehicleDto.flatId },
//     });
//     if (!checkflat) {
//       throw new NotFoundException();
//     } else {
//       const checkSocityFlat = await this.prisma.flat.findUnique({
//         where: { id: addVehicleDto.flatId },
//         select: {
//           floor: { select: { building: { select: { societyId: true } } } },
//         },
//       });
//       if (checkSocityFlat.floor.building.societyId != id) {
//         throw new BadRequestException();
//       }
//       const { flatId, ...addVehicledto } = addVehicleDto;
//       const addvehicle = await this.prisma.vehicle.create({
//         data: addVehicledto,
//       });
//       const vehicleFlat = {
//         vehicleId: addvehicle.id,
//         flatId: flatId,
//       };
//       const entryVehicleFlat = await this.prisma.vehicleFlat.create({
//         data: vehicleFlat,
//       });
//       const returnData = {
//         id: addvehicle.id,
//         name: addvehicle.name,
//         number: addvehicle.number,
//         flatId: entryVehicleFlat.flatId,
//         isActive: addvehicle.isActive,
//         type: addvehicle.type,
//       };
//       return returnData;
//     }
//   }

//   async addResidentVehicle(
//     addVehicleDto: AddVehicleDto,
//     id: number
//   ): Promise<VehicleDto> {
//     const checkvehicle = await this.prisma.vehicle.findFirst({
//       where: { number: addVehicleDto.number },
//     });
//     if (checkvehicle) {
//       const vehicleFlat = await this.prisma.vehicleFlat.findFirst({
//         where: {
//           flatId: addVehicleDto.flatId,
//           vehicleId: checkvehicle.id,
//         },
//       });
//       if (vehicleFlat) {
//         throw new HttpException(
//           {
//             status: HttpStatus.BAD_REQUEST,
//             error: 'Vehicle already exists',
//           },
//           HttpStatus.BAD_REQUEST
//         );
//       }
//       const checkFlat = await this.prisma.flat.findFirst({
//         where: { id: addVehicleDto.flatId },
//       });
//       if (!checkFlat) {
//         throw new NotFoundException();
//       } else {
//         const checkSocityFlat = await this.prisma.residentFlat.findMany({
//           where: { flatId: addVehicleDto.flatId },
//           select: {
//             residentId:true
//           },
//         });
//         const num ={residentId:id}
//         if (!checkSocityFlat.includes(num)) {
//           throw new BadRequestException();
//         }
//         const addResidentData = {
//           flatId: addVehicleDto.flatId,
//           vehicleId: checkvehicle.id,
//         };
//         const entryVehicleFlat = await this.prisma.vehicleFlat.create({
//           data: addResidentData,
//         });
//         const residentReturn = {
//           id: checkvehicle.id,
//           name: checkvehicle.name,
//           number: checkvehicle.number,
//           flatId: entryVehicleFlat.flatId,
//           isActive: checkvehicle.isActive,
//           type: checkvehicle.type,
//         };
//         return residentReturn;
//       }
//     }
//     const checkflat = await this.prisma.flat.findFirst({
//       where: { id: addVehicleDto.flatId },
//     });
//     if (!checkflat) {
//       throw new NotFoundException();
//     } else {
//       const checkSocityFlat = await this.prisma.residentFlat.findMany({
//         where: { flatId: addVehicleDto.flatId },
//         select: {
//           residentId:true
//         },
//       });
//       const num ={residentId:id}
//       if (!checkSocityFlat.includes(num)) {
//         throw new BadRequestException();
//       }
//       const { flatId, ...addVehicledto } = addVehicleDto;
//       const addvehicle = await this.prisma.vehicle.create({
//         data: addVehicledto,
//       });
//       const vehicleFlat = {
//         vehicleId: addvehicle.id,
//         flatId: flatId,
//       };
//       const entryVehicleFlat = await this.prisma.vehicleFlat.create({
//         data: vehicleFlat,
//       });
//       const returnData = {
//         id: addvehicle.id,
//         name: addvehicle.name,
//         number: addvehicle.number,
//         flatId: entryVehicleFlat.flatId,
//         isActive: addvehicle.isActive,
//         type: addvehicle.type,
//       };
//       return returnData;
//     }
// }
}