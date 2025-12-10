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
    imports: []
})

export class HeaderLayoutComponent {
    dropdownOpen = false;

    avatarUrl = '';
    role = '';
    constructor(private localStorage: LocalStorageService, private userService: UserService) { }
    ngOnInit(): void {
        const userData = this.localStorage.getItem('token');
        if (userData) {
            const userId = JSON.parse(atob(userData)).id;
            this.userService.getUserById(userId).subscribe(user => {
                this.avatarUrl = user.avatar || '';
                this.role = user.role || '';
            });
        }
        
    }

    get isLoggedIn() {
        return Boolean(this.localStorage.getItem('token'));
    }

    toggleDropdown() {
        this.dropdownOpen = !this.dropdownOpen;
    }

    handleLogout() {
        if (this.role === 'admin') {
            this.localStorage.removeItem('token');
            window.location.href = '/login';
        } else {
            this.localStorage.removeItem('token');
            window.location.href = '/';
        }
    }

    routerAdmin() {
        if (this.role === 'admin') {
            window.location.href = '/admin/manage-user';
        } else {
            window.location.href = '/';
        }
    }


}