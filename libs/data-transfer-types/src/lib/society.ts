import { Page } from './page';

export interface Society {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  stateCode?: string;
  countryCode: string;
  postalCode: string;
  isActive: boolean;

}


export interface ViewSociety {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  stateCode: string;
  countryCode: string;
  postalCode: string;
  isActive: boolean;
  code: string;
  assetcount: {
    buildingLength: number,
    floorLength: number,
    flatLength: number,
    residentLength: number,
    vehicleLength: number
  }

}

export type ListSociety = Pick<Society, 'id' | 'name' | 'isActive'>;

export type AddSociety = Omit<Society, 'id'>;

export type AddSocietyResponse = Omit<Society, 'id' | 'isActive'>;

export type EditSociety = Omit<Society, 'id' | 'isActive'>;
export type EditSocietyStatus = Pick<Society, 'isActive'>;

export type EditSocietyResponse = Society

export type ListSocietyPage = Page<ListSociety>;
