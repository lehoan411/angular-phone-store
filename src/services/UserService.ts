import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { User } from "../app/shared/type/user";

@Injectable({providedIn: 'root'})
export class UserService {
    constructor(private http: HttpClient) {}
    getUsers(): Observable<User[]> {
        return this.http.get<any>('http://localhost:9999/users').pipe()
    }
    getUserById(id: string): Observable<User> {
        return this.http.get<any>(`http://localhost:9999/users/${id}`).pipe()
    }
    editUser(user: User): Observable<User> {
        return this.http.patch<any>(`http://localhost:9999/users/${user.id}`, user).pipe()
    }
    banUser(id: string): Observable<User> {
        return this.http.put<any>(`http://localhost:9999/users/${id}/ban`, {}).pipe()
    }
    register(user: User): Observable<User> {
        return this.http.post<any>(`http://localhost:9999/users`, user).pipe()
    }
}
