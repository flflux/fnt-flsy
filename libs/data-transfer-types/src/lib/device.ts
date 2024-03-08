import { DeviceType } from '@prisma/client';
import { Page } from './page';

export interface Device {
  id: number;
  deviceId: string;
  name: string;
  thingId: string;
  thingKey: string;
  channelId: string;
  type:DeviceType;
  deviceKey: string;
  lastSyncTimestamp:number;
  siteId?: number;
  isActive: boolean;
  societyId?: number;
}

export interface ViewDevice {
  id: number;
  deviceId?: string;
  name: string;
  thingId?: string;
  thingKey?: string;
  lastSyncTimestamp?:number;
  channelId?: string;
  society?: {
    id: number,
    name: string,
  };
  site?: {
    id: number;
    name: string;
    siteGroup: {
      id: number;
      name: string;
      organization: { id: number; name: string };
    };
  };
}

export type ListDevices = Pick<ViewDevice, 'id' | 'deviceId' | 'name' | 'site'>;

export type AddDevice = Pick<Device, 'deviceId' | 'name' | 'societyId' | 'type'| 'deviceKey' | 'siteId'>;

export type EditDevice = Pick<Device,  'name'>;

export type EditDevicesSetting = Pick<Device,   'deviceId'| 'thingId'| 'thingKey'| 'channelId'| 'type'>;

export type EditDevicesKey = Pick<Device,  'deviceKey'>;

export type EditDevicesStatus = Pick<Device,  'isActive'>;


export type ListDevicesPage = Page<ListDevices>;
