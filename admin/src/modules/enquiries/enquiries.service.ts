import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { StoreService } from '../../common/services/store.service';
import { ClientInfo } from '../../common/utils/client-info.util';

@Injectable()
export class EnquiriesService {
  constructor(private readonly storeService: StoreService) {}

  async create(data: any, clientInfo: ClientInfo) {
    if (!data.name || !data.email || !data.subject || !data.message) {
      throw new BadRequestException('Name, email, subject, and message are required fields.');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new BadRequestException('Please provide a valid email address.');
    }

    const enquiry = await this.storeService.createEnquiry({
      name: data.name.trim(),
      email: data.email.trim(),
      subject: data.subject.trim(),
      message: data.message.trim(),
      ipAddress: clientInfo.ipAddress,
      country: clientInfo.country,
      city: clientInfo.city,
      region: clientInfo.region,
      userAgent: clientInfo.userAgent,
      deviceType: clientInfo.deviceType,
      platform: clientInfo.platform,
      source: data.source === 'apk' ? 'apk' : 'web'
    });

    return {
      success: true,
      message: 'Your enquiry has been received successfully. I will get back to you promptly!',
      id: enquiry._id
    };
  }

  async findAll(query: { search?: string; status?: string; source?: string; limit?: number; offset?: number }) {
    return this.storeService.getEnquiries(query);
  }

  async updateStatus(id: string, status: string, notes?: string) {
    const valid = ['new', 'read', 'replied', 'archived'];
    if (!valid.includes(status)) {
      throw new BadRequestException(`Status must be one of: ${valid.join(', ')}`);
    }

    const updated = await this.storeService.updateEnquiryStatus(id, status, notes);
    if (!updated) {
      throw new NotFoundException('Enquiry not found.');
    }
    return { success: true, item: updated };
  }

  async remove(id: string) {
    await this.storeService.deleteEnquiry(id);
    return { success: true, message: 'Enquiry removed successfully.' };
  }
}
