import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
    Router, Resolve,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';
import { Donation } from '../shared/type/donation';
import { DonationService } from '../../services/DonationService';
import { LocalStorageService } from '../shared/storage/local-storage.service';
import { User } from '../shared/type/user';







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
        message: new FormControl(''),
    })
    get amount() {
        return this.donation.get('amount');
    }
    get message() {
        return this.donation.get('message');
    }
    constructor(private localStorageService: LocalStorageService, private donationService: DonationService, private router: Router) {
    }

    handleCreatePayment() {
        if (this.amount?.hasError('required')) return;
        const amountValue = Number(this.amount?.value) || 0;
        window.location.href = `/create-payment-link`;
    }


    handleDonate() {
        const userData = this.localStorageService.getItem('token');
        if (this.amount?.hasError('required') || this.message?.hasError('required')) return;
        const donation = {
            id: Math.random().toString(36).substring(2, 9),
            user: userData ? JSON.parse(atob(userData)).id : 'guest',
            amount: Number(this.amount?.value) || 0,
            message: String(this.message?.value) || '',
            date: new Date().toISOString()
        }
        this.donationService.postDonation(donation).subscribe((res: any) => {
           
        });
    }
}
