import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const UsersActions = createActionGroup({
  source: 'Users',
  events: {
    'Load All Users': emptyProps(),
    'Load All Users Success': props<{ users: User[] }>(),
    'Load All Users Failure': props<{ error: string }>(),
  }
});