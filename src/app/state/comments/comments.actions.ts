import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const CommentsActions = createActionGroup({
  source: 'Comments API',
  events: {
    'Load Comments': props<{ taskId: number }>(),
    'Load Comments Success': props<{ comments: Comment[] }>(),
    'Load Comments Failure': props<{ error: string }>(),
    
    'Add Comment': props<{ comment: Partial<Comment> }>(),
    'Add Comment Success': props<{ comment: Comment }>(),
    'Add Comment Failure': props<{ error: string }>(),
  }
});