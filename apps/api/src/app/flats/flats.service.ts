import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';
import { AddFlatDto } from './dto/add-flat.dto';
import { FlatDto } from './dto/flat.dto';
import { ViewFlatDto } from './dto/view-flat.dto';
import { ListFlatPageDto } from './dto/list-flat-page.dto';
import { ListResidentByFlatDto, ListVehicleByFlatDto } from './dto/list-residents.dto';
import { ListFlatDto } from './dto/list-flat.dto';
import * as fs from 'fs';
import * as xlsx from 'xlsx';
import { FileDto } from '../core/dto/page-base.dto';


@Injectable()
export class FlatsService {
  private prisma = new PrismaClient();
  

  // async bulkUploadFlat(societyId: number,fileDto:FileDto,file){
  //   const society = await this.prisma.society.findFirst({
  //     where:{
  //       id: societyId
  //     }
  //   })
  //   if(!society) throw new HttpException("society not found", HttpStatus.NOT_FOUND);
    
  //   const workbook = xlsx.read(file.buffer);
  //   const sheetNames = workbook.SheetNames;
  //   const sheet = workbook.Sheets[sheetNames[0]];

  //   const jsonData = xlsx.utils.sheet_to_json(sheet, {raw: false,  defval: ''});



  //   this.prisma.$transaction(async (tx) => {

  //       let buildingId:number;
  //       let floorId:number;
      
  //       console.log("inside the transection");
  //       for (const flatData of jsonData) {
          
  //         // section for create building if not exist..
  //         console.log(flatData);
  //         const building = await tx.building.findFirst({
  //           where:{
  //             societyId: societyId,
  //             name: flatData['Building Name']
  //           }
  //         });
  //         if(!building){
  //           const newbuilding  = await tx.building.create({
  //             data:{
  //               'name': flatData['Building Name'],
  //               'isActive': true,
  //               'societyId': societyId
  //             }
  //           });

  //           buildingId = newbuilding.id;
  //         }else{
  //           buildingId = building.id;
  //         }


  //         //section for creating floor if not exist.
          
  //         const floor = await tx.floor.findFirst({
  //           where:{
  //             number: flatData['Floor Number'],
  //             buildingId: buildingId
  //           }
  //         });

  //         if(!floor){
  //           const newFloor = await tx.floor.create({
  //             data:{
  //               'number': flatData['Floor Number'],
  //               "buildingId": buildingId,
  //               "isActive": true
  //             }
  //           });
  //           floorId = newFloor.id
  //         }else{
  //           floorId = floor.id;
  //         }

  //         //Section for creating flat if not exist.

  //         const flat = await tx.flat.findFirst({
  //           where:{
  //             floorId: floorId,
  //             number: flatData['Flat Number'],
  //           }
  //         })
  //         if(!flat){
  //           const newFlat = await tx.flat.create({
  //             data:{
  //               number: flatData['Flat Number'],
  //               floorId: floorId,
  //               isActive: true
  //             }
  //           });
  //           if(!newFlat){
  //             throw new HttpException("transection error while creating flat please recheck the excel sheet", HttpStatus.CONFLICT);
  //           }
  //         }
  //       }

  //   })
    
    
  //   return 'accepted';
  // }
  // async bulkUploadFlat(societyId: number, fileDto: FileDto, file: Express.Multer.File) {
  //   const society = await this.prisma.society.findFirst({
  //     where: {
  //       id: societyId,
  //     },
  //   });
  
  //   if (!society) throw new HttpException('Society not found', HttpStatus.NOT_FOUND);
  
  //   const workbook = xlsx.read(file.buffer);
  //   const sheetNames = workbook.SheetNames;
  //   const sheet = workbook.Sheets[sheetNames[0]];
  
  //   const jsonData = xlsx.utils.sheet_to_json(sheet, { raw: false, defval: '' });
  //   // const jsonData = xlsx.utils.sheet_to_json(sheet);
  
  //   let errorRows = []; // To track rows where an error occurs
  
  //   try {
  //     await this.prisma.$transaction(async (tx) => {
  //       let buildingId: number;
  //       let floorId: number;
  
  //       console.log('Inside the transaction');
  //       for (const flatData of jsonData) {
  //         try {
  //           // Create building if not exist
  //           console.log(flatData);
  //           const building = await tx.building.findFirst({
  //             where: {
  //               societyId: societyId,
  //               name: flatData['Building Name'],
  //             },
  //           });
  
  //           if (!building) {
  //             const newBuilding = await tx.building.create({
  //               data: {
  //                 name: flatData['Building Name'],
  //                 isActive: true,
  //                 societyId: societyId,
  //               },
  //             });
  //             buildingId = newBuilding.id;
  //           } else {
  //             buildingId = building.id;
  //           }
  
  //           // Create floor if not exist
  //           const floor = await tx.floor.findFirst({
  //             where: {
  //               number: flatData['Floor Number'],
  //               buildingId: buildingId,
  //             },
  //           });
  
  //           if (!floor) {
  //             const newFloor = await tx.floor.create({
  //               data: {
  //                 number: flatData['Floor Number'],
  //                 buildingId: buildingId,
  //                 isActive: true,
  //               },
  //             });
  //             floorId = newFloor.id;
  //           } else {
  //             floorId = floor.id;
  //           }
  
  //           // Create flat if not exist
  //           const flat = await tx.flat.findFirst({
  //             where: {
  //               floorId: floorId,
  //               number: flatData['Flat Number'],
  //             },
  //           });
  
  //           if (!flat) {
  //             const newFlat = await tx.flat.create({
  //               data: {
  //                 number: flatData['Flat Number'],
  //                 floorId: floorId,
  //                 isActive: true,
  //               },
  //             });
  
  //             if (!newFlat) {
  //               throw new Error('Transaction error while creating flat');
  //             }
  //           }
  //         } catch (error) {
  //           console.error(`Error processing flat data: ${JSON.stringify(flatData)} - Error: ${error.message}`);
  //           errorRows.push(flatData); // Track failed entries
  //         }
  //       }
  //     });
  //   } catch (transactionError) {
  //     console.error('Transaction error:', transactionError);
  //     throw new HttpException('An error occurred while processing the bulk upload.', HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  
  //    // If there are failed entries, create and return an Excel file
  //    if (errorRows.length > 0) {
  //     const errorWorkbook = xlsx.utils.book_new();
  //     const errorSheet = xlsx.utils.json_to_sheet(errorRows);
  //     xlsx.utils.book_append_sheet(errorWorkbook, errorSheet, 'Failed Entries');

  //     // Create a buffer for the Excel file
  //     const buffer = xlsx.write(errorWorkbook, { bookType: 'xlsx', type: 'buffer' });

  //     // Return the buffer as a file response
  //     return {
  //       file: buffer, // Returning the buffer
  //       filename: 'failed_entries.xlsx', // Set a filename
  //     };
  //   }
  
  //   return 'Bulk upload completed successfully';
  // }

  async bulkUploadFlat(societyId: number, fileDto: FileDto, file: Express.Multer.File) {
    const society = await this.prisma.society.findFirst({
      where: { id: societyId },
    });
  
    if (!society) throw new HttpException('Society not found', HttpStatus.NOT_FOUND);
  
    const workbook = xlsx.read(file.buffer);
    const sheetNames = workbook.SheetNames;
    const sheet = workbook.Sheets[sheetNames[0]];
    
    const jsonData = xlsx.utils.sheet_to_json(sheet, { raw: false, defval: '' });
    
    const errorResultArray: Array<{ row: any; error: string }> = []; // To track rows with errors
    let successCount = 0; // Counter for successful entries
    let failureCount = 0; // Counter for failed entries
  
    try {
      await this.prisma.$transaction(async (tx) => {
        console.log('Inside the transaction');
        
        for (const [index, flatData] of jsonData.entries()) {
          // Trim input data
          const buildingName = flatData['Building Name']?.trim();
          const floorNumber = flatData['Floor Number']?.trim();
          const flatNumber = flatData['Flat Number']?.trim();
          console.log(typeof(flatData), flatData)
          if (!buildingName || !floorNumber || !flatNumber) {
            errorResultArray.push({ row: index + 1, error: 'Missing required fields.' });
            failureCount++; // Increment failure count
            continue; // Skip this entry
          }
  
          try {
            // Create building if not exist
            const building = await tx.building.findFirst({
              where: { societyId: societyId, name: buildingName },
            });
  
            const buildingId = building
              ? building.id
              : (await tx.building.create({
                  data: { name: buildingName, isActive: true, societyId: societyId },
                })).id;
  
            // Create floor if not exist
            const floor = await tx.floor.findFirst({
              where: { number: floorNumber, buildingId: buildingId },
            });
  
            const floorId = floor
              ? floor.id
              : (await tx.floor.create({
                  data: { number: floorNumber, buildingId: buildingId, isActive: true },
                })).id;
  
            // Create flat if not exist
            const flat = await tx.flat.findFirst({
              where: { floorId: floorId, number: flatNumber },
            });
  
            if (!flat) {
              await tx.flat.create({
                data: { number: flatNumber, floorId: floorId, isActive: true },
              });
            }
  
            successCount++; // Increment success count for each successful entry
          } catch (error) {
            console.error(`Error processing flat data: ${JSON.stringify(flatData)} - Error: ${error.message}`);
            errorResultArray.push({ row: index + 1, error: error.message }); // Track failed entries
            failureCount++; // Increment failure count
          }
        }
      });
    } catch (transactionError) {
      console.error('Transaction error:', transactionError);
      throw new HttpException('An error occurred while processing the bulk upload.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  
    // Return success and failure counts along with errors
    return {
      success_count: successCount,
      failure_count: failureCount,
      errors: errorResultArray,
    };
  }
  


  async bulkUploadFlatData(societyId: number,buildingId: number,floorId:number,fileDto:FileDto,file){
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

      const workbook = xlsx.read(file.buffer);
      const sheetNames = workbook.SheetNames;
      const sheet = workbook.Sheets[sheetNames[0]];

      const jsonData = xlsx.utils.sheet_to_json(sheet, {raw: false,  defval: ''});


      const finalJsonData = [];
      jsonData.map(flat =>{
        flat['isActive'] = true;
        flat['floorId'] = floorId;
        finalJsonData.push(flat);
      })
      
      try {
          const answer = await this.prisma.flat.createMany({
            data: finalJsonData
          })
          return answer;
        
      } catch (error) {
        throw new HttpException("flat already exist check code",HttpStatus.BAD_REQUEST);
      }
    }

  async add(
    societyId: number,
    buildingId: number,
    floorId: number,
    addFlatDto: AddFlatDto): Promise<ViewFlatDto> {
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
              id: floorId
            }
          }
        }
      });
  
      if (!checkBuilding) {
        throw new NotFoundException('Building not found');
      }
      
      if(checkBuilding.floors.length==0) throw new HttpException("floor not found for perticular building check param floorId",HttpStatus.NOT_FOUND);
  


    return this.prisma.flat.create({
      select: {
        id: true,
        number: true,
        floor:{
          select:{
            id:true,
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
          }
        }
      },
      data: {
        number: addFlatDto.number,
        floorId: floorId,
        isActive: true,
      },
    });
  }

  async findById(societyId:number, buildingId:number, floorId: number,
    id: number, userId: number): Promise<ViewFlatDto> {

      const society = await this.prisma.society.findFirst({
        where:{
          id: societyId
        }
      });
      if(!society) throw new HttpException("society not found",HttpStatus.NOT_FOUND);
  
      const building = await this.prisma.building.findFirst({
        where: {
          id: buildingId
        }
      })
  
      if(!building) throw new HttpException("building not found",HttpStatus.NOT_FOUND);

      const floor = await this.prisma.floor.findFirst({
        where: {
          id: floorId
        }
      })
      if(!floor) throw new HttpException("floor not found",HttpStatus.NOT_FOUND);

  
      
    const flat = await this.prisma.flat.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        number: true,
        id: true,
        // isActive: true,
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
    });
    if (!flat) {
      throw new HttpException('flat not found', HttpStatus.NOT_FOUND);
    } else {
      return flat;
    }
  }



      async edit(flatDto: AddFlatDto, societyId:number,buildingId: number, floorId: number, id: number): Promise<ListFlatDto> {
        const society = await this.prisma.society.findFirst({
          where:{
            id: societyId
          }
        });
        if(!society) throw new HttpException("society not found",HttpStatus.NOT_FOUND);
    
        const building = await this.prisma.building.findFirst({
          where: {
            id: buildingId
          }
        })
    
        if(!building) throw new HttpException("building not found",HttpStatus.NOT_FOUND);
  
        const floor = await this.prisma.floor.findFirst({
          where: {
            id: floorId
          }
        })
        if(!floor) throw new HttpException("floor not found",HttpStatus.NOT_FOUND);
    

        if(!flatDto || !id) throw new HttpException('flatdto or id is missing',HttpStatus.BAD_REQUEST)
        const checkFlat = await this.prisma.flat.findUnique({
          where: { id: Number(id) },
        });
        if (!checkFlat) {
          throw new HttpException('flat not found', HttpStatus.NOT_FOUND);
        } 
        
        try {
          const updatedFlat = await this.prisma.flat.update({
            select: {
              id: true,
              number: true,
              floor:{
                  select:{
                      id: true,
                      number: true,
                      building:{
                          select: {
                              id: true,
                              name: true,
                              society:{
                                  select:{
                                      id: true,
                                      name: true,
                                  }
                              }
                          }
                      }
                  }
              }
          },
            where: { id: Number(id) },
            data: flatDto,
          });
          return updatedFlat;
        } catch (error) {
          console.log('inside the catch block here');
          throw new HttpException("Duplicate Flat name",HttpStatus.BAD_REQUEST);
        }
        
        
      }


      async getFilteredFlats(
        pageSize: number,
        pageOffset: number,
        number: string,
        buildingName:string,
        floorNumber:string,
        sortBy: string,
        sortOrder: 'asc' | 'desc',
        userId: number,
        societyId:number,
        buildingId: number,
        floorId: number,
        associateFloor: boolean
      )
      : Promise<ListFlatPageDto>
       {

        console.log("get society flats",pageSize, pageOffset, number, buildingName,floorNumber, sortBy, sortOrder, userId, societyId, buildingId, floorId, associateFloor);
        const checkSociety = await this.prisma.society.findFirst({
          where:{
            id: societyId
          }
        });
        if(!checkSociety) throw new HttpException("society not found",HttpStatus.NOT_FOUND);
    
        // if (floorId  == undefined) {
        //   throw new HttpException("Floor ID is missing",HttpStatus.NOT_FOUND);
        // }
        const checkBuilding = await this.prisma.building.findFirst({
          where: {  
            id: buildingId,
            societyId: societyId
          },
          select:{
            floors:{
              where:{
                id: floorId
              }
            }
          }
        });
    
        if (!checkBuilding) {
          throw new NotFoundException('Building not found');
        }
        
        if(associateFloor){
          if(checkBuilding.floors.length==0) throw new HttpException("floor not found for perticular building check param floorId",HttpStatus.NOT_FOUND);
        }

  
        const whereArray = [];

        //give associated flat for the pertirulcar building 
        if(!associateFloor){
         

          whereArray.push({
            floor:{
              building:{
                id: buildingId,
                society:{
                  id: societyId
                }
              }
            }
          });
          
          let whereQuery = {};
        

          if (number !== undefined) {
            whereArray.push({ number: { contains: number ,mode:'insensitive'} });
          }

          if(buildingName!==undefined){
            whereArray.push({building:{name:{contains: buildingName, mode: 'insensitive'}}})
          }

          if(floorNumber!==undefined){
            whereArray.push({floor:{number:{contains: floorNumber, mode: 'insensitive'}}})
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
          const count = await this.prisma.flat.count({
            where: whereQuery,
          });
    
          const ListFlat = await this.prisma.flat.findMany({
            where: whereQuery,
            select: {
                id: true,
                number: true,
                floor:{
                    select:{
                        id: true,
                        number: true,
                        building:{
                            select: {
                                id: true,
                                name: true,
                                society:{
                                    select:{
                                        id: true,
                                        name: true,
                                    }
                                }
                            }
                        }
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
            content: ListFlat,
          };
        }
        

          let whereQuery = {};

          whereArray.push({
            floor:{
              id: floorId,
              building:{
                id: buildingId,
                society:{
                  id: societyId
                }
              }
            }
          });

        

          if (number !== undefined) {
            whereArray.push({ number: { contains: number ,mode:'insensitive'} });
          }

          if(buildingName!==undefined){
            whereArray.push({building:{name:{contains: buildingName, mode: 'insensitive'}}})
          }

          if(floorNumber!==undefined){
            whereArray.push({floor:{number:{contains: floorNumber, mode: 'insensitive'}}})
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
          const count = await this.prisma.flat.count({
            where: whereQuery,
          });
    
          const ListFlat = await this.prisma.flat.findMany({
            where: whereQuery,
            select: {
                id: true,
                number: true,
                floor:{
                    select:{
                        id: true,
                        number: true,
                        building:{
                            select: {
                                id: true,
                                name: true,
                                society:{
                                    select:{
                                        id: true,
                                        name: true,
                                    }
                                }
                            }
                        }
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
      content: ListFlat,
    };
    
  }

  async softDeleteFlat(id: number, status: string): Promise<void> {
    const checkflat = await this.prisma.flat.findUnique({
      where: { id: Number(id) },
    });
    if (!checkflat) {
      throw new NotFoundException();
    } else {
      const flag = status === 'true';
      if (checkflat.isActive != flag) {
        const dele = await this.prisma.flat.update({
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

  async deleteFlat(
    societyId: number,
    buildingId: number,
    floorId: number,
    id: number): Promise<void> {
    const society = await this.prisma.society.findFirst({
      where:{
        id: societyId
      }
    });
    if(!society) throw new HttpException("society not found",HttpStatus.NOT_FOUND);

    const building = await this.prisma.building.findFirst({
      where: {
        id: buildingId
      }
    })

    if(!building) throw new HttpException("building not found",HttpStatus.NOT_FOUND);

    const floor = await this.prisma.floor.findFirst({
      where: {
        id: floorId
      }
    })
    if(!floor) throw new HttpException("floor not found",HttpStatus.NOT_FOUND);


    const flat = await this.prisma.flat.findFirst({
      where: { id: id },
    });
    if (!flat) throw new HttpException('flat not found', HttpStatus.NOT_FOUND);
    try {
      const deletedFlat = await this.prisma.flat.delete({
        where: { id: Number(id) },
      });
      if (!deletedFlat) {
        throw new HttpException('Error in hard delete', HttpStatus.NOT_FOUND);
      } else {
        return;
      }
      
    } catch (error) {
      throw new HttpException("Flat is not empty delete the residents and vehicles first", HttpStatus.CONFLICT);
    }
    
  }


  async getCardsAssociatedWithFlatForSociety(societyCode: string,flatNumber: string){
    const society = await this.prisma.society.findFirst({
      where:{
        code: societyCode
      }
    });
    if(!society) throw new HttpException("society not found",HttpStatus.NOT_FOUND);

    const flat = await this.prisma.flat.findFirst({
      select:{
        number: true,
        cards:{
          select:{
            number: true,
            isActive: true,
            type: true
          }
        }
      },
      where: {
        number: flatNumber,
        floor:{
          building:{
            society:{
              id: society.id
            }
          }
        }
      }
    })

    if(!flat) throw new HttpException("flat not found",HttpStatus.NOT_FOUND);

    console.log(flat);

    return flat;
    


  }
}
