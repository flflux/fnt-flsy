import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { NotificationsService } from '../notifications/notifications.service';

@Module({
  providers: [UsersService, NotificationsService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
