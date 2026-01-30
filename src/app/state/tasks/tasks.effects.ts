import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TasksService } from '../../services/tasks.service';
import { TasksActions } from './tasks.actions';
import { catchError, map, switchMap, concatMap, tap, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class TasksEffects {
    private actions$ = inject(Actions);
    private tasksService = inject(TasksService);
    private snackBar = inject(MatSnackBar);

    loadTasks$ = createEffect(() =>
        this.actions$.pipe(
            ofType(TasksActions.loadTasks),
            switchMap(({ projectId }) =>
                this.tasksService.getTasksByProjectId(projectId.toString()).pipe(
                    map((tasks) => TasksActions.loadTasksSuccess({ tasks })),
                    catchError((error) => of(TasksActions.loadTasksFailure({ error: error.message })))
                )
            )
        )
    );

    createTask$ = createEffect(() =>
        this.actions$.pipe(
            ofType(TasksActions.createTask),
            concatMap(({ task }) =>
                this.tasksService.createTask(task).pipe(
                    map((newTask) => TasksActions.createTaskSuccess({ task: newTask })),
                    catchError((error) => of(TasksActions.createTaskFailure({ error: error.message })))
                )
            )
        )
    );

    updateTask$ = createEffect(() =>
        this.actions$.pipe(
            ofType(TasksActions.updateTask),
            concatMap(({ id, changes }) =>
                this.tasksService.updateTask(id.toString(), changes).pipe(
                    map((updatedTask) => TasksActions.updateTaskSuccess({ task: updatedTask })),
                    catchError((error) => of(TasksActions.updateTaskFailure({ error: error.message })))
                )
            )
        )
    );

    deleteTask$ = createEffect(() =>
        this.actions$.pipe(
            ofType(TasksActions.deleteTask),
            concatMap(({ id }) =>
                this.tasksService.deleteTask(id.toString()).pipe(
                    map(() => TasksActions.deleteTaskSuccess({ id })),
                    catchError((error) => of(TasksActions.deleteTaskFailure({ error: error.message })))
                )
            )
        )
    );

    showNotifications$ = createEffect(() =>
        this.actions$.pipe(
            ofType(
                TasksActions.createTaskSuccess, 
                TasksActions.deleteTaskSuccess,
                TasksActions.updateTaskFailure
            ),
            tap((action) => {
                const message = action.type.includes('Success') 
                    ? 'Operation completed!' 
                    : 'Something went wrong...';
                
                this.snackBar.open(message, 'Close', {
                    duration: 3000,
                    panelClass: action.type.includes('Success') ? ['success-snackbar'] : ['error-snackbar']
                });
            })
        ), { dispatch: false }
    );
}