import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DashboardState } from './dashboard.state';
import { StatCard, ChartDataItem } from '../../models/dashboard.model';

export const selectDashboardState = createFeatureSelector<DashboardState>('dashboard');
export const selectDashboardStats = createSelector(
  selectDashboardState,
  (state) => state.stats
);

export const selectTasksDistribution = createSelector(
  selectDashboardState,
  (state) => state.tasksDistribution
);

export const selectRecentActivity = createSelector(
  selectDashboardState,
  (state) => state.recentActivity
);

export const selectMyTasks = createSelector(
  selectDashboardState,
  (state) => state.myTasks
);

export const selectUpcomingDeadlines = createSelector(
  selectDashboardState,
  (state) => state.upcomingDeadlines
);

export const selectTeamPerformance = createSelector(
  selectDashboardState,
  (state) => state.teamPerformance
);

export const selectQuickStats = createSelector(
  selectDashboardState,
  (state) => state.quickStats
);

export const selectDashboardFilters = createSelector(
  selectDashboardState,
  (state) => state.filters
);

export const selectLastUpdated = createSelector(
  selectDashboardState,
  (state) => state.lastUpdated
);

export const selectAutoRefreshEnabled = createSelector(
  selectDashboardState,
  (state) => state.autoRefreshEnabled
);

export const selectRefreshInterval = createSelector(
  selectDashboardState,
  (state) => state.refreshInterval
);
export const selectDashboardLoading = createSelector(
  selectDashboardState,
  (state) => state.loading
);

export const selectIsStatsLoading = createSelector(
  selectDashboardLoading,
  (loading) => loading.stats
);

export const selectIsTasksLoading = createSelector(
  selectDashboardLoading,
  (loading) => loading.tasks
);

export const selectIsActivityLoading = createSelector(
  selectDashboardLoading,
  (loading) => loading.activity
);

export const selectIsTeamsLoading = createSelector(
  selectDashboardLoading,
  (loading) => loading.teams
);

export const selectIsProjectsLoading = createSelector(
  selectDashboardLoading,
  (loading) => loading.projects
);

export const selectIsAnyLoading = createSelector(
  selectDashboardLoading,
  (loading) => Object.values(loading).some(isLoading => isLoading)
);

export const selectDashboardErrors = createSelector(
  selectDashboardState,
  (state) => state.errors
);

export const selectHasAnyError = createSelector(
  selectDashboardErrors,
  (errors) => Object.values(errors).some(error => error !== null)
);

export const selectStatCards = createSelector(
  selectDashboardStats,
  (stats): StatCard[] => {
    if (!stats) return [];

    return [
      {
        icon: 'task_alt',
        title: 'Total Tasks',
        value: stats.totalTasks,
        change: stats.totalTasks > 0 ? '+12%' : '0%',
        trend: stats.totalTasks > 0 ? 'up' : 'neutral',
        color: '#3b82f6',
        subtitle: `${stats.tasksInProgress} in progress`
      },
      {
        icon: 'folder_open',
        title: 'Active Projects',
        value: stats.activeProjects,
        change: stats.activeProjects > 0 ? '+2' : '0',
        trend: stats.activeProjects > 0 ? 'up' : 'neutral',
        color: '#8b5cf6',
        subtitle: 'across all teams'
      },
      {
        icon: 'groups',
        title: 'Team Members',
        value: stats.teamMembers,
        change: stats.teamMembers > 0 ? '+5' : '0',
        trend: stats.teamMembers > 0 ? 'up' : 'neutral',
        color: '#10b981',
        subtitle: 'collaborating'
      },
      {
        icon: 'check_circle',
        title: 'Completed',
        value: stats.completedThisWeek,
        change: stats.completedThisWeek > 0 ? '+8%' : '0%',
        trend: stats.completedThisWeek > 0 ? 'up' : 'neutral',
        color: '#f59e0b',
        subtitle: 'this week'
      }
    ];
  }
);

export const selectTasksChartData = createSelector(
  selectTasksDistribution,
  (distribution): ChartDataItem[] => {
    if (!distribution) return [];

    return [
      {
        name: 'Backlog',
        value: distribution.todo,
        extra: { code: 'backlog' }
      },
      {
        name: 'In Progress',
        value: distribution.in_progress,
        extra: { code: 'in_progress' }
      },
      {
        name: 'Done',
        value: distribution.done,
        extra: { code: 'done' }
      }
    ];
  }
);

export const selectTotalTasksCount = createSelector(
  selectTasksDistribution,
  (distribution) => {
    if (!distribution) return 0;
    return distribution.todo +  distribution.in_progress + distribution.in_review +  distribution.done;}
);
export const selectCompletionPercentage = createSelector(
  selectTasksDistribution,
  selectTotalTasksCount,
  (distribution, total) => {
    if (!distribution || total === 0) return 0;
    return Math.round((distribution.done / total) * 100);
  }
);
export const selectMyPendingTasksCount = createSelector(
  selectMyTasks,
  (tasks) => tasks.filter(t => t.status !== 'Done').length
);

export const selectCriticalDeadlines = createSelector(
  selectUpcomingDeadlines,
  (deadlines) => deadlines.filter(d => d.urgencyLevel === 'critical')
);

export const selectTopPerformingTeam = createSelector(
  selectTeamPerformance,
  (teams) => {
    if (teams.length === 0) return null;
    return teams.reduce((top, current) => 
      current.completionRate > top.completionRate ? current : top
    );
  }
);

export const selectRecentActivityCount = createSelector(
  selectRecentActivity,
  (activities) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    return activities.filter(a => 
      new Date(a.timestamp) > yesterday
    ).length;
  }
);

export const selectHasDashboardData = createSelector(
  selectDashboardStats,
  selectTasksDistribution,
  (stats, distribution) => stats !== null && distribution !== null
);

export const selectDashboardSummary = createSelector(
  selectDashboardStats,
  selectMyPendingTasksCount,
  selectCriticalDeadlines,
  (stats, pendingCount, criticalDeadlines) => ({
    totalTasks: stats?.totalTasks || 0,
    myPendingTasks: pendingCount,
    criticalDeadlinesCount: criticalDeadlines.length,
    completedToday: stats?.completedToday || 0
  })
);

export const selectChartColorScheme = createSelector(
  selectDashboardState,
  () => ({
    domain: ['#94a3b8', '#3b82f6', '#f59e0b', '#10b981']
  })
);