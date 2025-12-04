import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ProductItem } from "../app/shared/type/productItem";

@Injectable({providedIn: 'root'})
export class ProductService {
    constructor(private http: HttpClient) {}
    getProducts(): Observable<ProductItem[]> {
        return this.http.get<any>('http://localhost:9999/products').pipe();
    }
    detailProduct(id: string): Observable<ProductItem> {
        return this.http.get<any>(`http://localhost:9999/products/${id}`).pipe()
    }
    postProduct(productItem: ProductItem): Observable<ProductItem> {
        return this.http.post<any>(`http://localhost:9999/products`, productItem).pipe()
    }
    editProduct(productItem: ProductItem): Observable<ProductItem> {
        return this.http.put<any>(`http://localhost:9999/products/${productItem.id}`, productItem).pipe()
    }
    deleteProduct(id: string): Observable<ProductItem> {
        return this.http.delete<any>(`http://localhost:9999/products/${id}`).pipe()
    }
}
