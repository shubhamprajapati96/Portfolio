import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards
} from '@nestjs/common';
import { EnquiriesService } from './enquiries.service';
import { extractClientInfo } from '../../common/utils/client-info.util';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('enquiries')
export class EnquiriesController {
  constructor(private readonly enquiriesService: EnquiriesService) {}

  // PUBLIC endpoint: accepts contact inquiries from website or APK
  @Post()
  async create(@Body() body: any, @Req() req: any) {
    const clientInfo = extractClientInfo(req, body);
    return this.enquiriesService.create(body, clientInfo);
  }

  // ADMIN PROTECTED endpoints:
  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('source') source?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string
  ) {
    return this.enquiriesService.findAll({
      search,
      status,
      source,
      limit: limit ? parseInt(limit, 10) : 50,
      offset: offset ? parseInt(offset, 10) : 0
    });
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string; notes?: string }
  ) {
    return this.enquiriesService.updateStatus(id, body.status, body.notes);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    return this.enquiriesService.remove(id);
  }
}
