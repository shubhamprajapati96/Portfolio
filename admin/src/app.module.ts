import { Module } from '@nestjs/common';
import { StoreModule } from './common/store.module';
import { AuthModule } from './modules/auth/auth.module';
import { EnquiriesModule } from './modules/enquiries/enquiries.module';
import { VisitorsModule } from './modules/visitors/visitors.module';
import { DownloadsModule } from './modules/downloads/downloads.module';
import { StatsModule } from './modules/stats/stats.module';

@Module({
  imports: [
    StoreModule,
    AuthModule,
    EnquiriesModule,
    VisitorsModule,
    DownloadsModule,
    StatsModule
  ]
})
export class AppModule {}
