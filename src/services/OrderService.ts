import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Order } from "../app/shared/type/order";

@Injectable({providedIn: 'root'})
export class OrderService {
    constructor(private http: HttpClient) {}
    getOrders(): Observable<Order[]> {
        return this.http.get<any>('http://localhost:9999/orders').pipe()
    }
    addOrder(order: Order): Observable<Order> {
        return this.http.post<any>(`http://localhost:9999/orders`, order).pipe()
    }
    editOrder(order: Order): Observable<Order> {
        return this.http.put<any>(`http://localhost:9999/orders/${order.id}`, order).pipe()
    }
    deleteOrder(id: string): Observable<void> {
        return this.http.delete<void>(`http://localhost:9999/orders/${id}`).pipe()
    }
}
