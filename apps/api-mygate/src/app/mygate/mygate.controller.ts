import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MyGateService } from './mygate.service';
import { UserAuthGuard } from '../core/auth/user-auth.guard';

@ApiTags('mygate')
@UseGuards(UserAuthGuard)
@Controller('mygate')
export class MyGateController {
  constructor(private myGateService: MyGateService) {}

  // test api for tag sync check
  @ApiOperation({
    summary: 'Sync updates from MyGate and update the device state',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  @Post('sync')
  myGateSync() {
    return this.myGateService.myGateSync();
  }

  @ApiOperation({
    summary: 'Sync updates from MyGate and update the device state',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  @Post('sync/:deviceId')
  myGateSyncForDeviceWithDeviceId(@Param('deviceId') deviceId: string) {
    return this.myGateService.myGateSyncForDeviceWithDeviceId(deviceId);
  }
}
