import { createSelector, createFeatureSelector } from '@ngrx/store';
import { TasksState } from './tasks.reducer';

export const selectTasksState = createFeatureSelector<TasksState>('tasks');

export const selectAllTasks = createSelector(
    selectTasksState,
    (state) => state.tasks
);

export const selectTasksByStatus = (status: string) => createSelector(
    selectAllTasks,
    (tasks) => tasks.filter(task => task.status === status)
);

export const selectTasksLoading = createSelector(
  selectTasksState,
  (state) => state.isLoading
);