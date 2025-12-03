import { Component, inject } from '@angular/core';
import { Injectable } from '@angular/core';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { UserService } from './../../../services/UserService';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
@Component({
    selector: 'header-layout',
    standalone: true,
    templateUrl: './header-layout.component.html',
    styleUrls: ['./header-layout.component.css']
})

export class HeaderLayoutComponent {
    role: string = '';

    constructor(private localStorage: LocalStorageService, private userService: UserService, private router: Router) { }
    ngOnInit(): void {
  const userString = this.localStorage.getItem('user');
  console.log("User String: ", userString);

  if (!userString) {
    console.warn("No user in localStorage, skipping API call");
    return; 
  }

  const userId = Number(userString);

  this.userService.getUserById(userId).subscribe({
    next: (user: any) => {
      this.role = user.role;
      console.log("User Role from Service: ", user.role);
    },
    error: (err) => {
      console.error("Cannot load user:", err);
    }
  });

  console.log("Role: ", this.role);
}

    get isLoggedIn() {
        return Boolean(this.localStorage.getItem('user'));
    }

    handleLogout() {
        this.localStorage.removeItem('user');
        this.router.navigate(['/']);
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }


}