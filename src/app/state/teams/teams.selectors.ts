import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TeamsState } from './teams.reducer';

export const selectTeamsState = createFeatureSelector<TeamsState>('teams');

export const selectAllTeams = createSelector(
  selectTeamsState,
  (state) => state.teams
);

export const selectCurrentTeamMembers = createSelector(
    selectTeamsState,
    (state) => state.currentTeamMembers
);

export const selectTeamsLoading = createSelector(
  selectTeamsState,
  (state) => state.loading
);

export const selectTeamsError = createSelector(
  selectTeamsState,
  (state) => state.error
);