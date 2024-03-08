import { ViewFloor } from '@fnt-flsy/data-transfer-types';
import { ApiProperty } from '@nestjs/swagger';

export class ViewFloorDto implements ViewFloor {
  @ApiProperty() id: number;
  @ApiProperty() number: string;
  @ApiProperty() building: {
    id: number;
    name: string;
    society: { id: number; name: string };
  };
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
