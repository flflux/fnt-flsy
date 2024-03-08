import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '@fnt-flsy/prisma-client-mygate';
import { MyGateLogDto } from './dto/mygate-log.dto';

@Injectable()
export class MyGateLogsService {
  constructor(private prismaService: PrismaService) {}

  async getMyGateLogs(myGateCardId?: number): Promise<MyGateLogDto[]> {
    return this.prismaService.myGateLog.findMany({
      select: {
        id: true,
        timestamp: true,
        status: true,
        direction: true,
        myGateCardId: true,
      },
      where: {
        myGateCardId: myGateCardId,
      },
    });
  }

  async getMyGateLog(id: number): Promise<MyGateLogDto> {
    const log = await this.prismaService.myGateLog.findFirst({
      where: {
        id: Number(id),
      },
    });
    if (!log) {
      throw new HttpException('MyGate log not found', HttpStatus.NOT_FOUND);
    }
    return log;
  }

  deleteMyGateLog(id: number) {
    return this.prismaService.myGateLog.delete({
      where: {
        id: id,
      },
    });
  }
}
