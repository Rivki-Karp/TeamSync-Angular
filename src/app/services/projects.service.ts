import { inject, Injectable, signal } from "@angular/core";
import { environment } from "../environment/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { finalize, map, Observable, tap } from "rxjs";

@Injectable({
  providedIn: 'root',
})

export class ProjectsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/projects`;

  isLoading = signal<boolean>(false);

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiUrl);
  }

  createProject(projectData: PostProject): Observable<Project> {
    this.isLoading.set(true);
    return this.http.post<Project>(this.apiUrl, projectData).pipe(
      tap(() => this.isLoading.set(false))
    );
  }

  updateProject(id: string | number, projectData: Partial<Project>): Observable<Project> {
    this.isLoading.set(true);
    return this.http.patch<Project>(`${this.apiUrl}/${id}`, projectData).pipe(
      finalize(() => this.isLoading.set(false))
    );
  }

  deleteProject(id: string | number): Observable<void> {
    this.isLoading.set(true);
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      finalize(() => this.isLoading.set(false))
    );
  }

}