import { Controller, Get, HttpCode, HttpStatus, Param, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LogService } from './log.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';

@ApiTags('logs')
@Controller()
export class LogController {
    constructor(private logService: LogService) {}
    
    @ApiOperation({summary: "get logs for the society"})
    @UseGuards(AuthGuard,RolesGuard)
    @Roles(Role.FOUNTLAB_ADMIN, Role.ORGANIZATION_ADMIN,Role.SOCIETY_ADMIN)  
    @Get('/societies/:societyId/logs')
    @HttpCode(HttpStatus.OK)
    // @ApiOkResponse({ type: ListFloorPageDto })
    async getFilteredLogs(
      @Param('societyId') societyId: number,
      @Query('pageSize') pageSize?: number,
      @Query('pageOffset') pageOffset?: number,
      @Query('sortBy') sortBy?: string,
      @Query('sortOrder') sortOrder?: 'asc' | 'desc'
    ) {
      const listLogs = await this.logService.getFilteredLogs(
        +pageSize,
        +pageOffset,
        sortBy,
        sortOrder,
        +societyId,
      );
      return listLogs;
    }
    
}
