import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CommentsState } from './comments.reducer';

export const selectCommentsState = createFeatureSelector<CommentsState>('comments');

export const selectAllComments = createSelector(
  selectCommentsState,
  (state) => state.comments
);

export const selectCommentsLoading = createSelector(
  selectCommentsState,
  (state) => state.loading
);