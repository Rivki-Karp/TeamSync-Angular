import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [

  {
    path: '',
    loadComponent: () => import('./components/landing-page/landing-page').then(m => m.LandingPage),
    pathMatch: 'full'
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./components/login/login').then(m => m.Login)
      },
      {
        path: 'signup',
        loadComponent: () => import('./components/sign-up/sign-up').then(m => m.Signup)
      },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },
  // Protected Routes
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./components/dashboard/dashboard').then(m => m.Dashboard)
      },
      {
        path: 'teams',
        loadComponent: () => import('./components/teams/teams').then(m => m.TeamsComponent)
      },
      {
        path: 'projects',
        loadComponent: () => import('./components/projects/projects').then(m => m.Projects)
      },
      {
        path: 'projects/:id/tasks',
        loadComponent: () => import('./components/tasks/tasks').then(m => m.Tasks)
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'auth/login' }
];