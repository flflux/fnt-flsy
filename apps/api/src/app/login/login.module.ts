import { Module } from '@nestjs/common';
import { LoginController } from './login.controller';
import { UsersModule } from '../users/users.module';

@Module({
    imports:[UsersModule],
    controllers: [LoginController],
    providers: [],
  })
export class LoginModule {}
