import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { LocalStorageService } from '../storage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {

  constructor(
    private router: Router,
    private localStorageService: LocalStorageService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  canActivate(): boolean {

    if (!isPlatformBrowser(this.platformId)) {
      return true;
    }

    const token = this.localStorageService.getItem('token');
    // console.log('UserGuard token:', token);

    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    try {
 
      const payload = JSON.parse(atob(token));

      // console.log('UserGuard payload:', payload);

      if (payload.role !== 'user') {
        this.router.navigate(['/admin']);
        return false;
      }

      return true;

    } catch (e) {
      console.error('Invalid token in UserGuard:', e);
      this.router.navigate(['/login']);
      return false;
    }
  }
}
