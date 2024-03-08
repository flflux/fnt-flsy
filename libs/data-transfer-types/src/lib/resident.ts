import { ResidentType } from '@prisma/client';
import { Page } from './page';

export interface Resident {
  id: number;
  name: string;
  type: ResidentType;
  email?: string;
  phoneNumber?: string;
  isChild: boolean;
  isActive: boolean;
}

export interface ViewResident {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  isChild: boolean;
  isActive: boolean;

}

export type ListResident = Pick<ViewResident, 'id' | 'name' |'isActive'>;

export type AddResident = Omit<Resident, 'id'>;

export type ListResidentPage = Page<ListResident>;
