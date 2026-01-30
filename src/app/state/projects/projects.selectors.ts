import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProjectsState } from './projects.reducer';

export const selectProjectsState = createFeatureSelector<ProjectsState>('projects');

export const selectAllProjects = createSelector(
  selectProjectsState,
  (state) => state.projects
);

export const selectProjectsLoading = createSelector(
  selectProjectsState,
  (state) => state.isLoading
);

export const selectProjectsError = createSelector(
  selectProjectsState,
  (state) => state.error
);

export const selectProjectById = (projectId: string | number) => createSelector(
  selectAllProjects,
  (projects) => projects.find(p => p.id === projectId)
);