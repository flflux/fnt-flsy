import { Page } from './page';

export interface VehicleDevice {
    id: number;
    vehicleId: number;
    deviceId: number
}

export interface ViewVehicleDevice {
  id: number;
  vehicleId: number;
  deviceId: number
}

export type ListVehicleDevice = Pick<ViewVehicleDevice, 'id' | 'vehicleId' | 'deviceId'>;

export type AddVehicleDevice = Pick<VehicleDevice,   'vehicleId'>;
export type AddDeviceVehicle = Pick<VehicleDevice,   'deviceId'>;

export type ListVehicleDevicePage = Page<ListVehicleDevice>;
