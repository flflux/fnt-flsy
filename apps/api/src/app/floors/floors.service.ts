import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { FloorDto } from './dto/floor.dto';
import { AddFloorDto } from './dto/add-floor.dto';
import { ListFloorPageDto } from './dto/list-floor-page.dto';
import { ViewFloorDto } from './dto/view-floor.dto';
import { FileDto } from '../core/dto/page-base.dto';
import * as fs from 'fs';
import * as xlsx from 'xlsx';

@Injectable()
export class FloorsService {
  private prisma = new PrismaClient();

  
  // async bulkUploadFloorData(societyId: number,buildingId: number,fileDto:FileDto,file){
    // const society = await this.prisma.society.findFirst({
    //   where:{
    //     id: societyId
    //   }
    // })
    // if(!society) throw new HttpException("society not found", HttpStatus.NOT_FOUND);

    // const building = await this.prisma.building.findFirst({
    //   where: { AND: [
    //     {id: buildingId},
    //     {societyId: societyId}
    //   ]}
    // })

    // if(!building) throw new HttpException("building not found",HttpStatus.NOT_FOUND);

  //   const workbook = xlsx.read(file.buffer);
  //   const sheetNames = workbook.SheetNames;
  //   const sheet = workbook.Sheets[sheetNames[0]];

  //   const jsonData = xlsx.utils.sheet_to_json(sheet, {raw: false,  defval: ''});


  //   const finalJsonData = [];
  //   jsonData.map(floor =>{
  //     floor['isActive'] = true;
  //     floor['buildingId'] = buildingId;
  //     finalJsonData.push(floor);
  //   })
    
  //   try {
  //       const answer = await this.prisma.floor.createMany({
  //         data: finalJsonData
  //       })
  //       return answer;
      
  //   } catch (error) {
  //     throw new HttpException("building already exist check code",HttpStatus.BAD_REQUEST);
  //   }
  // }

  async bulkUploadFloorData(societyId: number,buildingId: number, fileDto: FileDto, file: Express.Multer.File) {

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

    
    const workbook = xlsx.read(file.buffer);
    const sheetNames = workbook.SheetNames;
    const sheet = workbook.Sheets[sheetNames[0]];

    const jsonData = xlsx.utils.sheet_to_json(sheet, { raw: false, defval: '' });

    const finalJsonData = jsonData.map(floor => ({
        number: floor['Number'],
        isActive: true,
        buildingId: buildingId,
    }));

    // Preventing duplicate floors
    try {
        const existingFloors = await this.prisma.floor.findMany({
            where: {
                buildingId: buildingId,
                number: {
                    in: finalJsonData.map(floor => floor.number),
                },
            },
        });

        const existingFloorNumbers = new Set(existingFloors.map(f => f.number));
        const newFloors = finalJsonData.filter(floor => !existingFloorNumbers.has(floor.number));

        if (newFloors.length === 0) {
            throw new HttpException('No new floors to add. All floors already exist.', HttpStatus.CONFLICT);
        }

        const duplicateNumbers = finalJsonData.filter(floor => existingFloorNumbers.has(floor.number)).map(floor => floor.number);

        if (duplicateNumbers.length > 0) {
            throw new HttpException(`The following floors already exist: ${duplicateNumbers.join(', ')}`, HttpStatus.CONFLICT);
        }

        const createdFloors = await this.prisma.floor.createMany({
            data: newFloors,
            skipDuplicates: true, // Prisma feature to skip duplicates
        });

        return createdFloors;

    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            // Handle Prisma specific errors
            switch (error.code) {
                case 'P2002':
                    const duplicateNumber = error.meta?.target; // Assuming target holds the field that failed
                    throw new HttpException(`A floor with the number '${duplicateNumber}' already exists.`, HttpStatus.CONFLICT);
                case 'P2025':
                    // Record not found
                    throw new HttpException('A referenced record was not found.', HttpStatus.NOT_FOUND);
                case 'P2000':
                    // Invalid input
                    throw new HttpException('Invalid input data. Please check your data.', HttpStatus.BAD_REQUEST);
                default:
                    throw new HttpException(`An error occurred with code: ${error.code}.`, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } else if (error instanceof HttpException) {
            throw error; // Re-throw HttpExceptions
        } else {
            // General error handling
            throw new HttpException('An unexpected error occurred.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

  async add(societyId:number, buildingId:number,addFloorDto: AddFloorDto): Promise<ViewFloorDto> {
    const society = await this.prisma.society.findFirst({
      where:{
        id: societyId
      }
    })
    if(!society) throw new HttpException("society not found", HttpStatus.NOT_FOUND);


    const checkBuilding = await this.prisma.building.findFirst({
      where: { AND: [
        {id: buildingId},
        {societyId: societyId}
      ]},
    });
    if (!checkBuilding) {
      throw new NotFoundException('Building not found');
    }

    const addedFloor = await this.prisma.floor.create({ 
      select: {
        id: true,
        number: true, 
        building: { 
          select: { 
            id: true,
            name: true,
            society: {
              select:{
                id: true,
                name: true
              }
            } 
          } 
        } 
      },
      data: {
        number: addFloorDto.number,
        buildingId: buildingId,
        isActive: true
      } 
       });
    return addedFloor;
  }

  async findById(societyId:number , buildingId: number, id: number): Promise<ViewFloorDto> {
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

    
    const floor = await this.prisma.floor.findFirst({
      where: { AND: [
        {id: id},
        {buildingId: buildingId}
      ]},
      select: {
        id: true,
        number: true, 
        building: { 
          select: { 
            id: true,
            name: true,
            society: {
              select:{
                id: true,
                name: true
              }
            } 
          } 
        } 
      },
    });

    if(!floor) throw new HttpException("floor not found for associated buildingId", HttpStatus.NOT_FOUND);
    return floor;
  }

  async edit(floorDto: AddFloorDto, societyId: number, buildingId: number, id: number): Promise<ViewFloorDto> {
    const society = await this.prisma.society.findFirst({
      where:{
        id: societyId
      }
    })
    if(!society) throw new HttpException("society not found", HttpStatus.NOT_FOUND);

    const checkBuilding = await this.prisma.building.findFirst({
      where: { AND: [
        {id: buildingId},
        {societyId: societyId},
      ]},
      select:{
        floors:{
          where:{
            id: id
          }
        }
      }
    });

    if (!checkBuilding) {
      throw new NotFoundException('Building not found');
    }

    if(checkBuilding.floors.length==0) throw new HttpException("floor not found for perticular building check param id",HttpStatus.NOT_FOUND);


    const editedFloor = await this.prisma.floor.update({
      select: {
        id: true,
        number: true, 
        building: { 
          select: { 
            id: true,
            name: true,
            society: {
              select:{
                id: true,
                name: true
              }
            } 
          } 
        } 
      },
      where: { id: Number(id) },
      data: floorDto,
    });

    return editedFloor;
  }
  async transformFloorArray(floorArray) {
    const transformedFloorArray = await Promise.all(
      floorArray.map(async (item) => {
        const building = await this.prisma.building.findFirst({
          where: { id: item.buildingId }
        });

        const society = await this.prisma.society.findFirst({
          where: { id: building.societyId }
        });

        return {
          id: item.id,
          number: item.number,
          building: {
            id: building.id,
            name: building.name,
            society: {
              id: society.id,
              name: society.name
            }
          },
          isActive: item.isActive,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt
        };
      })
    );

    return transformedFloorArray;
  }


  async getFilteredFloors(
    pageSize: number,
    pageOffset: number,
    name: string,
    sortBy: string,
    sortOrder: 'asc' | 'desc',
    societyId:number,
    buildingId: number
  ): Promise<ListFloorPageDto> {
    const whereArray = [];
    let whereQuery = {};

    const society = await this.prisma.society.findFirst({
      where:{
        id: societyId
      }
    });
    if(!society) throw new HttpException("society not found",HttpStatus.NOT_FOUND);

    const building = await this.prisma.building.findFirst({
      where:  { AND: [
        {id: buildingId},
        {societyId: societyId}
      ]}
    })

    if(!building) throw new HttpException("building not found",HttpStatus.NOT_FOUND);
    
   

    //define for the perticular building
    whereArray.push({buildingId: buildingId});
   
  
    if (name !== undefined) {
      whereArray.push({ number: { contains: name,mode:'insensitive' } });
    }
  
    if (whereArray.length > 0) {
      if (whereArray.length > 1) {
        whereQuery = { AND: whereArray };
      } else {
        whereQuery = whereArray[0];
      }
    }
  
    const sort = (sortBy ? sortBy : 'number').toString();
    const order = sortOrder ? sortOrder : 'asc';
    const size = pageSize ? pageSize : 10;
    const offset = pageOffset ? pageOffset : 0;
    const orderBy = { [sort]: order };
    const count = await this.prisma.floor.count({
      where: whereQuery,
    });
  
    const listFloors = await this.prisma.floor.findMany({
      where: whereQuery,
      take: Number(size),
      skip: Number(size * offset),
      orderBy,
      select: {
        id: true,
        number: true,
         building: {   
          select: { 
            id: true,
            name: true,
            society: {
              select:{
                id: true,
                name: true
              }
            } 
          } 
        } 
      },
    });
  
    // const listFloorDtos = await this.transformFloorArray(listFloors);
  
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
      content: listFloors,
    };
  }
  

  async deleteFloor(societyId:number, buildingId: number,id: number): Promise<void> {
    const checkSociety = await this.prisma.society.findFirst({
      where:{
        id: societyId
      }
    });
    if(!checkSociety) throw new HttpException("society not found",HttpStatus.NOT_FOUND);

    const checkBuilding = await this.prisma.building.findFirst({
      where: { AND: [
        {id: buildingId},
        {societyId: societyId},
      ]},
      select:{
        floors:{
          where:{
            id: id
          }
        }
      }
    });

    if (!checkBuilding) {
      throw new NotFoundException('Building not found');
    }
    
    if(checkBuilding.floors.length==0) throw new HttpException("floor not found for perticular building check param id",HttpStatus.NOT_FOUND);

    try{
      const deletedFloor = await this.prisma.floor.delete({
        where: { id: Number(id) },
      });

      if (!deletedFloor) {
        throw new NotFoundException('Floor not found');
      }
    }catch(e){
      throw new HttpException("floor should be empty", HttpStatus.BAD_REQUEST);
    }
    
  }

  async softDeleteFloor(id: number, status: string): Promise<void> {
    const checkFloor = await this.prisma.floor.findUnique({
      where: { id: Number(id) },
    });

    if (!checkFloor) {
      throw new NotFoundException('Floor not found');
    } else {
      const flag = status === 'true';
      if (checkFloor.isActive !== flag) {
        const deletedFloor = await this.prisma.floor.update({
          where: { id: Number(id) },
          data: { isActive: flag },
        });

        if (!deletedFloor) {
          throw new NotFoundException();
        }else{
          return;
        }
        
      }
    }
  }
}
