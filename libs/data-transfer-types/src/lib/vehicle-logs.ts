import { AccessDirection, AccessStatus } from '@prisma/client';



export interface ViewVehicleLogs {
    id:number;
    device: {
        id:number;
        name: string;
        deviceId: string
    };
    vehicle: {
        id:number;
        name: string;
        number: string;
        flats:{
            id:number;
            number:string;
        }[]
    };
    status:AccessStatus;
    direction:AccessDirection;
    dateTime:string;
}