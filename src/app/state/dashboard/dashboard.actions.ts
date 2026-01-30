import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
    DashboardStats, TasksDistribution, Activity, TeamPerformance, TaskWithDeadline, QuickStats, DashboardFilters
} from '../../models/dashboard.model';

export const DashboardActions = createActionGroup({
    source: 'Dashboard',
    events: {
        'Load Dashboard Data': emptyProps(),
        'Load Dashboard Data Success': props<{
            stats: DashboardStats;
            tasksDistribution: TasksDistribution;
            recentActivity: Activity[];
            myTasks: Tasks[];
            upcomingDeadlines: TaskWithDeadline[];
            teamPerformance: TeamPerformance[];
            quickStats: QuickStats;
        }>(),
        'Load Dashboard Data Failure': props<{ error: string }>(),

        'Load Stats': emptyProps(),
        'Load Stats Success': props<{ stats: DashboardStats }>(),
        'Load Stats Failure': props<{ error: string }>(),

        'Load Tasks Distribution': emptyProps(),
        'Load Tasks Distribution Success': props<{ distribution: TasksDistribution }>(),
        'Load Tasks Distribution Failure': props<{ error: string }>(),

        'Load Recent Activity': emptyProps(),
        'Load Recent Activity Success': props<{ activities: Activity[] }>(),
        'Load Recent Activity Failure': props<{ error: string }>(),

        'Load My Tasks': emptyProps(),
        'Load My Tasks Success': props<{ tasks: Tasks[] }>(),
        'Load My Tasks Failure': props<{ error: string }>(),

        'Refresh Dashboard': emptyProps(),
        'Refresh Stats Only': emptyProps(),
        'Update Last Refresh Time': props<{ timestamp: Date }>(),
        'Update Filters': props<{ filters: Partial<DashboardFilters> }>(),
        'Reset Filters': emptyProps(),
        'Set Date Range': props<{ start: Date; end: Date; preset: string }>(),
        'Filter By Team': props<{ teamId: string }>(),
        'Filter By Project': props<{ projectId: string }>(),

        'Toggle Auto Refresh': props<{ enabled: boolean }>(),
        'Set Refresh Interval': props<{ seconds: number }>(),

        'Mark Task Complete From Dashboard': props<{ taskId: string }>(),
        'Mark Task Complete Success': props<{ taskId: string }>(),
        'Mark Task Complete Failure': props<{ error: string }>(),

        'Reset Dashboard': emptyProps(),
        'Clear Errors': emptyProps(),

        'Load Upcoming Deadlines': emptyProps(),
        'Load Upcoming Deadlines Success': props<{ deadlines: TaskWithDeadline[] }>(),
        'Load Upcoming Deadlines Failure': props<{ error: string }>(),
        'Load Team Performance': emptyProps(),
        'Load Team Performance Success': props<{ performance: TeamPerformance[] }>(),
        'Load Team Performance Failure': props<{ error: string }>(),
        'Load Quick Stats': emptyProps(),
        'Load Quick Stats Success': props<{ quickStats: QuickStats }>(),
        'Load Quick Stats Failure': props<{ error: string }>(),
    }
});