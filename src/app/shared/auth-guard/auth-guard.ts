import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../services/UserService';
import { LocalStorageService } from '../storage/local-storage.service';
import { map, catchError, of } from 'rxjs';

export const authStatusGuard = () => {

  const router = inject(Router);
  const userService = inject(UserService);
  const localStorageService = inject(LocalStorageService);

  const userRaw = localStorageService.getItem('token');
  const userId = JSON.parse(userRaw ? atob(userRaw) : '{}').id;
  console.log(userRaw);
  console.log('User ID:', userId);

  if (!userId) {
    router.navigate(['/login']);
    return of(false);
  }

 

  return userService.getUserById(userId).pipe(
    map(user => {
      if (user.status === 'banned') {
        alert('Your account has been banned. Please contact support.');
        router.navigate(['/login']);
        return false;
      }
      return true;
    }),
    catchError(() => {
      router.navigate(['/login']);
      return of(false);
    })
  );
};
