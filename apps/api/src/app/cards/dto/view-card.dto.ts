import { ViewCard } from '@fnt-flsy/data-transfer-types';

export class ViewCardDto implements ViewCard {
  id: number;
  number: string;
  vehicleId: number;
  isActive: boolean;

}
