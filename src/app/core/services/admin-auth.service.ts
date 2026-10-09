import { Injectable, computed, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { ApiConfigService } from './api-config.service';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class AdminAuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly apiConfig = inject(ApiConfigService);
  private readonly platformId = inject(PLATFORM_ID);

  private readonly tokenKey = 'portfolio_admin_jwt_token';
  private readonly userKey = 'portfolio_admin_user_data';

  readonly token = signal<string | null>(null);
  readonly currentUser = signal<AdminUser | null>(null);
  readonly isAuthenticated = computed(() => !!this.token());

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const storedToken = localStorage.getItem(this.tokenKey);
        const storedUser = localStorage.getItem(this.userKey);
        if (storedToken) {
          this.token.set(storedToken);
          if (storedUser) {
            this.currentUser.set(JSON.parse(storedUser));
          }
        }
      } catch (e) {}
    }
  }

  login(email: string, password: string): Observable<{ success: boolean; token: string; user: AdminUser }> {
    const url = this.apiConfig.getApiUrl('/auth/login');
    return this.http.post<{ success: boolean; token: string; user: AdminUser }>(url, { email, password }).pipe(
      tap((res) => {
        if (res.token) {
          this.token.set(res.token);
          this.currentUser.set(res.user);
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem(this.tokenKey, res.token);
            localStorage.setItem(this.userKey, JSON.stringify(res.user));
          }
        }
      })
    );
  }

  logout() {
    this.token.set(null);
    this.currentUser.set(null);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userKey);
    }
    this.router.navigate(['/admin/login']);
  }

  getAuthHeaders(): { [header: string]: string } {
    const t = this.token();
    return t ? { Authorization: `Bearer ${t}` } : {};
  }
}
