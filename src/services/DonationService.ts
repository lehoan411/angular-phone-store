import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Donation } from "../app/shared/type/donation";

@Injectable({providedIn: 'root'})
export class DonationService {
    constructor(private http: HttpClient) {}
    getDonations(): Observable<Donation[]> {
        return this.http.get<any>('http://localhost:9999/donations').pipe();
    }
    detailDonation(id: string): Observable<Donation> {
        return this.http.get<any>(`http://localhost:9999/donations/${id}`).pipe()
    }
    postDonation(donation: Donation): Observable<Donation> {
        return this.http.post<any>(`http://localhost:9999/donations`, donation).pipe()
    }
}
