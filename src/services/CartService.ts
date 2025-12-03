import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Cart } from "../app/shared/type/cart";

@Injectable({providedIn: 'root'})
export class CartService {
    constructor(private http: HttpClient) {}
    getCarts(): Observable<Cart[]> {
        return this.http.get<any>('http://localhost:9999/cart').pipe()
    }
    addToCart(cart: Cart): Observable<Cart> {
        return this.http.post<any>(`http://localhost:9999/cart`, cart).pipe()
    }
    deleteCart(id: string): Observable<void> {
        return this.http.delete<void>(`http://localhost:9999/cart/${id}`).pipe()
    }
}
