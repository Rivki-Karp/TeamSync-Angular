import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { environment } from "../environment/environment";
import { finalize, Observable, tap } from "rxjs";

@Injectable({
  providedIn: 'root',
})

export class TeamsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/teams`;

  isLoading = signal<boolean>(false);

  getTeams(): Observable<Teams[]> {
    return this.http.get<Teams[]>(this.apiUrl);
  }

  createTeam(team: Omit<Teams, 'id'>): Observable<Teams> {
    this.isLoading.set(true);
    return this.http.post<Teams>(this.apiUrl, team).pipe(
      tap(() => this.isLoading.set(false))
    );
  }

  createMemberInTeam(member: MemberInTeam, teamId: number): Observable<Teams> {
    this.isLoading.set(true);
    return this.http.post<Teams>(`${this.apiUrl}/${teamId}/members`, member).pipe(
      tap(() => this.isLoading.set(false))
    );
  }

  deleteTeam(teamId: string | number): Observable<void> {
    this.isLoading.set(true);
    return this.http.delete<void>(`${this.apiUrl}/${teamId}`).pipe(
      finalize(() => this.isLoading.set(false))
    );
  }

  getTeamMembers(teamId: string | number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${teamId}/members`);
  }

  removeMemberFromTeam(teamId: string | number, userId: string | number): Observable<void> {
    this.isLoading.set(true);
    return this.http.delete<void>(`${this.apiUrl}/${teamId}/members/${userId}`).pipe(
      finalize(() => this.isLoading.set(false))
    );
  }
}