import { Component, inject } from '@angular/core';
import { Injectable } from '@angular/core';
import { LocalStorageService } from '../storage/local-storage.service';
import { UserService } from '../../../services/UserService';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
@Component({
    selector: 'footer-layout',
    standalone: true,
    templateUrl: './footer-layout.component.html',
    styleUrls: ['./footer-layout.component.css'],
})

export class FooterLayoutComponent {
    role ='';
    constructor( private localStorage: LocalStorageService) { }
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
        window.location.href = '/';
    }


}