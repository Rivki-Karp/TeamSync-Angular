import { createActionGroup, emptyProps, props } from '@ngrx/store';


export const TeamsActions = createActionGroup({
  source: 'Teams',
  events: {
    'Load Teams': emptyProps(),
    'Load Teams Success': props<{ teams: Teams[] }>(),
    'Load Teams Failure': props<{ error: string }>(),

    'Create Team': props<{ name: string; description?: string }>(),
    'Create Team Success': props<{ team: Teams }>(),
    'Create Team Failure': props<{ error: string }>(),

    'Delete Team': props<{ id: number | string }>(),
    'Delete Team Success': props<{ id: number | string }>(),
    'Delete Team Failure': props<{ error: string }>(),

    'Load Team Members': props<{ teamId: number | string }>(),
    'Load Team Members Success': props<{ members: any[] }>(), 
    'Load Team Members Failure': props<{ error: string }>(),

    'Add Member': props<{ teamId: number; member: MemberInTeam }>(),
    'Add Member Success': props<{ team: Teams }>(),
    'Add Member Failure': props<{ error: string }>(),

    'Remove Member': props<{ teamId: number | string; userId: number | string }>(),
    'Remove Member Success': props<{ teamId: number | string; userId: number | string }>(),
    'Remove Member Failure': props<{ error: string }>()
    
  }
});