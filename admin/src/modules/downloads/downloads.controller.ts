import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UseGuards
} from '@nestjs/common';
import { DownloadsService } from './downloads.service';
import { extractClientInfo } from '../../common/utils/client-info.util';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('downloads')
export class DownloadsController {
  constructor(private readonly downloadsService: DownloadsService) {}

  // PUBLIC endpoint: track download from web button
  @Post('track')
  async track(@Body() body: any, @Req() req: any) {
    const clientInfo = extractClientInfo(req, body);
    return this.downloadsService.track(body, clientInfo);
  }

  // PUBLIC endpoint: Direct download link that auto-tracks and redirects to APK file
  @Get('apk')
  async downloadDirectly(@Req() req: any, @Res() res: any) {
    const clientInfo = extractClientInfo(req, {
      platform: 'Android',
      deviceType: 'mobile'
    });
    await this.downloadsService.track({ source: 'direct_url' }, clientInfo);
    // Redirect to static APK asset
    return res.redirect(302, '/downloads/Shubham-Portfolio.apk');
  }

  // ADMIN PROTECTED endpoint: list who and where downloaded APK
  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Query('country') country?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string
  ) {
    return this.downloadsService.findAll({
      country,
      limit: limit ? parseInt(limit, 10) : 50,
      offset: offset ? parseInt(offset, 10) : 0
    });
  }
}
