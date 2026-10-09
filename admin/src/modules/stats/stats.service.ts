import { Injectable } from '@nestjs/common';
import { StoreService } from '../../common/services/store.service';

@Injectable()
export class StatsService {
  constructor(private readonly storeService: StoreService) {}

  async getDashboardStats() {
    return this.storeService.getDashboardStats();
  }
}
