import { createReducer, on } from '@ngrx/store';
import { TeamsActions } from './teams.actions';

export interface TeamsState {
    teams: Teams[];
    loading: boolean;
    currentTeamMembers: any[];
    error: string | null;
}

export const initialState: TeamsState = {
    teams: [],
    currentTeamMembers: [],
    loading: false,
    error: null,
};

export const teamsReducer = createReducer(
    initialState,

    on(TeamsActions.loadTeams, (state) => ({ ...state, loading: true, error: null })),
    on(TeamsActions.loadTeamsSuccess, (state, { teams }) => ({ ...state, teams, loading: false })),
    on(TeamsActions.loadTeamsFailure, (state, { error }) => ({ ...state, error, loading: false })),

    on(TeamsActions.createTeam, (state) => ({ ...state, loading: true })),
    on(TeamsActions.createTeamSuccess, (state, { team }) => ({
        ...state,
        teams: [...state.teams, team],
        loading: false
    })),
    on(TeamsActions.createTeamFailure, (state, { error }) => ({ ...state, error, loading: false })),
    on(TeamsActions.addMemberSuccess, (state, { team }) => ({
        ...state,
        teams: state.teams.map((t) => (t.id === team.id ? team : t)),
        loading: false
    })),

    on(TeamsActions.deleteTeam, (state) => ({ ...state, loading: true })),
    on(TeamsActions.deleteTeamSuccess, (state, { id }) => ({
        ...state,
        teams: state.teams.filter(t => t.id !== id), 
        loading: false
    })),
    on(TeamsActions.deleteTeamFailure, (state, { error }) => ({ ...state, error, loading: false })),

    on(TeamsActions.loadTeamMembers, (state) => ({ ...state, loading: true, error: null })),
    on(TeamsActions.loadTeamMembersSuccess, (state, { members }) => ({
        ...state,
        currentTeamMembers: members,
        loading: false
    })),
    on(TeamsActions.loadTeamMembersFailure, (state, { error }) => ({ ...state, error, loading: false })),

    on(TeamsActions.removeMember, (state) => ({ ...state, loading: true })),
    on(TeamsActions.removeMemberSuccess, (state, { userId }) => ({
        ...state,
        currentTeamMembers: state.currentTeamMembers.filter(m => m.id !== userId),
        loading: false
    })),
    on(TeamsActions.removeMemberFailure, (state, { error }) => ({ ...state, error, loading: false })),

    on(TeamsActions.addMemberSuccess, (state) => ({ ...state, loading: false }))
);