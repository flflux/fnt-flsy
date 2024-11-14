import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AddDeviceVehicleDto, AddVehicleDeviceDto } from './dto/add-vehicledevice.dto';
import { VehicleDeviceDto } from './dto/vehicledevice.dto';

@Injectable()
export class VehicleDeviceService {
    private prisma = new PrismaClient();


    async add(societyId: number, deviceId: number,addVehicleDeviceDto: AddVehicleDeviceDto){
        const society = await this.prisma.society.findFirst({
            where: {
                id: societyId
            }
        })
        if(!society) throw new HttpException("society not found", HttpStatus.NOT_FOUND);


        const device = await this.prisma.device.findFirst({
            where: {
                id: deviceId,
                societyId: societyId,
            }
        })
        if(!device.isActive) throw new HttpException("device is blacklisted for society",HttpStatus.BAD_REQUEST)
        if(!device) throw new HttpException("device not found", HttpStatus.NOT_FOUND);
        
        const vehicle = await this.prisma.vehicle.findFirst({
            where: {
                id: addVehicleDeviceDto.vehicleId,
            }
        })
        if(!vehicle.isActive) throw new HttpException("vehicle is blacklisted",HttpStatus.BAD_REQUEST);
        if(!vehicle) throw new HttpException("vehicle not found", HttpStatus.NOT_FOUND);

        const vehicledevicelink = await this.prisma.vehicleDevice.findFirst({
            where:{
                deviceId: deviceId,
                vehicleId: addVehicleDeviceDto.vehicleId
            }
        });
        if(vehicledevicelink) throw new HttpException("vehicle is already linked with device", HttpStatus.BAD_REQUEST);
        

        return this.prisma.vehicleDevice.create({
            data: {
                deviceId: deviceId,
                vehicleId: addVehicleDeviceDto.vehicleId
            }
        })
    }

    async addVehicleDevice(societyId: number, vehicleId: number,addDeviceVehicleDto: AddDeviceVehicleDto){
        console.log("addVehicleDevice", societyId,vehicleId, addDeviceVehicleDto)
        const society = await this.prisma.society.findFirst({
            where: {
                id: societyId
            }
        })
        if(!society) throw new HttpException("society not found", HttpStatus.NOT_FOUND);

        const vehicle = await this.prisma.vehicle.findFirst({
            where: {
                id: vehicleId,
            }
        })
        if(!vehicle.isActive) throw new HttpException("vehicle is blacklisted",HttpStatus.BAD_REQUEST);
        if(!vehicle) throw new HttpException("vehicle not found", HttpStatus.NOT_FOUND);

        const device = await this.prisma.device.findFirst({
            where: {
                id: addDeviceVehicleDto.deviceId,
                societyId: societyId,
            }
        })
        if(!device.isActive) throw new HttpException("device is blacklisted",HttpStatus.BAD_REQUEST);
        if(!device) throw new HttpException("device not found", HttpStatus.NOT_FOUND);


        const vehicledevicelink = await this.prisma.vehicleDevice.findFirst({
            where:{
                deviceId: addDeviceVehicleDto.deviceId,
                vehicleId: vehicleId
            }
        });
        if(vehicledevicelink) throw new HttpException("vehicle is already linked with device", HttpStatus.BAD_REQUEST);
        

        return this.prisma.vehicleDevice.create({
            data: {
                deviceId: addDeviceVehicleDto.deviceId,
                vehicleId: vehicleId
            }
        })


    }

    async listAllVehicles(societyId: number, deviceId: number, pageSize: number, pageOffset: number, sortBy: string, sortOrder :string){
        const society = await this.prisma.society.findFirst({
            where: {
                id: societyId
            }
        })
        if(!society) throw new HttpException("society not found", HttpStatus.NOT_FOUND);

        const whereArray = [];

        let whereQuery = {};

        whereArray.push({deviceId: deviceId});

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
          const count = await this.prisma.vehicleDevice.count({
            where: whereQuery,
            
            take: Number(size),
            skip: Number(size * offset),
            orderBy,
          });
    


        const vehicles = await this.prisma.vehicleDevice.findMany({
            where: {
                deviceId: deviceId,
            },
            select: {
                vehicles: true
            }
        })
        return   {
            size: size,
            number: offset,
            total: count,
            sort: [
              {
                by: sort,
                order: order,
              },
            ],
            content: vehicles,
          };;
    }



    async listDevicesForVehicle(societyId: number, vehicleId: number, pageSize: number, pageOffset: number, sortBy: string, sortOrder :string){
        const society = await this.prisma.society.findFirst({
            where: {
                id: societyId
            }
        })
        if(!society) throw new HttpException("society not found", HttpStatus.NOT_FOUND);

        const whereArray = [];

        let whereQuery = {};

        whereArray.push({vehicleId: vehicleId});

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
          const count = await this.prisma.vehicleDevice.count({
            where: whereQuery,
            
            take: Number(size),
            skip: Number(size * offset),
            orderBy,
          });
    


        const devices = await this.prisma.vehicleDevice.findMany({
            where: {
                vehicleId: vehicleId,
            },
            select: {
                devices: true
            }
        })
        return   {
            size: size,
            number: offset,
            total: count,
            sort: [
              {
                by: sort,
                order: order,
              },
            ],
            content: devices,
          };;
    }



    async findById(id: number){
        const vehicledeviceinfo =await  this.prisma.vehicleDevice.findFirst({
            where: {
                id: id
            },
            select:{
                vehicles: true,
                devices:true
            }
        })
        console.log(vehicledeviceinfo);
        return vehicledeviceinfo;
    }

    async edit(vehicleDeviceDto: VehicleDeviceDto, id: number){
        return this.prisma.vehicleDevice.update({
            data: vehicleDeviceDto,
            where:{
                id: id
            }
        })
    }

    async deleteVehicleDevice(societyId: number, deviceId: number,vehicleId:number){
        const society = await this.prisma.society.findFirst({
            where: {
                id :societyId
            }
        })
        if(!society) throw new HttpException("society not found ",HttpStatus.NOT_FOUND);
        
        const relation = await this.prisma.vehicleDevice.findFirst({
            where:{
                deviceId: deviceId,
                vehicleId: vehicleId,
            }
        })

        if(!relation) throw new HttpException("relation for vehicle device not found ",HttpStatus.NOT_FOUND);
         await this.prisma.vehicleDevice.delete({
            where: {
                id: relation.id
            }
         })
        return 
    }


}
