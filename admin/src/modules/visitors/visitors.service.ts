import { Injectable } from '@nestjs/common';
import { StoreService } from '../../common/services/store.service';
import { ClientInfo } from '../../common/utils/client-info.util';

@Injectable()
export class VisitorsService {
  constructor(private readonly storeService: StoreService) {}

  async track(body: any, clientInfo: ClientInfo) {
    const visitor = await this.storeService.trackVisitor({
      ipAddress: clientInfo.ipAddress,
      country: clientInfo.country,
      city: clientInfo.city,
      region: clientInfo.region,
      timezone: clientInfo.timezone,
      userAgent: clientInfo.userAgent,
      browser: clientInfo.browser,
      os: clientInfo.os,
      deviceType: clientInfo.deviceType,
      pageUrl: body.pageUrl || '/',
      referrer: body.referrer || 'Direct',
      source: body.source === 'apk' ? 'apk' : 'web'
    });

    return {
      success: true,
      visitorId: visitor._id,
      visitCount: visitor.visitCount
    };
  }

  async findAll(query: {
    country?: string;
    deviceType?: string;
    source?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }) {
    return this.storeService.getVisitors(query);
  }
}
