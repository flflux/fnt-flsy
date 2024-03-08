import { Page } from "./page";

export interface Building{
  id: number;
  name: string;
  societyId?: number;
  isActive?: boolean;
}
export interface ViewBuilding {
  id: number;
  name: string;
  society: {
    id: number;
    name: string;
  };
  isActive?: boolean;
}

export interface assetPerBuilding{
  buildingLength: number,
  floorLength: number,
  flatLength: number,
  residentLength: number,
  vehicleLength: number
}
export interface assetCount {
  [key: string]: assetPerBuilding;
}


export interface buildingsInfo{
  content: {
    buildings: ViewBuilding[],

  }
}



export type ListBuilding = Pick<ViewBuilding, 'id' | 'name' | 'society'>;

export type AddBuilding = Omit<Building, 'id' | 'societyId'| 'isActive'>;

export type ListBuildingPage = Page<ListBuilding>;
