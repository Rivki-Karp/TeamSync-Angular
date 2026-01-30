import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, map, mergeMap, of, tap, forkJoin, withLatestFrom, switchMap, debounceTime } from 'rxjs';
import { DashboardActions } from './dashboard.actions';
import { DashboardService } from '../../services/dashboard.service';
import { TeamsService } from '../../services/teams.service';
import { ProjectsService } from '../../services/projects.service';
import { TasksService } from '../../services/tasks.service';
import { UsersService } from '../../services/users.service';
import { CommentsService } from '../../services/comments.service';
import { selectCurrentUser } from '../auth/auth.selectors'; 

@Injectable()
export class DashboardEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private snackBar = inject(MatSnackBar);
  private dashboardService = inject(DashboardService);

  private teamsService = inject(TeamsService);
  private projectsService = inject(ProjectsService);
  private tasksService = inject(TasksService);
  private usersService = inject(UsersService);
  private commentsService = inject(CommentsService);

  loadDashboardData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.loadDashboardData),
      withLatestFrom(this.store.select(selectCurrentUser)),
      switchMap(([_, currentUser]) =>
        forkJoin({
          teams: this.teamsService.getTeams(),
          projects: this.projectsService.getProjects(),
          tasks: this.tasksService.getTasks(),
          users: this.usersService.getUsers(),
          // Get comments for all tasks - you may need to adjust this based on your API
          comments: of([]) // Placeholder - adjust based on your API
        }).pipe(
          map(({ teams, projects, tasks, users, comments }) => {
            // Calculate all dashboard data
            const stats = this.dashboardService.calculateStats(tasks, projects, teams);
            const tasksDistribution = this.dashboardService.getTasksDistribution(tasks); // Fixed method name
            const recentActivity = this.dashboardService.generateRecentActivity(
              tasks, 
              comments, 
              users, 
              projects
            );
            const myTasks = currentUser 
              ? this.dashboardService.getMyTasks(tasks, currentUser.id)
              : [];
            const upcomingDeadlines = this.dashboardService.getUpcomingDeadlines(
              tasks,
              projects,
              users
            );
            const teamPerformance = this.dashboardService.calculateTeamPerformance(
              teams,
              projects,
              tasks
            );
            const quickStats = this.dashboardService.calculateQuickStats(tasks, teams);

            return DashboardActions.loadDashboardDataSuccess({
              stats,
              tasksDistribution,
              recentActivity,
              myTasks,
              upcomingDeadlines,
              teamPerformance,
              quickStats
            });
          }),
          catchError(error => {
            this.snackBar.open('Failed to load dashboard data', 'Close', {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
            return of(DashboardActions.loadDashboardDataFailure({ 
              error: error.message 
            }));
          })
        )
      )
    )
  );

  loadStats$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.loadStats),
      switchMap(() =>
        forkJoin({
          teams: this.teamsService.getTeams(),
          projects: this.projectsService.getProjects(),
          tasks: this.tasksService.getTasks()
        }).pipe(
          map(({ teams, projects, tasks }) => {
            const stats = this.dashboardService.calculateStats(tasks, projects, teams);
            return DashboardActions.loadStatsSuccess({ stats });
          }),
          catchError(error => 
            of(DashboardActions.loadStatsFailure({ error: error.message }))
          )
        )
      )
    )
  );

  loadTasksDistribution$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.loadTasksDistribution),
      switchMap(() =>
        this.tasksService.getTasks().pipe(
          map(tasks => {
            const distribution = this.dashboardService.getTasksDistribution(tasks); // Fixed method name
            return DashboardActions.loadTasksDistributionSuccess({ distribution });
          }),
          catchError(error =>
            of(DashboardActions.loadTasksDistributionFailure({ error: error.message }))
          )
        )
      )
    )
  );

  loadRecentActivity$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.loadRecentActivity),
      switchMap(() =>
        forkJoin({
          tasks: this.tasksService.getTasks(),
          comments: of([]), 
          users: this.usersService.getUsers(),
          projects: this.projectsService.getProjects()
        }).pipe(
          map(({ tasks, comments, users, projects }) => {
            const activities = this.dashboardService.generateRecentActivity(
              tasks,
              comments,
              users,
              projects
            );
            return DashboardActions.loadRecentActivitySuccess({ activities });
          }),
          catchError(error =>
            of(DashboardActions.loadRecentActivityFailure({ error: error.message }))
          )
        )
      )
    )
  );

  loadMyTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.loadMyTasks),
      withLatestFrom(this.store.select(selectCurrentUser)),
      switchMap(([_, currentUser]) => {
        if (!currentUser) {
          return of(DashboardActions.loadMyTasksSuccess({ tasks: [] }));
        }

        return this.tasksService.getTasks().pipe(
          map(tasks => {
            const myTasks = this.dashboardService.getMyTasks(tasks, currentUser.id);
            return DashboardActions.loadMyTasksSuccess({ tasks: myTasks });
          }),
          catchError(error =>
            of(DashboardActions.loadMyTasksFailure({ error: error.message }))
          )
        );
      })
    )
  );

  loadUpcomingDeadlines$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.loadUpcomingDeadlines),
      switchMap(() =>
        forkJoin({
          tasks: this.tasksService.getTasks(),
          projects: this.projectsService.getProjects(),
          users: this.usersService.getUsers()
        }).pipe(
          map(({ tasks, projects, users }) => {
            const deadlines = this.dashboardService.getUpcomingDeadlines(
              tasks,
              projects,
              users
            );
            return DashboardActions.loadUpcomingDeadlinesSuccess({ deadlines });
          }),
          catchError(error =>
            of(DashboardActions.loadUpcomingDeadlinesFailure({ error: error.message }))
          )
        )
      )
    )
  );

  loadTeamPerformance$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.loadTeamPerformance),
      switchMap(() =>
        forkJoin({
          teams: this.teamsService.getTeams(),
          projects: this.projectsService.getProjects(),
          tasks: this.tasksService.getTasks()
        }).pipe(
          map(({ teams, projects, tasks }) => {
            const performance = this.dashboardService.calculateTeamPerformance(
              teams,
              projects,
              tasks
            );
            return DashboardActions.loadTeamPerformanceSuccess({ performance });
          }),
          catchError(error =>
            of(DashboardActions.loadTeamPerformanceFailure({ error: error.message }))
          )
        )
      )
    )
  );

  loadQuickStats$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.loadQuickStats),
      switchMap(() =>
        forkJoin({
          tasks: this.tasksService.getTasks(),
          teams: this.teamsService.getTeams()
        }).pipe(
          map(({ tasks, teams }) => {
            const quickStats = this.dashboardService.calculateQuickStats(tasks, teams);
            return DashboardActions.loadQuickStatsSuccess({ quickStats });
          }),
          catchError(error =>
            of(DashboardActions.loadQuickStatsFailure({ error: error.message }))
          )
        )
      )
    )
  );

  refreshDashboard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.refreshDashboard),
      map(() => DashboardActions.loadDashboardData())
    )
  );
  
  refreshStatsOnly$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.refreshStatsOnly),
      map(() => DashboardActions.loadStats())
    )
  );

  updateRefreshTime$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.loadDashboardDataSuccess),
      map(() => DashboardActions.updateLastRefreshTime({ timestamp: new Date() }))
    )
  );

  reloadOnFilterChange$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        DashboardActions.updateFilters,
        DashboardActions.setDateRange,
        DashboardActions.filterByTeam,
        DashboardActions.filterByProject
      ),
      debounceTime(300),
      map(() => DashboardActions.loadDashboardData())
    )
  );

  markTaskComplete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.markTaskCompleteFromDashboard),
      mergeMap(({ taskId }) =>
        this.tasksService.updateTask(taskId, { status: 'Done' }).pipe( // Fixed: 'done' -> 'Done'
          tap(() => {
            this.snackBar.open('Task marked as complete! ✨', 'Close', {
              duration: 2000,
              panelClass: ['success-snackbar']
            });
          }),
          mergeMap(() => [
            DashboardActions.markTaskCompleteSuccess({ taskId }),
            DashboardActions.refreshStatsOnly()
          ]),
          catchError(error => {
            this.snackBar.open('Failed to update task', 'Close', {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
            return of(DashboardActions.markTaskCompleteFailure({ 
              error: error.message 
            }));
          })
        )
      )
    )
  );

  showErrorNotification$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          DashboardActions.loadDashboardDataFailure,
          DashboardActions.loadStatsFailure,
          DashboardActions.loadTasksDistributionFailure,
          DashboardActions.loadRecentActivityFailure,
          DashboardActions.loadMyTasksFailure,
          DashboardActions.loadUpcomingDeadlinesFailure,
          DashboardActions.loadTeamPerformanceFailure
        ),
        tap(({ error }) => {
          console.error('Dashboard Error:', error);
        })
      ),
    { dispatch: false }
  );
}