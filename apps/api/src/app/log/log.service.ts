import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class LogService {
    private prisma = new PrismaClient();



    async getFilteredLogs(
        pageSize: number,
        pageOffset: number,
        sortBy: string,
        sortOrder: 'asc' | 'desc',
        societyId:number
    ){

        const society = await this.prisma.society.findFirst({
            where:{
                id: societyId
            },
            select:{
                logs:{
                    

                }
            }
            })
        if(!society) throw new HttpException("society not found", HttpStatus.NOT_FOUND);


        // logs are sorted by the createdAt (created timestamp).
        const sort = (sortBy ? sortBy : 'createdAt').toString();
        const order = sortOrder ? sortOrder : 'asc';
        const size = pageSize ? pageSize : 10;
        const offset = pageOffset ? pageOffset : 0;
        const orderBy = { [sort]: order };
        const count = await this.prisma.vehicleLog.count({
            where: {
                societyId: societyId
            },
          });
          
        const logs = await this.prisma.vehicleLog.findMany({
            take: Number(size),
            skip: Number(size * offset),
            orderBy,
            where:{
                societyId: societyId
            },
            select:{
                id: true,
                status: true,
                direction: true,
                card:{
                    
                },
                vehicle:{

                },
                device:{
                    select:{
                        id: true,
                        deviceId: true,
                        name: true,
                        type: true,
                        isActive: true,

                    }
                }
            }
        })
        

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
            content: logs,
          };

    }
}
