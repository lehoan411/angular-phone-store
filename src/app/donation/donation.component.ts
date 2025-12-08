import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalStorageService } from '../shared/storage/local-storage.service';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'donation-root',
    standalone: true,
    imports: [ReactiveFormsModule],
    templateUrl: './donation.component.html',
    styleUrls: ['./donation.component.css', '../app.css']
})
export class DonationComponent {

    donation = new FormGroup({
        amount: new FormControl('', Validators.required),
        message: new FormControl('')
    });

    constructor(
        private localStorageService: LocalStorageService,
        private http: HttpClient,
        private router: Router
    ) {}

    get amount() { return this.donation.get('amount'); }
    get message() { return this.donation.get('message'); }

    handleDonate() {
        if (this.donation.invalid) return;

        const token = this.localStorageService.getItem('token');
        const headers: any = {};

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        this.http.post(
            'https://0a0dd153179c.ngrok-free.app/create-payment-link',
            {
                amount: Number(this.amount?.value),
                message: this.message?.value || ''
            },
            { headers }
        ).subscribe({
            next: (res: any) => {
                if (res.url) {
                    window.location.href = res.url; 
                }
            },
            error: err => {
                console.error('Payment link error:', err);
            }
        });
    }
}