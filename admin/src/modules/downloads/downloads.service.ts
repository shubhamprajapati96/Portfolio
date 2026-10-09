import { Injectable } from '@nestjs/common';
import { StoreService } from '../../common/services/store.service';
import { ClientInfo } from '../../common/utils/client-info.util';

@Injectable()
export class DownloadsService {
  constructor(private readonly storeService: StoreService) {}

  async track(body: any, clientInfo: ClientInfo) {
    const download = await this.storeService.trackDownload({
      ipAddress: clientInfo.ipAddress,
      country: clientInfo.country,
      city: clientInfo.city,
      region: clientInfo.region,
      userAgent: clientInfo.userAgent,
      deviceType: clientInfo.deviceType,
      platform: clientInfo.platform,
      referrer: body.referrer || 'Direct',
      version: body.version || '1.0.0',
      source: body.source || 'web_button'
    });

    return {
      success: true,
      downloadId: download._id,
      timestamp: download.timestamp
    };
  }

  async findAll(query: { country?: string; limit?: number; offset?: number }) {
    return this.storeService.getDownloads(query);
  }
}
