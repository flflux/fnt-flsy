import { ViewFlat } from '@fnt-flsy/data-transfer-types';

export class ViewFlatDto implements ViewFlat {
  id: number;
  number: string;
  isActive?: boolean;

  floor: {
    id: number;
    number: string;

    building: {
      id: number;
      name: string;

      society: {
        id: number;
        name: string;
      };
    };
  };
}
