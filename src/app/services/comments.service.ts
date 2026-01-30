import { inject, Injectable, signal } from "@angular/core";
import { environment } from "../environment/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { finalize, Observable, tap } from "rxjs";

@Injectable({
    providedIn: 'root',
})

export class CommentsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/comments`;

  isLoading = signal<boolean>(false);

  getComments(taskId: string | number): Observable<Comment[]> {
    const params = new HttpParams().set('taskId', taskId.toString());
    return this.http.get<Comment[]>(this.apiUrl, { params });
  }

  createComment(comment: Partial<Comment>): Observable<Comment> {
    this.isLoading.set(true);
    return this.http.post<Comment>(this.apiUrl, comment).pipe(
      finalize(() => this.isLoading.set(false)) 
    );
  }

}