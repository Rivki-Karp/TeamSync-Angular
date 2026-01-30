import { createReducer, on } from '@ngrx/store';
import { AuthActions } from './auth.actions';

export const initialState: AuthState = {
  token: null,
  user: null,
  error: null,
  isLoading: false,
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.loginRequest, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),

  on(AuthActions.loginSuccess, (state, { token, user }) => ({
    ...state,
    token,
    user,
    isLoading: false,
    error: null
  })),

  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    error,
    isLoading: false
  })),

  on(AuthActions.logout, () => initialState),
  on(AuthActions.signupSuccess, (state, { token, user }) => ({
    ...state,
    token,
    user,
    isLoading: false,
    error: null
  })),

  on(AuthActions.signupRequest, (state) => ({
    ...state,
    isLoading: true,
    error: null
  }))
);