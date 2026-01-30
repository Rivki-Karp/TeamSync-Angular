import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthActions } from './auth.actions';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private router = inject(Router);
  private authService = inject(AuthService);
  private platformId = inject(PLATFORM_ID);

  initAuth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.checkAuth),
      map(() => {
        if (isPlatformBrowser(this.platformId)) {
          const token = sessionStorage.getItem('token');
          const user = JSON.parse(sessionStorage.getItem('user') || 'null');
          if (token) {
            return AuthActions.loginSuccess({ token, user });
          }
        }
        return { type: '[Auth] No Session Token' };
      })
    )
  );

  persistToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess, AuthActions.signupSuccess),
      tap(({ token, user }) => {
        if (isPlatformBrowser(this.platformId)) {
          sessionStorage.setItem('token', token);
          sessionStorage.setItem('user', JSON.stringify(user));
        }
        this.router.navigate(['/dashboard']);
      })
    ), { dispatch: false }
  );

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginRequest),
      switchMap(({ email, password }) =>
        this.authService.login({ email, password }).pipe(
          map(res => AuthActions.loginSuccess({ token: res.token, user: res.user })),
          catchError(err => of(AuthActions.loginFailure({ error: err.error?.message || 'Login failed' })))
        )
      )
    )
  );

  signup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signupRequest),
      switchMap(action =>
        this.authService.register({ name: action.name, email: action.email, password: action.password }).pipe(
          map(res => AuthActions.signupSuccess({ token: res.token, user: res.user })),
          catchError(err => of(AuthActions.loginFailure({ error: err.error?.message || 'Signup failed' })))
        )
      )
    )
  );

logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      tap(() => {
        if (isPlatformBrowser(this.platformId)) {
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('user');
        }
        this.router.navigate(['/auth/login']);
      })
    ), { dispatch: false }
  );
}