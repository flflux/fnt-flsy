import { VehicleType } from '@prisma/client';
import { Page } from './page';

export interface Vehicle {
  id: number;
  name: string;
  type: VehicleType;
  number: string;
  flatId: number;
  isActive: boolean;
}

export interface ViewVehicle {
  id: number;
  name: string;
  type: VehicleType;
  number: string;
  isActive: boolean;
}
export type EditVehicle = Pick<AddVehicle, 'name' | 'type' | 'isActive'>

export type ListVehicle = Pick<ViewVehicle, 'id' | 'number' | 'type' >;

export type AddVehicle = Omit<Vehicle, 'id'|'flatId'>;

export type ListVehiclePage = Page<ListVehicle>;
