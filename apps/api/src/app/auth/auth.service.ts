import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { comparePasswords } from './bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}

  async validateUser(email: string, hashP: string) {
    const user = await this.userService.findByEmail(email);
    const check = await comparePasswords(hashP, user.password);
    if (check) {
      const userRes = { id: user.id, name: user.firstName, email: user.email };
      return userRes;
    } else return null;
  }
}
