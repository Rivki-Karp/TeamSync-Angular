import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const TasksActions = createActionGroup({
    source: 'Tasks',
    events: {
        
        'Load Tasks': props<{ projectId: number }>(),
        'Load Tasks Success': props<{ tasks: Tasks[] }>(),
        'Load Tasks Failure': props<{ error: string }>(),

        'Create Task': props<{ task: PostTask }>(),
        'Create Task Success': props<{ task: Tasks }>(),
        'Create Task Failure': props<{ error: string }>(),

        'Update Task': props<{ id: number, changes: Partial<Tasks> }>(),
        'Update Task Success': props<{ task: Tasks }>(),
        'Update Task Failure': props<{ error: string }>(),

        'Delete Task': props<{ id: number }>(),
        'Delete Task Success': props<{ id: number }>(),
        'Delete Task Failure': props<{ error: string }>(),
    }
});