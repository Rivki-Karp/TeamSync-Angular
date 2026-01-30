import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectToken } from '../state/auth/auth.selectors';
import { first, switchMap } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store);

  const isAuthPath = req.url.includes('/login') || req.url.includes('/register');

  if (isAuthPath) {
    return next(req);
  }

  return store.select(selectToken).pipe(
    first(),
    switchMap(token => {
      if (token) {
        const authReq = req.clone({
          setHeaders: { Authorization: `Bearer ${token}` }
        });
        return next(authReq);
      }
      return next(req);
    })
  );
};