import { createReducer, on } from '@ngrx/store';
import { UsersActions } from './users.action';

export interface UsersState {
  users: User[];
  isLoading: boolean;
  error: string | null;
}

export const initialState: UsersState = {
  users: [],
  isLoading: false,
  error: null,
};

export const usersReducer = createReducer(
  initialState,
  on(UsersActions.loadAllUsers, (state) => ({ ...state, isLoading: true, error: null })),
  on(UsersActions.loadAllUsersSuccess, (state, { users }) => ({ 
    ...state, 
    users, 
    isLoading: false 
  })),
  on(UsersActions.loadAllUsersFailure, (state, { error }) => ({ 
    ...state, 
    error, 
    isLoading: false 
  }))
);