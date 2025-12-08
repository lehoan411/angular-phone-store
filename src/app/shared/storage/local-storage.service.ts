import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor(@Inject(PLATFORM_ID) private platformId: any) {}

  private get storage(): Storage | null {
    return isPlatformBrowser(this.platformId) ? localStorage : null;
  }

  getItem(key: string): string | null {
    const item = this.storage ? this.storage.getItem(key) : null;
    
    return item;
  }

  setItem(key: string, value: string): void {
    if (this.storage) this.storage.setItem(key, value);
  }

  removeItem(key: string): void {
    if (this.storage) this.storage.removeItem(key);
  }

  clear(): void {
    if (this.storage) this.storage.clear();
  }
}