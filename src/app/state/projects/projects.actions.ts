import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const ProjectsActions = createActionGroup({
    source: 'Projects',
    events: {
        'Load Projects': emptyProps(),
        'Load Projects Success': props<{ projects: Project[] }>(),
        'Load Projects Failure': props<{ error: string }>(),

        'Create Project': props<{ project: PostProject }>(),
        'Create Project Success': props<{ project: Project }>(),
        'Create Project Failure': props<{ error: string }>(),
    
        'Update Project': props<{ id: string | number; updates: Partial<Project> }>(),
        'Update Project Success': props<{ project: Project }>(),
        'Update Project Failure': props<{ error: string }>(),

        'Delete Project': props<{ id: string | number }>(),
        'Delete Project Success': props<{ id: string | number }>(),
        'Delete Project Failure': props<{ error: string }>(),
    }
});