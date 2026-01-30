import { createAction, props } from '@ngrx/store';

export const AuthActions = {

  checkAuth: createAction('[Auth] Check Auth'),
  
  loginRequest: createAction(
    '[Auth] Login Request',
    props<{ email: string; password: string }>()
  ),
  signupRequest: createAction(
    '[Auth] Signup Request',
    props<{ name: string; email: string; password: string }>()
  ),
  loginSuccess: createAction(
    '[Auth] Login Success',
    props<{ token: string; user: any }>()
  ),
  signupSuccess: createAction(
    '[Auth] Signup Success',
    props<{ token: string; user: any }>()
  ),
  loginFailure: createAction(
    '[Auth] Login Failure',
    props<{ error: string }>()
  ),
  logout: createAction('[Auth] Logout'),
};