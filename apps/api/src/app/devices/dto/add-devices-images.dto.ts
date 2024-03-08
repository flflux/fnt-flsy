
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateImageDto {
    @ApiProperty() 
    @IsNotEmpty()
    device_id: number;

    @ApiProperty({ type: 'string', format: 'binary' }) file: Express.Multer.File
}