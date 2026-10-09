import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ApiConfigService } from './api-config.service';
import { catchError, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly http = inject(HttpClient);
  private readonly apiConfig = inject(ApiConfigService);
  private readonly platformId = inject(PLATFORM_ID);

  private hasTrackedCurrentSession = false;

  /**
   * Tracks visitor details automatically on app init
   */
  trackVisit(pageUrl: string = '/') {
    if (!isPlatformBrowser(this.platformId) || this.hasTrackedCurrentSession) {
      return;
    }
    this.hasTrackedCurrentSession = true;

    const source = this.apiConfig.getSource();
    const referrer = document.referrer || 'Direct';

    // Extract client browser details to send along
    const userAgent = navigator.userAgent;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

    const payload = {
      pageUrl: pageUrl || window.location.pathname,
      referrer,
      source,
      userAgent,
      timezone
    };

    const url = this.apiConfig.getApiUrl('/visitors/track');

    this.http
      .post(url, payload)
      .pipe(
        catchError((err) => {
          // Silent fallback on network issues so user experience is never blocked
          return of(null);
        })
      )
      .subscribe();
  }

  /**
   * Tracks APK download events when user clicks "Download APK"
   */
  trackDownload(source: string = 'web_download_button') {
    if (!isPlatformBrowser(this.platformId)) return;

    const url = this.apiConfig.getApiUrl('/downloads/track');
    const payload = {
      source,
      referrer: document.referrer || 'Direct',
      userAgent: navigator.userAgent,
      platform: 'Android'
    };

    this.http
      .post(url, payload)
      .pipe(
        catchError((err) => {
          return of(null);
        })
      )
      .subscribe();
  }
}
