import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthUserGuard implements CanActivate {

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  canActivate(): boolean {

    // SSR → allow (không check)
    if (!isPlatformBrowser(this.platformId)) {
      return true;
    }

    // Lấy token ở browser
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    // ⚠️ Decode đúng JWT
    let payload: any;
    try {
      payload = JSON.parse(atob(token.split('.')[1]));
      console.log(payload)
    } catch (e) {
      this.router.navigate(['/login']);
      return false;
    }

    const userRole = payload?.role;

    // User → vào được
    if (userRole === 'user') return true;

    // Admin → đẩy về admin
    if (userRole === 'admin') {
      this.router.navigate(['/admin']);
      return false;
    }

    // Không xác định → login
    this.router.navigate(['/login']);
    return false;
  }
}
