import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiConfigService {
  private readonly platformId = inject(PLATFORM_ID);
  private customApiUrl: string | null = null;

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const stored = localStorage.getItem('portfolio_api_url_override');
        if (stored) this.customApiUrl = stored;
      } catch (e) {}
    }
  }

  /**
   * Returns true if running natively inside the Android APK (Capacitor WebView)
   */
  isApk(): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;

    // Capacitor or Cordova native flag
    const win = window as any;
    if (win?.Capacitor?.isNativePlatform?.()) return true;

    // Scheme or host checks in Android WebView
    const host = window.location.hostname;
    const protocol = window.location.protocol;
    const isLocalhostScheme = host === 'localhost' || host === '127.0.0.1';
    const isCapacitorScheme = protocol === 'capacitor:' || protocol === 'ionic:';

    // If running in localhost but NOT on dev port 4200 (standard Angular dev server), it's the Capacitor APK WebView
    const port = window.location.port;
    if ((isLocalhostScheme && port !== '4200') || isCapacitorScheme) {
      return true;
    }

    return false;
  }

  getSource(): 'web' | 'apk' {
    return this.isApk() ? 'apk' : 'web';
  }

  /**
   * Resolves the full API URL for any endpoint.
   * If running in the APK, relative paths like /api won't resolve locally on Android,
   * so it automatically maps to the hosted Vercel / production URL.
   */
  getApiUrl(path: string): string {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;

    if (this.customApiUrl) {
      const base = this.customApiUrl.replace(/\/+$/, '');
      return `${base}${cleanPath}`;
    }

    if (this.isApk()) {
      // In Android APK, communicate with the production hosted API
      const prodBase = (environment.apiUrl || 'https://shubhamprajapati.dev/api').replace(/\/+$/, '');
      const endpoint = cleanPath.startsWith('/api') ? cleanPath.substring(4) : cleanPath;
      return `${prodBase}${endpoint}`;
    }

    // In web browser, use relative /api path which works with Vercel and custom domains
    if (cleanPath.startsWith('/api')) {
      return cleanPath;
    }
    return `/api${cleanPath}`;
  }

  setCustomApiUrl(url: string | null) {
    this.customApiUrl = url;
    if (isPlatformBrowser(this.platformId)) {
      if (url) {
        localStorage.setItem('portfolio_api_url_override', url);
      } else {
        localStorage.removeItem('portfolio_api_url_override');
      }
    }
  }
}
