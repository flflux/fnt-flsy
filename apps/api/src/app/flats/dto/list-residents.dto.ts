import { listResidentByFlat, listVehicleByFlat } from '@fnt-flsy/data-transfer-types';
import { ApiProperty } from '@nestjs/swagger';
import { ResidentType } from '@prisma/client';



export class ResidentDto{
    @ApiProperty()  id: number
    @ApiProperty()  name: string
    @ApiProperty()  email: string
    @ApiProperty()  phoneNumber: string
    @ApiProperty()  isChild: boolean
    @ApiProperty()  isActive: boolean
    @ApiProperty()  createdAt:string
    @ApiProperty()  updatedAt: string
}

export class ListResidentByFlatDto implements listResidentByFlat{
    @ApiProperty() id: number
    @ApiProperty() flatId: number
    @ApiProperty() residentId: number
    @ApiProperty()  type: ResidentType
   // @ApiProperty({type: ResidentDto}) resident: ResidentDto; 
}



export class ListVehicleByFlatDto implements listVehicleByFlat{
    @ApiProperty() id: number
    @ApiProperty() flatId: number
    @ApiProperty() vehicleId: number
    @ApiProperty()  type: ResidentType
   // @ApiProperty({type: ResidentDto}) resident: ResidentDto; 
}