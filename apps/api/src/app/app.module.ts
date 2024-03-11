import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { AppService } from './app.service';
import { OrganizationsController } from './organizations/organizations.controller';
import { OrganizationsService } from './organizations/organizations.service';
import { OrganizationsModule } from './organizations/organizations.module';
import { SiteGroupsController } from './site-groups/site-groups.controller';
import { SiteGroupsService } from './site-groups/site-groups.service';
import { SiteGroupsModule } from './site-groups/site-groups.module';
import { SitesController } from './sites/sites.controller';
import { SitesService } from './sites/sites.service';
import { SitesModule } from './sites/sites.module';
import { DevicesModule } from './devices/devices.module';
import { DevicesService } from './devices/devices.service';
import { DevicesController } from './devices/devices.controller';
import { LoginController } from './login/login.controller';
import { LoginModule } from './login/login.module';
import { MainfluxModule } from './mainflux/mainflux.module';
import { MainFluxService } from './mainflux/mainflux.service';
import { SocietiesModule } from './societies/societies.module';
import { FloorsModule } from './floors/floors.module';
import { ResidentsModule } from './residents/residents.module';
import { FlatsModule } from './flats/flats.module';
import { BuildingsModule } from './buildings/buildings.module';
import { BuildingsService } from './buildings/buildings.service';
import { BuildingsController } from './buildings/buildings.controller';
import { CardsModule } from './cards/cards.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { FlfluxController } from './flflux/flflux.controller';
import { FlfluxService } from './flflux/flflux.service';
import { FlfluxModule } from './flflux/flflux.module';
import { VehicleDeviceController } from './vehicle-device/vehicle-device.controller';
import { VehicleDeviceService } from './vehicle-device/vehicle-device.service';
import { LogModule } from './log/log.module';
import { CommunicationModule } from './communication/communication.module';
import { ScheduleModule } from '@nestjs/schedule';
import { VehicleLogsModule } from './vehicle-logs/device-logs.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    AuthModule,
    PrismaModule,
    UsersModule,
    OrganizationsModule,
    SiteGroupsModule,
    SitesModule,
    DevicesModule,
    FlfluxModule,
    LoginModule,
    MainfluxModule,
    BuildingsModule,
    FlatsModule,
    ResidentsModule,
    FloorsModule,
    SocietiesModule,
    CardsModule,
    VehiclesModule,
    LogModule,
    CommunicationModule,
    VehicleLogsModule,
    NotificationsModule,
  ],
  controllers: [AppController, VehicleDeviceController],
  providers: [AppService, VehicleDeviceService], //change
})
export class AppModule {}
