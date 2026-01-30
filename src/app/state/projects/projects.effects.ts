import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ProjectsService } from '../../services/projects.service';
import { ProjectsActions } from './projects.actions';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class ProjectsEffects {
    private actions$ = inject(Actions);
    private projectsService = inject(ProjectsService);
    private snackBar = inject(MatSnackBar);
    loadProjects$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ProjectsActions.loadProjects),
            mergeMap(() =>
                this.projectsService.getProjects().pipe(
                    map((projects) => ProjectsActions.loadProjectsSuccess({ projects })),
                    catchError((error) => of(ProjectsActions.loadProjectsFailure({ error: error.message })))
                )
            )
        )
    );

    createProject$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ProjectsActions.createProject),
            mergeMap(({ project }) =>
                this.projectsService.createProject(project).pipe(
                    tap(() => this.snackBar.open('Project created!', 'Close', { duration: 2000 })),
                    map((newProject) => ProjectsActions.createProjectSuccess({ project: newProject })),
                    catchError((error) => of(ProjectsActions.createProjectFailure({ error: error.message })))
                )
            )
        )
    );

    updateProject$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ProjectsActions.updateProject),
            mergeMap(({ id, updates }) =>
                this.projectsService.updateProject(id, updates).pipe(
                    tap(() => this.snackBar.open('Project updated successfully! ✨', 'Close', { duration: 2000 })),
                    mergeMap((project) => [
                        ProjectsActions.updateProjectSuccess({ project }),
                        ProjectsActions.loadProjects()
                    ]),
                    catchError((error) => {
                        this.snackBar.open('Update failed', 'Close', { duration: 3000 });
                        return of(ProjectsActions.updateProjectFailure({ error: error.message }));
                    })
                )
            )
        )
    );

    deleteProject$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ProjectsActions.deleteProject),
            mergeMap(({ id }) =>
                this.projectsService.deleteProject(id).pipe(
                    tap(() => this.snackBar.open('Project deleted', 'Close', { duration: 2000 })),
                    map(() => ProjectsActions.deleteProjectSuccess({ id })),
                    catchError((error) => of(ProjectsActions.deleteProjectFailure({ error: error.message })))
                )
            )
        )
    );
}