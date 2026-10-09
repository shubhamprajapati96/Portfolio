import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfigService } from './api-config.service';
import { AdminAuthService } from './admin-auth.service';

export interface DashboardStats {
  databaseStatus: string;
  kpis: {
    totalVisitors: number;
    totalVisits: number;
    todayVisitors: number;
    totalEnquiries: number;
    newEnquiries: number;
    todayEnquiries: number;
    totalDownloads: number;
    todayDownloads: number;
  };
  sourceBreakdown: {
    web: number;
    apk: number;
  };
  deviceBreakdown: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  topCountries: { country: string; count: number }[];
  recentActivity: {
    type: 'enquiry' | 'download' | 'visitor';
    title: string;
    subtitle: string;
    meta: string;
    timestamp: string;
  }[];
}

export interface EnquiryItem {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  ipAddress: string;
  country: string;
  city: string;
  region: string;
  userAgent: string;
  deviceType: string;
  platform: string;
  source: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VisitorItem {
  _id: string;
  ipAddress: string;
  country: string;
  city: string;
  region: string;
  timezone: string;
  userAgent: string;
  browser: string;
  os: string;
  deviceType: string;
  pageUrl: string;
  referrer: string;
  source: string;
  visitCount: number;
  firstVisitedAt: string;
  lastVisitedAt: string;
}

export interface DownloadItem {
  _id: string;
  ipAddress: string;
  country: string;
  city: string;
  region: string;
  userAgent: string;
  deviceType: string;
  platform: string;
  referrer: string;
  version: string;
  source: string;
  timestamp: string;
}

@Injectable({ providedIn: 'root' })
export class AdminApiService {
  private readonly http = inject(HttpClient);
  private readonly apiConfig = inject(ApiConfigService);
  private readonly auth = inject(AdminAuthService);

  getStats(): Observable<DashboardStats> {
    const url = this.apiConfig.getApiUrl('/stats');
    return this.http.get<DashboardStats>(url, { headers: this.auth.getAuthHeaders() });
  }

  getEnquiries(params?: {
    search?: string;
    status?: string;
    source?: string;
    limit?: number;
    offset?: number;
  }): Observable<{ items: EnquiryItem[]; total: number }> {
    const url = this.apiConfig.getApiUrl('/enquiries');
    let httpParams = new HttpParams();
    if (params?.search) httpParams = httpParams.set('search', params.search);
    if (params?.status) httpParams = httpParams.set('status', params.status);
    if (params?.source) httpParams = httpParams.set('source', params.source);
    if (params?.limit) httpParams = httpParams.set('limit', params.limit.toString());
    if (params?.offset) httpParams = httpParams.set('offset', params.offset.toString());

    return this.http.get<{ items: EnquiryItem[]; total: number }>(url, {
      params: httpParams,
      headers: this.auth.getAuthHeaders()
    });
  }

  updateEnquiryStatus(id: string, status: string, notes?: string): Observable<any> {
    const url = this.apiConfig.getApiUrl(`/enquiries/${id}/status`);
    return this.http.patch(
      url,
      { status, notes },
      { headers: this.auth.getAuthHeaders() }
    );
  }

  deleteEnquiry(id: string): Observable<any> {
    const url = this.apiConfig.getApiUrl(`/enquiries/${id}`);
    return this.http.delete(url, { headers: this.auth.getAuthHeaders() });
  }

  getVisitors(params?: {
    country?: string;
    deviceType?: string;
    source?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Observable<{ items: VisitorItem[]; total: number; totalVisits: number }> {
    const url = this.apiConfig.getApiUrl('/visitors');
    let httpParams = new HttpParams();
    if (params?.country) httpParams = httpParams.set('country', params.country);
    if (params?.deviceType) httpParams = httpParams.set('deviceType', params.deviceType);
    if (params?.source) httpParams = httpParams.set('source', params.source);
    if (params?.search) httpParams = httpParams.set('search', params.search);
    if (params?.limit) httpParams = httpParams.set('limit', params.limit.toString());
    if (params?.offset) httpParams = httpParams.set('offset', params.offset.toString());

    return this.http.get<{ items: VisitorItem[]; total: number; totalVisits: number }>(url, {
      params: httpParams,
      headers: this.auth.getAuthHeaders()
    });
  }

  getDownloads(params?: {
    country?: string;
    limit?: number;
    offset?: number;
  }): Observable<{ items: DownloadItem[]; total: number }> {
    const url = this.apiConfig.getApiUrl('/downloads');
    let httpParams = new HttpParams();
    if (params?.country) httpParams = httpParams.set('country', params.country);
    if (params?.limit) httpParams = httpParams.set('limit', params.limit.toString());
    if (params?.offset) httpParams = httpParams.set('offset', params.offset.toString());

    return this.http.get<{ items: DownloadItem[]; total: number }>(url, {
      params: httpParams,
      headers: this.auth.getAuthHeaders()
    });
  }
}
