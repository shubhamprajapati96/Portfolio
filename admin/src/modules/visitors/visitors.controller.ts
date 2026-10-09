import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { VisitorsService } from './visitors.service';
import { extractClientInfo } from '../../common/utils/client-info.util';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('visitors')
export class VisitorsController {
  constructor(private readonly visitorsService: VisitorsService) {}

  // PUBLIC endpoint: track visitor on page load or APK launch
  @Post('track')
  async track(@Body() body: any, @Req() req: any) {
    const clientInfo = extractClientInfo(req, body);
    return this.visitorsService.track(body, clientInfo);
  }

  // ADMIN PROTECTED endpoint:
  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Query('country') country?: string,
    @Query('deviceType') deviceType?: string,
    @Query('source') source?: string,
    @Query('search') search?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string
  ) {
    return this.visitorsService.findAll({
      country,
      deviceType,
      source,
      search,
      limit: limit ? parseInt(limit, 10) : 50,
      offset: offset ? parseInt(offset, 10) : 0
    });
  }
}
