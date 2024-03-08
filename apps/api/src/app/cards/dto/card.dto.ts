import { Card } from '@fnt-flsy/data-transfer-types';
import { ApiProperty } from '@nestjs/swagger';
import { CardType } from '@prisma/client';
import { IsNotEmpty, IsNumber } from 'class-validator';



export class CardDto implements Card {
  @ApiProperty() id: number;

  @IsNotEmpty()
  @ApiProperty()
  number: string;

  @IsNumber()
  @ApiProperty()
  vehicleId: number;
  
  @ApiProperty() isActive: boolean;
  @ApiProperty() type: CardType;


}
