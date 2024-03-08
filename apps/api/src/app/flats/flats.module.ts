import { Module } from '@nestjs/common';
import { FlatsController } from './flats.controller';
import { FlatsService } from './flats.service';

@Module({
  controllers: [FlatsController],
  providers: [FlatsService],
})
export class FlatsModule {}
