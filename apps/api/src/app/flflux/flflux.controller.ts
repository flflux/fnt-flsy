import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { FlfluxService } from './flflux.service';
import { Roles } from '../auth/roles.decorator';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Role } from '../auth/role.enum';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('flflux')
export class FlfluxController {
  constructor(private flfluxservice: FlfluxService) {}

  // test api for tag sync check
  @ApiOperation({
    summary: 'Sync updates from cards and update the device state',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  @UseGuards(AuthGuard,RolesGuard)
  @Roles(Role.FOUNTLAB_ADMIN, Role.ORGANIZATION_ADMIN,Role.SOCIETY_ADMIN)  
  @Post('sync')
  myGateSync() {
    return "card sync api"
    // return this.flfluxservice.CardSync();
  }

  @ApiOperation({
    summary: 'Sync updates from MyGate and update the device state',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  @UseGuards(AuthGuard,RolesGuard)
  @Roles(Role.FOUNTLAB_ADMIN, Role.ORGANIZATION_ADMIN,Role.SOCIETY_ADMIN)  
  @Post('sync/:deviceId')
  myGateSyncForDeviceWithDeviceId(@Param('deviceId') deviceId: string) {
    return 'card sync for device api'
    // return this.flfluxservice.myGateSyncForDeviceWithDeviceId(deviceId);
  }
}
