import { Module } from '@nestjs/common';
import { MainFluxService } from '../mainflux/mainflux.service';
import { FlfluxController } from './flflux.controller';
import { FlfluxService } from './flflux.service';

@Module({
  controllers: [FlfluxController],
  providers: [FlfluxService,MainFluxService],
})
export class FlfluxModule {}
