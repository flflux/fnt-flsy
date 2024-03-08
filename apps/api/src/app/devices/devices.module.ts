import { Module} from '@nestjs/common';
import { DevicesController } from './devices.controller';
import { DevicesService } from './devices.service';
import { MainFluxService } from '../mainflux/mainflux.service';

@Module({
    controllers: [DevicesController],
    providers: [DevicesService,MainFluxService],
  })
export class DevicesModule {}
