import { inject, Injectable, signal } from "@angular/core";
import { environment } from "../environment/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, tap } from "rxjs";

@Injectable({
    providedIn: 'root',
})

export class TasksService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/tasks`;

  isLoading = signal<boolean>(false);

  getTasks(): Observable<Tasks[]> {
    return this.http.get<Tasks[]>(this.apiUrl);
  }


  getTasksByProjectId(projectId: string): Observable<Tasks[]> {
    const params = new HttpParams().set('projectId', projectId);
    return this.http.get<Tasks[]>(this.apiUrl, { params });
  }


  createTask(task: Omit<Tasks, 'id'>): Observable<Tasks> {
    this.isLoading.set(true);
    return this.http.post<Tasks>(this.apiUrl, task).pipe(
      tap(() => this.isLoading.set(false))
    );
  }

  updateTask(id: string, updates: Partial<Tasks>): Observable<Tasks> {
    return this.http.patch<Tasks>(`${this.apiUrl}/${id}`, updates);
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}