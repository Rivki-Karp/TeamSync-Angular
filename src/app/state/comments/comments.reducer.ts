import { createReducer, on } from '@ngrx/store';
import { CommentsActions } from './comments.actions';

export interface CommentsState {
  comments: Comment[];
  loading: boolean;
  error: string | null;
}

const initialState: CommentsState = {
  comments: [],
  loading: false,
  error: null
};

export const commentsReducer = createReducer(
  initialState,
  on(CommentsActions.loadComments, (state) => ({ ...state, loading: true })),
  on(CommentsActions.loadCommentsSuccess, (state, { comments }) => ({ 
    ...state, comments, loading: false 
  })),
  on(CommentsActions.addCommentSuccess, (state, { comment }) => ({
    ...state, comments: [...state.comments, comment]
  }))
);