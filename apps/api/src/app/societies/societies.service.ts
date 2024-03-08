import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { SocietyDto } from './dto/society.dto';
import { ListSocietyPageDto } from './dto/list-society-page.dto';
import { AddSocietyDto, AddSocietyResponseDto } from './dto/add-society.dto';
import { ListSocietyDto } from './dto/list-society.dto';
import { EditSocietyDto, EditSocietyStatusDto } from './dto/edit-society.dto';


import * as fs from 'fs';
import * as xlsx from 'xlsx';
import { FileDto } from '../core/dto/page-base.dto';


@Injectable()
export class SocietiesService {
  private prisma = new PrismaClient();

  async bulkUploadSocietyData(fileDto:FileDto,file){
    const workbook = xlsx.read(file.buffer);
    const sheetNames = workbook.SheetNames;
    const sheet = workbook.Sheets[sheetNames[0]];

    const jsonData = xlsx.utils.sheet_to_json(sheet);

    const finalJsonData: AddSocietyDto[]= [];
    jsonData.map(society =>{
      const tempData : AddSocietyDto = {
        'name' : society['Name'],
        'addressLine1' : society['Address Line 1'],
        'addressLine2' : society['Address Line 2'],
        'city' : society['City'],
        'postalCode' : society['Postal Code'],
        'countryCode' : society['Country Code'],
        'stateCode' : society['State Code'],
        'email' : society['Email'],
        'phoneNumber' : String(society['Phone Number']),
        'code' : society['Code'],
        'isActive' : true,
      };
     
      
      console.log(tempData);

      finalJsonData.push(tempData);
    })

     return this.prisma.$transaction(async (tx) => {
        const result =  await tx.society.createMany({data:finalJsonData});
        return result;
      })

  }
  
  isValidMobileNumber(mobileNumber: string): boolean {
    // Define a regex pattern for a 10-digit mobile number
    const pattern = /^[0-9]{10}$/;
  
    // Test the provided mobile number against the pattern
    return pattern.test(mobileNumber);
  }

  


  async add(addSocietyDto: AddSocietyDto): Promise<AddSocietyResponseDto> {

    const isPhoneNumberValid = this.isValidMobileNumber(addSocietyDto.phoneNumber);

    if (!isPhoneNumberValid) {
      throw new HttpException(`${addSocietyDto.phoneNumber} is a valid 10-digit mobile number.`,HttpStatus.BAD_REQUEST);
    } ;

    const checkSociety = await this.prisma.society.findFirst({
      where: {
        name: addSocietyDto.name,
      },
    });
    if (checkSociety) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Society already exists',
        },
        HttpStatus.BAD_REQUEST
      );
    }
    const addsoc = await this.prisma.society.create({
      data: {
        name: addSocietyDto.name,
        email: addSocietyDto.email,
        phoneNumber:addSocietyDto.phoneNumber,
        addressLine1: addSocietyDto.addressLine1,
        addressLine2: addSocietyDto.addressLine2,
        city: addSocietyDto.city,
        stateCode: addSocietyDto.stateCode,
        countryCode: addSocietyDto.countryCode,
        postalCode: addSocietyDto.postalCode,
        isActive: true,
        code: addSocietyDto.code
      },
      select:{
        id: true,
        name: true,
        addressLine1: true,
        addressLine2: true,
        email: true,
        phoneNumber: true,
        city: true,
        stateCode: true,
        countryCode: true,
        postalCode: true,
        isActive: true,
        code: true
      }
    });
    return addsoc;
  }

  async giveAssetCount(societyId: number){
    if(Number.isNaN(societyId)) throw new HttpException('society id is missing in params', HttpStatus.BAD_REQUEST);

    const society = this.prisma.society.findUnique({
      where: {
        id: societyId,
      },
    });

    if (!society)
      throw new HttpException('society not found ', HttpStatus.NOT_FOUND);

    const societyIdList = await this.prisma.society.findFirst({
      select:{
        id: true,
        buildings:{
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
        }
      },
      where: {
        id: societyId
      }
    });
   

    const listsociety = await this.prisma.society.findFirst({
      select: {
        id: true,
        name: true,
        isActive: true,
      },
      where: {
        id: societyId,
        isActive: true
      }
    });

    


    async function getNestedLengths(PrismaClient,data, depth, Buildings, Floors, Flats, Residents,Vehicles) { 
      
      if (depth === 3) Buildings += data.length;
      else if (depth === 2) Floors += data.length;
      else if (depth === 1) Flats += data.length;
      else if (depth === 0) Residents += data.length;
  
      if (depth <= 0) {
          return { Buildings, Floors, Flats, Residents,Vehicles };
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
                if(vehicleResponse) Vehicles =vehicleResponse;
                innerData = item.residents;
              }
  
              const lengths = await getNestedLengths(PrismaClient,innerData, depth - 1, Buildings, Floors, Flats, Residents,Vehicles);
              Buildings = lengths.Buildings;
              Floors = lengths.Floors;
              Flats = lengths.Flats;
              Residents = lengths.Residents;
              Vehicles = lengths.Vehicles;
          }
      }
  
      return { Buildings, Floors, Flats, Residents ,Vehicles};
  }
  
 
    const tempresult = await getNestedLengths(this.prisma,societyIdList.buildings,3, 0, 0, 0, 0,0)
    listsociety['assetcount'] = tempresult;
    
    return listsociety
  }

 

  async findById(id: number): Promise<ListSocietyDto> {
    const socview = await this.prisma.society.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        name: true,
        addressLine1: true,
        addressLine2: true,
        city: true,
        email: true,
        phoneNumber: true,
        stateCode: true,
        countryCode: true,
        postalCode: true,
        isActive: true,
        code: true
      }
    });
    if (!socview.isActive) {
      throw new NotFoundException('Society not found');
    } else {
      if (!socview) {
        throw new NotFoundException();
      }
      return socview;
    }
  }

  async edit(societyDto: EditSocietyDto, id: number): Promise<SocietyDto> {
    const isPhoneNumberValid = this.isValidMobileNumber(societyDto.phoneNumber);

    if (!isPhoneNumberValid) {
      throw new HttpException(`${societyDto.phoneNumber} is a valid 10-digit mobile number.`,HttpStatus.BAD_REQUEST);
    } ;

    const checkSociety = await this.prisma.society.findUnique({
      where: { id: Number(id) },
    });
    if (!checkSociety) {
      throw new NotFoundException();
    } else {
      const soc = await this.prisma.society.findFirst({
        where: {
          name: societyDto.name,
        },
      });

      if (soc && soc.id != id) {
        throw new HttpException(
          'Society with same email already exists',
          HttpStatus.BAD_REQUEST
        );
      } else {
        const updatesoc = this.prisma.society.update({
          where: { id: id },
          data: societyDto,
          select:{
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
            addressLine1: true,
            addressLine2: true,
            city: true,
            stateCode: true,
            countryCode: true,
            postalCode: true,
            isActive: true,
            code: true
          }
        });
        return updatesoc;
      }
    }
  }

  async softDeleteSociety(id: number, editSocietyStatusDto: EditSocietyStatusDto): Promise<EditSocietyStatusDto> {
    const checkSocietyDele = await this.prisma.society.findUnique({
      where: { id: Number(id) },
    });
    if (!checkSocietyDele) {
      throw new NotFoundException('Society not found');
    } else {
      const flag = editSocietyStatusDto.isActive == true;
      if (checkSocietyDele.isActive != flag) {
        const dele = await this.prisma.society.update({
          where: { id: Number(id) },
          data: { isActive: flag },
          select: {
            isActive: true
          }
        });
        return dele;
      }
    }
  }
  async deleteSociety(id: number): Promise<void> {
    const dele = await this.prisma.society.findUnique({
      where: { id: Number(id) },
    });
    if (!dele) {
      throw new NotFoundException('Society not found');
    }

    await this.prisma.society.delete({
      where: { id: Number(id) },
    });
  }

  async getFilteredSocieties(
    pageSize: number,
    pageOffset: number,
    name: string,
    city: string,
    status: string,
    sortBy: string,
    sortOrder: 'asc' | 'desc'
  ): Promise<ListSocietyPageDto> {
    const whereArray = [];
    let whereQuery = {};

    if (name !== undefined) {
      whereArray.push({ name: { contains: name, mode: 'insensitive' } });
    }
    if (city !== undefined) {
      whereArray.push({ city: { contains: city, mode: 'insensitive' } });
    }
    if (status !== undefined) {
      if(status=='active'){
        whereArray.push({ isActive: true });

      }else if(status=='inactive'){
        whereArray.push({ isActive: false });

      }else if(status=='all'){
        whereArray.push({ isActive: true });
        whereArray.push({ isActive: false });

      }else{
        throw new HttpException("status should be one of 'active', 'inactive', 'all'. ",HttpStatus.BAD_REQUEST);
      }
      
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
    const count = await this.prisma.society.count({
      where: whereQuery,
    });

    const societies = await this.prisma.society.findMany({
      select: {
        id: true,
        name: true,
        addressLine1: true,
        addressLine2: true,
        city: true,
        email: true,
        phoneNumber: true,
        stateCode: true,
        countryCode: true,
        postalCode: true,
        isActive: true,
        code: true,
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
      content: societies,
    };
  }
}
