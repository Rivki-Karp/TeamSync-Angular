export interface DashboardData {
  stats: DashboardStats;
  tasksDistribution: TasksDistribution;
  recentActivity: Activity[];
  myTasks: Tasks[];
  upcomingDeadlines: TaskWithDeadline[];
  teamPerformance: TeamPerformance[];
  quickStats: QuickStats;
}

export interface DashboardStats {
  totalTasks: number;
  activeProjects: number;
  teamMembers: number;
  completedThisWeek: number;
  completedToday: number;
  completedTasks: number; // Added
  tasksInProgress: number;
  overdueTasksCount: number;
  projectsCount: number; // Added
  teamsCount: number; // Added
  upcomingDeadlinesCount: number; // Added
  completionRate: number; // Added (renamed from avgCompletionRate)
}

export interface StatCard {
  icon: string;
  title: string;
  value: number;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  color: string;
  subtitle?: string;
}

export interface TasksDistribution {
  todo: number;
  in_progress: number;
  in_review: number;
  done: number;
  backlog: number; // Added to match usage
  inProgress: number; // Added to match usage
}

export interface ChartDataItem {
  name: string;
  value: number;
  extra?: {
    code: string;
  };
}

export interface Activity {
  id: string | number;
  type: ActivityType;
  icon: string;
  color: string;
  title: string;
  description: string;
  user: {
    id: number;
    name: string;
    avatar?: string;
  };
  timestamp: Date | string;
  relativeTime: string;
  metadata?: {
    projectName?: string;
    teamName?: string;
    taskTitle?: string;
    priority?: TaskPriority;
  };
}

export type ActivityType = 
  | 'task_created'
  | 'task_completed'
  | 'task_updated'
  | 'task_deleted'
  | 'comment_added'
  | 'project_created'
  | 'team_member_added'
  | 'status_changed'
  | 'priority_changed';

export interface TaskWithDeadline {
  id: number;
  title: string;
  description?: string;
  project: {
    id: number;
    name: string;
  };
  deadline: Date | string;
  daysLeft: number;
  priority: TaskPriority;
  status: TaskStatus;
  assignee?: {
    id: number;
    name: string;
  };
  urgencyLevel: 'critical' | 'warning' | 'normal';
}

export interface TeamPerformance {
  teamId: number;
  teamName: string;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  completionRate: number;
  memberCount: number;
  activeProjects: number;
  trend: 'improving' | 'stable' | 'declining';
  color: string;
  recentActivity: number; 
}
export interface QuickStats {
  todayCompleted: number;
  weekCompleted: number;
  monthCompleted: number;
  avgTasksPerDay: number;
  mostActiveTeam: string;
  mostProductiveDay: string;
}

export interface DashboardFilters {
  dateRange: DateRange;
  teamId?: number;
  projectId?: number;
  status?: TaskStatus;
  priority?: TaskPriority;
}

export interface DateRange {
  start: Date;
  end: Date;
  preset?: 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom';
}

export type TaskStatus = 'backlog' | 'in_progress' | 'done' | 'Backlog' | 'In Progress' | 'Done';

export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

export interface WidgetConfig {
  id: string;
  title: string;
  icon: string;
  enabled: boolean;
  order: number;
  size: 'small' | 'medium' | 'large' | 'full';
  refreshInterval?: number;
}

export interface LoadingState {
  stats: boolean;
  tasks: boolean;
  activity: boolean;
  teams: boolean;
  projects: boolean;
}

export interface ErrorState {
  stats?: string | null;
  tasks?: string | null;
  activity?: string | null;
  teams?: string | null;
  projects?: string | null;
}

export interface QuickAction {
  id: string;
  icon: string;
  label: string;
  color: string;
  action: QuickActionType;
  gradient?: string;
}

export type QuickActionType = 
  | 'create_task'
  | 'create_project'
  | 'add_team_member'
  | 'view_reports'
  | 'export_data';

export type TimePeriod = 'day' | 'week' | 'month' | 'quarter' | 'year';

export interface TrendData {
  current: number;
  previous: number;
  change: number;
  changePercent: number;
  trend: 'up' | 'down' | 'neutral';
}

export interface ChartColorScheme {
  domain: string[];
}

export interface AnimationConfig {
  enabled: boolean;
  duration: number;
  easing: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
}