import { Module } from '@nestjs/common';
import { SiteGroupsController } from './site-groups.controller';
import { SiteGroupsService } from './site-groups.service';

@Module({
    controllers: [SiteGroupsController],
    providers: [SiteGroupsService],
  })
export class SiteGroupsModule {}
