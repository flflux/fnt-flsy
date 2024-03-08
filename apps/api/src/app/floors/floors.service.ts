import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
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

  
  async bulkUploadFloorData(societyId: number,buildingId: number,fileDto:FileDto,file){
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

    const jsonData = xlsx.utils.sheet_to_json(sheet);


    const finalJsonData = [];
    jsonData.map(floor =>{
      floor['isActive'] = true;
      floor['buildingId'] = buildingId;
      finalJsonData.push(floor);
    })
    
    try {
        const answer = await this.prisma.floor.createMany({
          data: finalJsonData
        })
        return answer;
      
    } catch (error) {
      throw new HttpException("building already exist check code",HttpStatus.BAD_REQUEST);
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
