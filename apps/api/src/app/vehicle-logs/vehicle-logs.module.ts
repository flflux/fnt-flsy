import { Module } from '@nestjs/common';
import { VehicleLogsController } from './vehicle-logs.controller';
import { VehicleLogsService } from './vehicle-logs.service';

@Module({
  controllers: [VehicleLogsController],
  providers: [VehicleLogsService],
})
export class VehicleLogsModule {}
