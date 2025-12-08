import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Comment } from "../app/shared/type/comment";

@Injectable({providedIn: 'root'})
export class CommentService {
    constructor(private http: HttpClient) {}
    getCommentsByProduct(productId: string): Observable<Comment[]> {
        return this.http.get<any>(`http://localhost:9999/comments?product=${productId}`).pipe()
    }
    addComment(comment: Comment): Observable<Comment> {
        return this.http.post<any>(`http://localhost:9999/comments`, comment).pipe()
    }
    editComment(comment: Comment): Observable<Comment> {
        return this.http.put<any>(`http://localhost:9999/comments/${comment.id}`, comment).pipe()
    }
    deleteComment(id: string): Observable<void> {
        return this.http.delete<void>(`http://localhost:9999/comments/${id}`).pipe()
    }
}
