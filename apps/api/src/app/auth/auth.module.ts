import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from './../users/users.module';
import { LocalStrategy } from './local.strategy';
import { SessionSerializer } from './session.serializer';
import { UsersService } from '../users/users.service';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { NotificationsService } from '../notifications/notifications.service';

@Module({
  imports: [UsersModule],
  providers: [
    AuthService,
    LocalStrategy,
    SessionSerializer,
    UsersService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    NotificationsService
  ],
  exports: [AuthService],
})
export class AuthModule {}
