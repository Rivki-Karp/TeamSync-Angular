import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TeamsService } from '../../services/teams.service';
import { TeamsActions } from './teams.actions';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class TeamsEffects {
  private actions$ = inject(Actions);
  private teamsService = inject(TeamsService);
  private readonly snackBar = inject(MatSnackBar);

  loadTeams$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TeamsActions.loadTeams),
      mergeMap(() =>
        this.teamsService.getTeams().pipe(
          map((teams) => TeamsActions.loadTeamsSuccess({ teams })),
          catchError((error) => of(TeamsActions.loadTeamsFailure({ error: error.message })))
        )
      )
    )
  );

  createTeam$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TeamsActions.createTeam),
      mergeMap((action) =>
        this.teamsService.createTeam({
          name: action.name,
          description: action.description,
          created_at: '', 
          members_count: 0
        }).pipe(
          map(() => TeamsActions.loadTeams()), 
          catchError((error) => of(TeamsActions.createTeamFailure({ error: error.message })))
        )
      )
    )
  );

  deleteTeam$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TeamsActions.deleteTeam),
      mergeMap(({ id }) =>
        this.teamsService.deleteTeam(id).pipe(
          tap(() => this.snackBar.open('Team deleted successfully', 'Close', { duration: 3000 })),
          map(() => TeamsActions.deleteTeamSuccess({ id })),
          catchError((error) => of(TeamsActions.deleteTeamFailure({ error: error.message })))
        )
      )
    )
  );

  loadTeamMembers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TeamsActions.loadTeamMembers),
      mergeMap(({ teamId }) =>
        this.teamsService.getTeamMembers(teamId).pipe(
          map((members) => TeamsActions.loadTeamMembersSuccess({ members })),
          catchError((error) => of(TeamsActions.loadTeamMembersFailure({ error: error.message })))
        )
      )
    )
  );

 addMember$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TeamsActions.addMember),
      mergeMap(({ teamId, member }) =>
        this.teamsService.createMemberInTeam(member, teamId).pipe(
          tap(() => this.snackBar.open('Member added successfully! ', 'Close', { 
            duration: 3000,
            panelClass: ['success-snackbar'] 
          })),
          
          mergeMap(() => [
            TeamsActions.loadTeams(),
            TeamsActions.loadTeamMembers({ teamId }) 
          ]),
          catchError((error) => {
            this.snackBar.open(`Error: ${error.message || 'Could not add member'}`, 'Close', { duration: 5000 });
            return of(TeamsActions.addMemberFailure({ error: error.message }));
          })
        )
      )
    )
  );

  removeMember$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TeamsActions.removeMember),
      mergeMap(({ teamId, userId }) =>
        this.teamsService.removeMemberFromTeam(teamId, userId).pipe(
          tap(() => this.snackBar.open('Member removed', 'Close', { duration: 3000 })),
          mergeMap(() => [
            TeamsActions.removeMemberSuccess({ teamId, userId }),
            TeamsActions.loadTeams()
          ]),
          catchError((error) => {
            this.snackBar.open('Failed to remove member', 'Close', { duration: 5000 });
            return of(TeamsActions.removeMemberFailure({ error: error.message }));
          })
        )
      )
    )
  );
}