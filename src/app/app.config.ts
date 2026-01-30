import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { AuthEffects } from './state/auth/auth.effects';
import { authReducer } from './state/auth/auth.reducer';
import { authInterceptor } from './interceptors/auth-interceptor';
import { teamsReducer } from './state/teams/teams.reducer';
import { TeamsEffects } from './state/teams/teams.effects';
import { projectsReducer } from './state/projects/projects.reducer';
import { ProjectsEffects } from './state/projects/projects.effects';
import { tasksReducer } from './state/tasks/tasks.reducer';
import { TasksEffects } from './state/tasks/tasks.effects';
import { commentsReducer } from './state/comments/comments.reducer';
import { CommentsEffects } from './state/comments/comments.effects';
import { usersReducer } from './state/users/users.reducer';
import { UsersEffects } from './state/users/users.effects';
import { dashboardReducer } from './state/dashboard/dashboard.reducers';
import { DashboardEffects } from './state/dashboard/dashboard.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes), provideClientHydration(withEventReplay()),
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor])
    ),
    provideStore({
      auth: authReducer,
      teams: teamsReducer,
      projects: projectsReducer,
      tasks:tasksReducer,
      comments:commentsReducer,
      users: usersReducer,
      dashboard:dashboardReducer
    }),
    provideEffects([AuthEffects, TeamsEffects, ProjectsEffects,TasksEffects,CommentsEffects,UsersEffects,DashboardEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: false })
  ]
};
