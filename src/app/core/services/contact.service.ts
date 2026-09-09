import { Injectable } from '@angular/core';
import { delay, map, Observable, of } from 'rxjs';
import { ContactRequest } from '../interfaces/portfolio.interfaces';

@Injectable({ providedIn: 'root' })
export class ContactService {
  sendMessage(request: ContactRequest): Observable<{ readonly success: true; readonly name: string }> {
    return of(request).pipe(
      delay(900),
      map(({ name }) => ({ success: true as const, name }))
    );
  }
}
