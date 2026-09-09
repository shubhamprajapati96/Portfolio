export class StorageHelper {
  static isAvailable(): boolean {
    return typeof globalThis.localStorage !== 'undefined';
  }
}
