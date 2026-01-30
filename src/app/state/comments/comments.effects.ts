import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CommentsService } from '../../services/comments.service';
import { CommentsActions } from './comments.actions';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class CommentsEffects {
  private actions$ = inject(Actions);
  private commentsService = inject(CommentsService);
  private snackBar = inject(MatSnackBar); 

  loadComments$ = createEffect(() => this.actions$.pipe(
    ofType(CommentsActions.loadComments),
    mergeMap(({ taskId }) => this.commentsService.getComments(taskId).pipe(
      map(comments => CommentsActions.loadCommentsSuccess({ comments })),
      catchError(error => of(CommentsActions.loadCommentsFailure({ error: error.message })))
    ))
  ));

  addComment$ = createEffect(() => this.actions$.pipe(
    ofType(CommentsActions.addComment),
    mergeMap(({ comment }) => this.commentsService.createComment(comment).pipe(
      map(newComment => CommentsActions.addCommentSuccess({ comment: newComment })),
      catchError(error => of(CommentsActions.addCommentFailure({ error: error.message })))
    ))
  ));

  showSuccessMessage$ = createEffect(() => this.actions$.pipe(
    ofType(CommentsActions.addCommentSuccess),
    tap(() => {
      this.snackBar.open('the comment added scussfully !', 'close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });
    })
  ), { dispatch: false });

  showErrorMessage$ = createEffect(() => this.actions$.pipe(
    ofType(CommentsActions.addCommentFailure, CommentsActions.loadCommentsFailure),
    tap(({ error }) => {
      this.snackBar.open(`error : ${error}`, 'close', {
        duration: 5000,
        panelClass: ['error-snackbar'] 
      });
    })
  ), { dispatch: false });
}