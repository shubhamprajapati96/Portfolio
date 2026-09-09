import { DOCUMENT } from '@angular/common';
import { inject, Injectable, signal } from '@angular/core';
import { StorageService } from './storage.service';

export type ThemeMode = 'dark' | 'light';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly storage = inject(StorageService);
  readonly mode = signal<ThemeMode>(this.storage.get<ThemeMode>('theme') ?? 'dark');

  constructor() {
    this.applyTheme(this.mode());
  }

  toggle(): void {
    this.setTheme(this.mode() === 'dark' ? 'light' : 'dark');
  }

  setTheme(mode: ThemeMode): void {
    this.mode.set(mode);
    this.storage.set('theme', mode);
    this.applyTheme(mode);
  }

  private applyTheme(mode: ThemeMode): void {
    this.document.documentElement.dataset['theme'] = mode;
  }
}
