import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { UsersService } from '../users/users.service';
import { comparePasswords } from './bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}

  private prisma = new PrismaClient();

  async validateUser(email: string, hashP: string) {
    const user = await this.userService.findByEmail(email);
    const check = await comparePasswords(hashP, user.password);
    if (check) {
      const userRes = { id: user.id, name: user.firstName, email: user.email };
      return userRes;
    } else return null;
  }


  async validateDeviceRequest(request: any) {
    const deviceId = request.params.deviceId;
    const deviceKey = request.headers['device-key'];
    const device_Id = request.headers['device-id'];

    if(deviceId){
      console.log("inside teh params ");
      if(deviceId!=device_Id){
        return false;
      }
    }
    console.log('inside the validate device request');
    const device = await this.prisma.device.findFirst({
      where: {
        deviceId: device_Id,
      },
    });
    console.log(device);
    if (!device) {
      return false;
    }

    if (device.isDeviceKeyExempt) {
      return true;
    }
   
    console.log(device_Id,deviceKey,deviceId);
    if (
      deviceKey == undefined ||
      device_Id == undefined 
    ) {
      return false;
    }
    return await comparePasswords(deviceKey, device.deviceKey);
  }
}
