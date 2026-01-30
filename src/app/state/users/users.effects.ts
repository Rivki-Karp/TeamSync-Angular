import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UsersService } from '../../services/users.service';
import { catchError, map, mergeMap, of } from 'rxjs';
import { UsersActions } from './users.action';

@Injectable()
export class UsersEffects {
  private actions$ = inject(Actions);
  private usersService = inject(UsersService);

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.loadAllUsers),
      mergeMap(() =>
        this.usersService.getUsers().pipe(
          map((users) => UsersActions.loadAllUsersSuccess({ users })),
          catchError((error) => of(UsersActions.loadAllUsersFailure({ error: error.message })))
        )
      )
    )
  );
}