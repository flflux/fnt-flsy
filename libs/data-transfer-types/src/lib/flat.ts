import { Page } from './page';

export interface Flat {
  id: number;
  number: string;
  floorId: number;
  isActive:boolean
}

export interface ViewFlat {
  id: number;
  number: string;
  isActive?: boolean;

  floor: {
    id: number;
    number: string;

    building: {
      id: number;
      name: string;

      society: {
        id: number;
        name: string;
      };
    };
  };
}


export interface listResidentByFlat{
  id: number,
  flatId: number,
  residentId: number,
  type: string,
  // resident: {
  //     id: number,
  //     name: string,
  //     email: string,
  //     phoneNumber: string,
  //     isChild: boolean,
  //     isActive: boolean,
  //     createdAt:string,
  //     updatedAt: string
  // }
}


export interface listVehicleByFlat{
  id: number,
  flatId: number,
  vehicleId: number,
  type: string,
  // resident: {
  //     id: number,
  //     name: string,
  //     email: string,
  //     phoneNumber: string,
  //     isChild: boolean,
  //     isActive: boolean,
  //     createdAt:string,
  //     updatedAt: string
  // }
}

export type ListFlat = Pick<ViewFlat, 'id' | 'number' | 'floor'>;

export type AddFlat = Pick<Flat, 'number'>;

export type ListFlatPage = Page<ListFlat>;
