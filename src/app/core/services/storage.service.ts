import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageService {
  get<T>(key: string): T | null {
    try {
      const value = globalThis.localStorage?.getItem(key);
      if (!value) return null;
      try {
        return JSON.parse(value) as T;
      } catch {
        // Fallback for raw string values stored without JSON encoding
        return value as unknown as T;
      }
    } catch {
      return null;
    }
  }

  set<T>(key: string, value: T): void {
    try {
      globalThis.localStorage?.setItem(key, JSON.stringify(value));
    } catch {
      // Gracefully handle storage quota or access restriction exceptions
    }
  }

  remove(key: string): void {
    try {
      globalThis.localStorage?.removeItem(key);
    } catch {
      // Gracefully handle storage removal exceptions
    }
  }
}
