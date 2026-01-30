import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { DashboardStats, TasksDistribution, Activity, TeamPerformance, TaskWithDeadline, QuickStats, ActivityType } from '../models/dashboard.model';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {

    calculateStats(tasks: Tasks[], projects: Project[], teams: Teams[]): DashboardStats {
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const completedThisWeek = tasks.filter(t =>
            t.status === 'Done' &&
            t.updated_at &&
            new Date(t.updated_at) >= weekAgo
        ).length;

        const completedToday = tasks.filter(t =>
            t.status === 'Done' &&
            t.updated_at &&
            new Date(t.updated_at) >= today
        ).length;

        const tasksInProgress = tasks.filter(t => t.status === 'In Progress').length;

        const overdueTasksCount = tasks.filter(t =>
            t.dueDate &&
            new Date(t.dueDate) < now &&
            t.status !== 'Done'
        ).length;

        const completedTasks = tasks.filter(t => t.status === 'Done').length;

        return {
            totalTasks: tasks.length,
            completedTasks,
            tasksInProgress,
            overdueTasksCount,
            projectsCount: projects.length,
            teamsCount: teams.length,
            activeProjects: projects.length,
            teamMembers: teams.reduce((sum, team) => sum + (team.members_count || 0), 0),
            upcomingDeadlinesCount: tasks.filter(t => t.dueDate && new Date(t.dueDate) > now).length,
            completionRate: tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0,
            completedThisWeek,
            completedToday
        };
    }

    getTasksDistribution(tasks: Tasks[]): TasksDistribution {
        return {
            todo: tasks.filter(t => t.status === 'Backlog').length,
            backlog: tasks.filter(t => t.status === 'Backlog').length,
            in_progress: tasks.filter(t => t.status === 'In Progress').length,
            inProgress: tasks.filter(t => t.status === 'In Progress').length,
            in_review: 0, // Add if you have this status
            done: tasks.filter(t => t.status === 'Done').length
        };
    }

    generateRecentActivity(tasks: Tasks[], comments: Comment[], users: User[], projects: Project[]): Activity[] {
        const activities: Activity[] = [];
        const recentTasks = [...tasks]
            .sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime())
            .slice(0, 15);

        recentTasks.forEach(task => {
            const user = users.find(u => u.id === task.assigneeId);
            const project = projects.find(p => p.id === task.projectId);

            if (task.status === 'Done') {
                activities.push({
                    id: `task-completed-${task.id}`,
                    type: 'task_completed' as ActivityType,
                    icon: 'check_circle',
                    color: '#10b981',
                    title: 'Task completed',
                    description: `"${task.title}"`,
                    user: {
                        id: user?.id || 0,
                        name: user?.name || 'Unknown',
                        avatar: undefined
                    },
                    timestamp: task.updated_at || new Date().toISOString(),
                    relativeTime: this.getRelativeTime(new Date(task.updated_at || new Date())),
                    metadata: {
                        projectName: project?.name,
                        taskTitle: task.title,
                        priority: task.priority
                    }
                });
            } else {
                activities.push({
                    id: `task-created-${task.id}`,
                    type: 'task_created' as ActivityType,
                    icon: 'add_circle',
                    color: '#3b82f6',
                    title: 'New task created',
                    description: `"${task.title}"`,
                    user: {
                        id: user?.id || 0,
                        name: user?.name || 'Unknown'
                    },
                    timestamp: task.created_at || new Date().toISOString(),
                    relativeTime: this.getRelativeTime(new Date(task.created_at || new Date())),
                    metadata: {
                        projectName: project?.name,
                        taskTitle: task.title,
                        priority: task.priority
                    }
                });
            }
        });

        const recentComments = [...comments]
            .sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime())
            .slice(0, 10);

        recentComments.forEach(comment => {
            const user = users.find(u => u.id === comment.userId);
            const task = tasks.find(t => t.id === comment.taskId);

            activities.push({
                id: `comment-${comment.id}`,
                type: 'comment_added' as ActivityType,
                icon: 'chat_bubble',
                color: '#8b5cf6',
                title: 'New comment',
                description: `On task "${task?.title || 'Unknown'}"`,
                user: {
                    id: user?.id || 0,
                    name: user?.name || 'Unknown'
                },
                timestamp: comment.createdAt || new Date().toISOString(),
                relativeTime: this.getRelativeTime(new Date(comment.createdAt || new Date())),
                metadata: {
                    taskTitle: task?.title
                }
            });
        });

        return activities
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, 10);
    }

    getUpcomingDeadlines(tasks: Tasks[], projects: Project[], users: User[]): TaskWithDeadline[] {
        const now = new Date();
        const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

        return tasks
            .filter(t =>
                t.dueDate &&
                new Date(t.dueDate) <= sevenDaysLater &&
                t.status !== 'Done'
            )
            .map(task => {
                const project = projects.find(p => p.id === task.projectId);
                const assignee = users.find(u => u.id === task.assigneeId);
                const dueDate = new Date(task.dueDate!);
                const daysLeft = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

                let urgencyLevel: 'critical' | 'warning' | 'normal';
                if (daysLeft <= 1) urgencyLevel = 'critical';
                else if (daysLeft <= 3) urgencyLevel = 'warning';
                else urgencyLevel = 'normal';

                return {
                    id: task.id,
                    title: task.title,
                    description: task.description,
                    project: {
                        id: project?.id || 0,
                        name: project?.name || 'Unknown Project'
                    },
                    deadline: task.dueDate!,
                    daysLeft,
                    priority: task.priority,
                    status: task.status.toLowerCase() as any, // Convert to lowercase
                    assignee: assignee ? {
                        id: assignee.id,
                        name: assignee.name
                    } : undefined,
                    urgencyLevel
                };
            })
            .sort((a, b) => a.daysLeft - b.daysLeft);
    }

    calculateTeamPerformance(teams: Teams[], projects: Project[], tasks: Tasks[]): TeamPerformance[] {
        return teams.map(team => {
            const teamProjects = projects.filter(p => p.team_id === team.id); // Fixed: teamId -> team_id
            const teamProjectIds = teamProjects.map(p => p.id);

            const teamTasks = tasks.filter(t => teamProjectIds.includes(t.projectId));
            const completedTasks = teamTasks.filter(t => t.status === 'Done').length;
            const inProgressTasks = teamTasks.filter(t => t.status === 'In Progress').length;

            const completionRate = teamTasks.length > 0 ? Math.round((completedTasks / teamTasks.length) * 100) : 0;

            let trend: 'improving' | 'stable' | 'declining';
            if (completionRate >= 75) trend = 'improving';
            else if (completionRate >= 50) trend = 'stable';
            else trend = 'declining';

            const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            const recentActivity = teamTasks.filter(t =>
                t.created_at && new Date(t.created_at) >= weekAgo
            ).length;

            return {
                teamId: team.id,
                teamName: team.name,
                totalTasks: teamTasks.length,
                completedTasks,
                inProgressTasks,
                completionRate,
                memberCount: team.members_count || 0, // Fixed: membersCount -> members_count
                activeProjects: teamProjects.length,
                trend,
                color: this.getTeamColor(team.id),
                recentActivity
            };
        }).sort((a, b) => b.completionRate - a.completionRate);
    }

    calculateQuickStats(tasks: Tasks[], teams: Teams[]): QuickStats {
        const now = new Date();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        const todayCompleted = tasks.filter(t =>
            t.status === 'Done' &&
            t.updated_at &&
            new Date(t.updated_at) >= today
        ).length;

        const weekCompleted = tasks.filter(t =>
            t.status === 'Done' &&
            t.updated_at &&
            new Date(t.updated_at) >= weekAgo
        ).length;

        const monthCompleted = tasks.filter(t =>
            t.status === 'Done' &&
            t.updated_at &&
            new Date(t.updated_at) >= monthAgo
        ).length;

        return {
            todayCompleted,
            weekCompleted,
            monthCompleted,
            avgTasksPerDay: monthCompleted > 0 ? Math.round(monthCompleted / 30) : 0,
            mostActiveTeam: teams.length > 0 ? teams[0].name : 'N/A',
            mostProductiveDay: 'Monday'
        };
    }

    getMyTasks(tasks: Tasks[], currentUserId: number): Tasks[] {
        return tasks
            .filter(t => t.assigneeId === currentUserId && t.status !== 'Done')
            .sort((a, b) => {
                const priorityOrder = { high: 1, medium: 2, low: 3 };
                const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] ?? 99;
                const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] ?? 99;

                if (aPriority !== bPriority) {
                    return aPriority - bPriority;
                }
                return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
            })
            .slice(0, 10);
    }

    private getRelativeTime(date: Date): string {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        return 'Just now';
    }

    private getTeamColor(teamId: number): string {
        const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];
        return colors[teamId % colors.length];
    }
}