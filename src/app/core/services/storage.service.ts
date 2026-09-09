import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageService {
  get<T>(key: string): T | null {
    const value = globalThis.localStorage?.getItem(key);
    return value ? (JSON.parse(value) as T) : null;
  }

  set<T>(key: string, value: T): void {
    globalThis.localStorage?.setItem(key, JSON.stringify(value));
  }

  remove(key: string): void {
    globalThis.localStorage?.removeItem(key);
  }
}
