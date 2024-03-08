import { PageBase } from '@fnt-flsy/data-transfer-types';
import { ApiProperty } from '@nestjs/swagger';
import { SortByOrderDto } from './sort-by-order.dto';

export class PageBaseDto implements PageBase {
  @ApiProperty() number: number;
  @ApiProperty() size: number;
  @ApiProperty({ type: [SortByOrderDto] }) sort: SortByOrderDto[];
  @ApiProperty() total: number;
}


export class FileDto {
  @ApiProperty({ type: 'string', format: 'binary' }) file: Express.Multer.File
}
