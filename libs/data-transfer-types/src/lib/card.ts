import { CardType } from '@prisma/client';
import { Page } from './page';

  

export interface Card {
  id: number;
  number: string;
  vehicleId?: number;
  isActive: boolean;
  type: CardType;
  deviceId: string;
}

export interface ViewCard {
  id: number;
  number: string;
  vehicleId: number;
  isActive: boolean;

}

export type ListCard = Pick<ViewCard, 'id' | 'number' | 'vehicleId'| 'isActive'>;

export type AddCard = Pick<Card, 'number' | 'vehicleId'| 'isActive'| 'type' | 'deviceId'>;

export type ListCardPage = Page<ListCard>;
