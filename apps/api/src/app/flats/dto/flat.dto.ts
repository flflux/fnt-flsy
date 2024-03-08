import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, MaxLength } from 'class-validator';

export class FlatDto {
  @ApiProperty() id: number;
  @IsNotEmpty() @ApiProperty() @MaxLength(25) number: string;
  @IsNumber() @ApiProperty() floorId?: number;
  @ApiProperty()
  @IsBoolean()
  isActive?: boolean;
}
