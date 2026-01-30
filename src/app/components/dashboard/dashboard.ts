import { Component, signal, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop'; 
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DashboardActions } from '../../state/dashboard/dashboard.actions';
import { 
  selectStatCards, selectTasksDistribution, selectRecentActivity, 
  selectMyTasks, selectUpcomingDeadlines, selectIsAnyLoading } from '../../state/dashboard/dashboard.selectors';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatIconModule, MatButtonModule], 
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  private store = inject(Store);
  isRefreshing = signal(false);

  stats = toSignal(this.store.select(selectStatCards));
  distribution = toSignal(this.store.select(selectTasksDistribution));
  activities = toSignal(this.store.select(selectRecentActivity));
  tasks = toSignal(this.store.select(selectMyTasks));
  deadlines = toSignal(this.store.select(selectUpcomingDeadlines));
  isLoading = toSignal(this.store.select(selectIsAnyLoading));

  constructor() {
    this.store.dispatch(DashboardActions.loadDashboardData());
  }

  refreshDashboard() {
    this.isRefreshing.set(true);
    this.store.dispatch(DashboardActions.refreshDashboard());
    setTimeout(() => this.isRefreshing.set(false), 1000);
  }
}