import { ViewResident } from '@fnt-flsy/data-transfer-types';


export class ViewResidentDto implements ViewResident {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  isChild: boolean;
  isActive: boolean;
}
