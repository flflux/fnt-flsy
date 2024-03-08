import { Page } from './page';

export interface Floor {
  id: number;
  number: string;
  buildingId?: number; 
  isActive?: boolean;

}

export interface ViewFloor {
  id: number;
  number: string;
  isActive?: boolean;

  building: {
    id: number;
    name: string;
    society: { id: number; name: string };
  };
}

export type ListFloor = Pick<ViewFloor, 'id' | 'number' | 'building'  >;

export type AddFloor = Omit<Floor, 'id'|'buildingId'|'isActive'>;

export type ListFloorPage = Page<ListFloor>;
