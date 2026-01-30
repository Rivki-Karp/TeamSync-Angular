import { DashboardStats, TasksDistribution, Activity, TeamPerformance, TaskWithDeadline,QuickStats,DashboardFilters,LoadingState,ErrorState
} from '../../models/dashboard.model';

export interface DashboardState {
  stats: DashboardStats | null;
  tasksDistribution: TasksDistribution | null;
  recentActivity: Activity[];
  myTasks: Tasks[];
  upcomingDeadlines: TaskWithDeadline[];
  teamPerformance: TeamPerformance[];
  quickStats: QuickStats | null;

  filters: DashboardFilters;

  loading: LoadingState;

  errors: ErrorState;
  lastUpdated: Date | null;
  autoRefreshEnabled: boolean;
  refreshInterval: number; // seconds
}

export const initialDashboardState: DashboardState = {
  stats: null,
  tasksDistribution: null,
  recentActivity: [],
  myTasks: [],
  upcomingDeadlines: [],
  teamPerformance: [],
  quickStats: null,

  filters: {
    dateRange: {
      start: new Date(new Date().setDate(new Date().getDate() - 7)), // Last 7 days
      end: new Date(),
      preset: 'week'
    }
  },

  loading: {
    stats: false,
    tasks: false,
    activity: false,
    teams: false,
    projects: false
  },

  errors: {
    stats: null,
    tasks: null,
    activity: null,
    teams: null,
    projects: null
  },

  lastUpdated: null,
  autoRefreshEnabled: true,
  refreshInterval: 30 
};