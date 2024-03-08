import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AddBuildingDto } from './dto/add-building.dto';
import { BuildingDto } from './dto/buildings.dto';
import { ViewBuildingDto } from './dto/view-building.dto';
import { ListBuildingInfoDto, ListBuildingPageDto } from './dto/list-building-page.dto';
import { FileDto } from '../core/dto/page-base.dto';
import * as fs from 'fs';
import * as xlsx from 'xlsx';

@Injectable()
export class BuildingsService {
  private prisma = new PrismaClient();

  async bulkUploadBuildingData(societyId: number,fileDto:FileDto,file){
    const workbook = xlsx.read(file.buffer);
    const sheetNames = workbook.SheetNames;
    const sheet = workbook.Sheets[sheetNames[0]];

    const jsonData = xlsx.utils.sheet_to_json(sheet);


    const finalJsonData = [];
    jsonData.map(building =>{
      const tempData = {
        'name': building['Name'],
        'isActive' : true,
        'societyId' : societyId,
      }
      finalJsonData.push(tempData);
    })
    

    try {
        const answer = await this.prisma.building.createMany({
          data: finalJsonData
        })
        return answer;
      
    } catch (error) {
      throw new HttpException("building already exist check code",HttpStatus.BAD_REQUEST);
    }
  }

  async add(societyId: number,addBuildingDto: AddBuildingDto): Promise<ViewBuildingDto> {
    if(Number.isNaN(societyId)) throw new HttpException('society id is missing in params', HttpStatus.BAD_REQUEST);

    const society = await this.prisma.society.findUnique({
      where:{
        id: societyId
      }
    })
    if(!society) throw new HttpException("Society not found", HttpStatus.NOT_FOUND);
    const addBuilding = await this.prisma.building.create({
      select:{
        id: true,
        name: true,
        society:{
          select:{
            id: true,
            name: true
          }
        }
      },
      data: {
        name: addBuildingDto.name,
        isActive: true,
        societyId: societyId
      },
    });
    return addBuilding;
    
  }

  async findById(societyId: number,id: number): Promise<ViewBuildingDto> {
    if(Number.isNaN(societyId)|| Number.isNaN(id)) throw new HttpException('societyId or Id is missing in params', HttpStatus.BAD_REQUEST);
    const society = await this.prisma.society.findUnique({
      where:{
        id: societyId
      }
    })
    if(!society) throw new HttpException('society not found',HttpStatus.NOT_FOUND);

    const buildingeview = await this.prisma.building.findUnique({
      where: { id: Number(id),societyId: societyId },
      select: {
        id: true,
        name: true,
        society: { select: { id: true, name: true } },
        // isActive: true,
      },
    });
    return buildingeview
  }

  async edit(societyId:number,buildingDto: AddBuildingDto, id: number): Promise<ViewBuildingDto> {
    if(Number.isNaN(societyId) || Number.isNaN(id)) throw new HttpException('society id is missing in params', HttpStatus.BAD_REQUEST);
    const society = await this.prisma.society.findUnique({
      where:{
        id: societyId
      }
    })
    if(!society) throw new HttpException('society not found',HttpStatus.NOT_FOUND);
    const checkbuilding = await this.prisma.building.findUnique({
      where: { 
        id: Number(id), 
        societyId: societyId,
      },
      select: {
        id: true,
        name: true,
        society: { select: { id: true, name: true } },
      },
    });
    if (!checkbuilding) {
      throw new NotFoundException();
    } else {
      const checksociety = await this.prisma.society.findFirst({
        where: { id: societyId},
      });
      if (!checksociety) {
        throw new NotFoundException();
      } else {
        const updabuil = await this.prisma.building.update({
          select:{
            id: true,
            name: true,
            society:{
              select: {
                id: true,
                name: true
              }
            }
          },
          where: { id: Number(id) },
          data: buildingDto,
        });
        return updabuil;
      }
    }
  }

  async softDeleteBuilding(societyId:number,id: number, status: string): Promise<void> {
    if(Number.isNaN(societyId)|| Number.isNaN(id)) throw new HttpException('societyId or Id is missing in params', HttpStatus.BAD_REQUEST);
    const society = await this.prisma.society.findUnique({
      where:{
        id: societyId
      }
    })
    if(!society) throw new HttpException('society not found',HttpStatus.NOT_FOUND);
    const checkbuilding = await this.prisma.building.findUnique({
      where: { id: Number(id) ,societyId: societyId},
    });
    if (!checkbuilding) {
      throw new NotFoundException();
    } else {
      const flag = status === 'true';
      if (checkbuilding.isActive != flag) {
        const dele = await this.prisma.building.update({
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

  async deleteBuilding(societyId:number,id: number): Promise<void> {
    if(Number.isNaN(societyId) || Number.isNaN(id)) throw new HttpException('society id is missing in params', HttpStatus.BAD_REQUEST);
    const society = await this.prisma.society.findUnique({
      where:{
        id: societyId
      }
    })
    if(!society) throw new HttpException('society not found',HttpStatus.NOT_FOUND);
    const dele = await this.prisma.building.delete({
      where: { id: Number(id) , societyId: societyId},
    });
    if (!dele) {
      throw new NotFoundException();
    } else {
      return;
    }
  }

  async getFilteredPosts(
    pageSize: number,
    pageOffset: number,
    name: string,
    // societyName: string,
    // isActive: boolean,
    sortBy: string,
    sortOrder: 'asc' | 'desc',
    societyId: number
  ): Promise<ListBuildingPageDto> {
    if(Number.isNaN(societyId)) throw new HttpException('society id is missing in params', HttpStatus.BAD_REQUEST);

    const society = this.prisma.society.findUnique({
      where: {
        id: societyId,
      },
    });
    if (!society)
      throw new HttpException('society not found ', HttpStatus.NOT_FOUND);


   

    const whereArray = [];
    let whereQuery = {};

    //list all building for the perticular society
    whereArray.push({societyId: societyId});

    //construct wherequery
    if (name !== undefined) {
      whereArray.push({ name: { contains: name,mode:'insensitive' } });
    }

    // if (societyName !== undefined) {
    //   whereArray.push({ society: { name: { contains: societyName ,mode:'insensitive'} } });
    // }

    // if (isActive !== undefined) {
    //   whereArray.push({ isActive: { contains: isActive ,mode:'insensitive'} });
    // }

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
    const count = await this.prisma.building.count({
      where: whereQuery,
    });

    const listbuilding = await this.prisma.building.findMany({
      select: {
        id: true,
        name: true,
        society: { select: { id: true, name: true } },
        // isActive: true,
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
      content: listbuilding,
    };
  }


  async buildingsInfo(
    societyId: number
  ): Promise<ListBuildingInfoDto> {
    if(Number.isNaN(societyId)) throw new HttpException('society id is missing in params', HttpStatus.BAD_REQUEST);

    const society = this.prisma.society.findUnique({
      where: {
        id: societyId,
      },
    });
    if (!society)
      throw new HttpException('society not found ', HttpStatus.NOT_FOUND);


    const buildingIdList = await this.prisma.building.findMany({
      select: {
        id: true,
        floors: {
          select: {
            id: true,
            flats: {
              select: {
                id: true,
                residents: {
                  select: {
                    id: true,
                  },
                },
              },
            },
          },
        },
      },
      where: {
        societyId: societyId
      }
    });
   

    const listbuilding = await this.prisma.building.findMany({
      select: {
        id: true,
        name: true,
        society: { select: { id: true, name: true } },
        isActive: true,
      },
      where: {
        societyId: societyId,
        isActive: true
      }
    });


    async function getNestedLengths(PrismaClient,data, depth, buildingLength, floorLength, flatLength, residentLength,vehicleLength) {
      
      
      if (depth === 3) buildingLength += data.length;
      else if (depth === 2) floorLength += data.length;
      else if (depth === 1) flatLength += data.length;
      else if (depth === 0) residentLength += data.length;
  
      if (depth <= 0) {
          return { buildingLength, floorLength, flatLength, residentLength,vehicleLength };
      }
  
      // Recursively print lengths of nested arrays
      for (const item of data) {
          if (typeof item === 'object') {
              let innerData;
              if (depth === 3) innerData = item.floors;
              else if (depth === 2) innerData = item.flats;
              else if (depth === 1) {
                const vehicleResponse = await PrismaClient.vehicleFlat.count({
                  where: {
                    flatId: item.id
                  }

                })
                if(vehicleResponse) vehicleLength =vehicleResponse;
                innerData = item.residents;
              }
  
              const lengths = await getNestedLengths(PrismaClient,innerData, depth - 1, buildingLength, floorLength, flatLength, residentLength,vehicleLength);
              buildingLength = lengths.buildingLength;
              floorLength = lengths.floorLength;
              flatLength = lengths.flatLength;
              residentLength = lengths.residentLength;
              vehicleLength = lengths.vehicleLength;
          }
      }
  
      return { buildingLength, floorLength, flatLength, residentLength ,vehicleLength};
  }
  
 
  
  
  let counter = 0;
  for(const tempbuilding of buildingIdList){
    if(counter<buildingIdList.length-1){
      const tempresult = await getNestedLengths(this.prisma,[tempbuilding],3, 0, 0, 0, 0,0)
      listbuilding[counter]['assetcount'] = tempresult;
      counter+=1
    }
  }
    
    return {
      content: {
        buildings: listbuilding
      },
    };
  }
}
