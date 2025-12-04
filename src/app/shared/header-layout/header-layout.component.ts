import { Component, inject } from '@angular/core';
import { Injectable } from '@angular/core';
import { LocalStorageService } from '../storage/local-storage.service';
import { UserService } from './../../../services/UserService';
import { Router, RouterLink } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
@Component({
    selector: 'header-layout',
    standalone: true,
    templateUrl: './header-layout.component.html',
    styleUrls: ['./header-layout.component.css'],
    imports: [RouterLink]
})

export class HeaderLayoutComponent {
    role ='';
    constructor( private localStorage: LocalStorageService, private userService: UserService, private router: Router) { }
    ngOnInit(): void {
        const userData = this.localStorage.getItem('user');        if (userData) {
            const user = JSON.parse(userData);
            this.role = user.role;
        } else {
            this.role = '';
        }
    }
   

    get isLoggedIn() {
        return Boolean(this.localStorage.getItem('user'));
    }

    handleLogout() {
        this.localStorage.removeItem('user');
        this.router.navigate(['/']);
        setTimeout(() => {
            window.location.reload();
        }, 500);
    }


}