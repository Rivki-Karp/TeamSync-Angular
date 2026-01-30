import { inject, Injectable, signal } from "@angular/core";
import { environment } from "../environment/environment";
import { HttpClient } from "@angular/common/http";
import { Observable, tap } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/users`;

  isLoading = signal<boolean>(false);

  getUsers(): Observable<User[]> {
    this.isLoading.set(true);
    return this.http.get<User[]>(this.apiUrl).pipe(
      tap(() => this.isLoading.set(false))
    );
  }
}