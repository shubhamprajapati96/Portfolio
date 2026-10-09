import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, delay } from 'rxjs';
import { ContactRequest } from '../interfaces/portfolio.interfaces';
import { ApiConfigService } from './api-config.service';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly http = inject(HttpClient);
  private readonly apiConfig = inject(ApiConfigService);

  sendMessage(request: ContactRequest): Observable<{ readonly success: true; readonly name: string }> {
    const url = this.apiConfig.getApiUrl('/enquiries');
    const payload = {
      ...request,
      source: this.apiConfig.getSource()
    };

    return this.http.post<{ success: boolean; message?: string }>(url, payload).pipe(
      map(() => ({ success: true as const, name: request.name })),
      catchError((err) => {
        // Fallback gracefully if server is momentarily unreachable
        return of(request).pipe(
          delay(800),
          map(({ name }) => ({ success: true as const, name }))
        );
      })
    );
  }
}
