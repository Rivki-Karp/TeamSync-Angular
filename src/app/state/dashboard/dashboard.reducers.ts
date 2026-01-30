import { createReducer, on } from '@ngrx/store';
import { DashboardActions } from './dashboard.actions';
import { DashboardState, initialDashboardState } from './dashboard.state';

export const dashboardReducer = createReducer(
  initialDashboardState,

  on(DashboardActions.loadDashboardData, (state) => ({
    ...state,
    loading: {
      stats: true,
      tasks: true,
      activity: true,
      teams: true,
      projects: true
    },
    errors: {
      stats: null,
      tasks: null,
      activity: null,
      teams: null,
      projects: null
    }
  })),

  on(DashboardActions.loadDashboardDataSuccess, (state, { 
    stats, 
    tasksDistribution, 
    recentActivity, 
    myTasks, 
    upcomingDeadlines, 
    teamPerformance,
    quickStats 
  }) => ({
    ...state,
    stats,
    tasksDistribution,
    recentActivity,
    myTasks,
    upcomingDeadlines,
    teamPerformance,
    quickStats,
    loading: {
      stats: false,
      tasks: false,
      activity: false,
      teams: false,
      projects: false
    },
    lastUpdated: new Date()
  })),

  on(DashboardActions.loadDashboardDataFailure, (state, { error }) => ({
    ...state,
    loading: {
      stats: false,
      tasks: false,
      activity: false,
      teams: false,
      projects: false
    },
    errors: {
      stats: error,
      tasks: error,
      activity: error,
      teams: error,
      projects: error
    }
  })),

  on(DashboardActions.loadStats, (state) => ({
    ...state,
    loading: { ...state.loading, stats: true },
    errors: { ...state.errors, stats: null }
  })),

  on(DashboardActions.loadStatsSuccess, (state, { stats }) => ({
    ...state,
    stats,
    loading: { ...state.loading, stats: false }
  })),

  on(DashboardActions.loadStatsFailure, (state, { error }) => ({
    ...state,
    loading: { ...state.loading, stats: false },
    errors: { ...state.errors, stats: error }
  })),

  on(DashboardActions.loadTasksDistribution, (state) => ({
    ...state,
    loading: { ...state.loading, tasks: true },
    errors: { ...state.errors, tasks: null }
  })),

  on(DashboardActions.loadTasksDistributionSuccess, (state, { distribution }) => ({
    ...state,
    tasksDistribution: distribution,
    loading: { ...state.loading, tasks: false }
  })),

  on(DashboardActions.loadTasksDistributionFailure, (state, { error }) => ({
    ...state,
    loading: { ...state.loading, tasks: false },
    errors: { ...state.errors, tasks: error }
  })),

  on(DashboardActions.loadRecentActivity, (state) => ({
    ...state,
    loading: { ...state.loading, activity: true },
    errors: { ...state.errors, activity: null }
  })),

  on(DashboardActions.loadRecentActivitySuccess, (state, { activities }) => ({
    ...state,
    recentActivity: activities,
    loading: { ...state.loading, activity: false }
  })),

  on(DashboardActions.loadRecentActivityFailure, (state, { error }) => ({
    ...state,
    loading: { ...state.loading, activity: false },
    errors: { ...state.errors, activity: error }
  })),

  on(DashboardActions.loadMyTasks, (state) => ({
    ...state,
    loading: { ...state.loading, tasks: true },
    errors: { ...state.errors, tasks: null }
  })),

  on(DashboardActions.loadMyTasksSuccess, (state, { tasks }) => ({
    ...state,
    myTasks: tasks,
    loading: { ...state.loading, tasks: false }
  })),

  on(DashboardActions.loadMyTasksFailure, (state, { error }) => ({
    ...state,
    loading: { ...state.loading, tasks: false },
    errors: { ...state.errors, tasks: error }
  })),

  on(DashboardActions.loadUpcomingDeadlines, (state) => ({
    ...state,
    loading: { ...state.loading, tasks: true },
    errors: { ...state.errors, tasks: null }
  })),

  on(DashboardActions.loadUpcomingDeadlinesSuccess, (state, { deadlines }) => ({
    ...state,
    upcomingDeadlines: deadlines,
    loading: { ...state.loading, tasks: false }
  })),

  on(DashboardActions.loadUpcomingDeadlinesFailure, (state, { error }) => ({
    ...state,
    loading: { ...state.loading, tasks: false },
    errors: { ...state.errors, tasks: error }
  })),

  on(DashboardActions.loadTeamPerformance, (state) => ({
    ...state,
    loading: { ...state.loading, teams: true },
    errors: { ...state.errors, teams: null }
  })),

  on(DashboardActions.loadTeamPerformanceSuccess, (state, { performance }) => ({
    ...state,
    teamPerformance: performance,
    loading: { ...state.loading, teams: false }
  })),

  on(DashboardActions.loadTeamPerformanceFailure, (state, { error }) => ({
    ...state,
    loading: { ...state.loading, teams: false },
    errors: { ...state.errors, teams: error }
  })),

  on(DashboardActions.loadQuickStats, (state) => ({
    ...state,
    loading: { ...state.loading, stats: true }
  })),

  on(DashboardActions.loadQuickStatsSuccess, (state, { quickStats }) => ({
    ...state,
    quickStats,
    loading: { ...state.loading, stats: false }
  })),

  on(DashboardActions.loadQuickStatsFailure, (state, { error }) => ({
    ...state,
    loading: { ...state.loading, stats: false },
    errors: { ...state.errors, stats: error }
  })),

  on(DashboardActions.refreshDashboard, (state) => ({
    ...state,
    loading: {
      stats: true,
      tasks: true,
      activity: true,
      teams: true,
      projects: true
    }
  })),

  on(DashboardActions.updateLastRefreshTime, (state, { timestamp }) => ({
    ...state,
    lastUpdated: timestamp
  })),

  on(DashboardActions.updateFilters, (state, { filters }) => ({
    ...state,
    filters: {
      ...state.filters,
      ...filters
    }
  })),

  on(DashboardActions.resetFilters, (state) => ({
    ...state,
    filters: initialDashboardState.filters
  })),

  on(DashboardActions.setDateRange, (state, { start, end, preset }) => ({
    ...state,
    filters: {
      ...state.filters,
      dateRange: { 
        start, 
        end, 
        preset: preset as 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom' // Type cast
      }
    }
  })),

  on(DashboardActions.filterByTeam, (state, { teamId }) => ({
    ...state,
    filters: {
      ...state.filters,
      teamId: Number(teamId) // Convert string to number
    }
  })),

  on(DashboardActions.filterByProject, (state, { projectId }) => ({
    ...state,
    filters: {
      ...state.filters,
      projectId: Number(projectId) // Convert string to number
    }
  })),

  on(DashboardActions.toggleAutoRefresh, (state, { enabled }) => ({
    ...state,
    autoRefreshEnabled: enabled
  })),

  on(DashboardActions.setRefreshInterval, (state, { seconds }) => ({
    ...state,
    refreshInterval: seconds
  })),

  on(DashboardActions.markTaskCompleteFromDashboard, (state) => ({
    ...state,
    loading: { ...state.loading, tasks: true }
  })),

  on(DashboardActions.markTaskCompleteSuccess, (state, { taskId }) => ({
    ...state,
    myTasks: state.myTasks.map(task =>
      task.id === Number(taskId) 
        ? { ...task, status: 'Done' as const, updated_at: new Date().toISOString() } // Fixed: status 'done' -> 'Done', completed_at -> updated_at
        : task
    ),
    loading: { ...state.loading, tasks: false }
  })),

  on(DashboardActions.markTaskCompleteFailure, (state, { error }) => ({
    ...state,
    loading: { ...state.loading, tasks: false },
    errors: { ...state.errors, tasks: error }
  })),

  on(DashboardActions.resetDashboard, () => initialDashboardState),

  on(DashboardActions.clearErrors, (state) => ({
    ...state,
    errors: {
      stats: null,
      tasks: null,
      activity: null,
      teams: null,
      projects: null
    }
  }))
);