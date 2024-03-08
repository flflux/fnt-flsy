import { ViewVehicle} from '@fnt-flsy/data-transfer-types';
import { VehicleType } from '@prisma/client';


export class ViewVehicleDto implements ViewVehicle {
  id: number;
  name: string;
  type:VehicleType;
  number: string;
  isActive: boolean;

}
