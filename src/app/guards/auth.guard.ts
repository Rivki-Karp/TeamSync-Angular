import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectToken } from '../state/auth/auth.selectors';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectToken).pipe(
    take(1),
    map(token => {
      if (token) {
        return true;
      }

      return router.createUrlTree(['/auth/login']);
    })
  );
};