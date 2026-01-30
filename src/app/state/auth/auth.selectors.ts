import { createSelector, createFeatureSelector } from '@ngrx/store';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectToken = createSelector(
  selectAuthState,
  (state) => state.token
);

export const selectIsLoggedIn = createSelector(
  selectToken,
  (token) => !!token
);

export const selectIsLoading = createSelector(
  selectAuthState,
  (state) => state.isLoading
);

export const selectAuthError = createSelector(
  selectAuthState,
  (state) => state.error
);
export const selectCurrentUser = createSelector(
  selectAuthState,
  (state) => state?.user
);