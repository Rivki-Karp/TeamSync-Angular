import { createReducer, on } from '@ngrx/store';
import { ProjectsActions } from './projects.actions';

export interface ProjectsState {
    projects: Project[];
    isLoading: boolean;
    error: string | null;
}

export const initialState: ProjectsState = {
    projects: [],
    isLoading: false,
    error: null
};

export const projectsReducer = createReducer(
    initialState,
    on(ProjectsActions.loadProjects, (state) => ({ ...state, isLoading: true })),
    on(ProjectsActions.loadProjectsSuccess, (state, { projects }) => ({
        ...state,
        projects,
        isLoading: false
    })),
    on(ProjectsActions.loadProjectsFailure, (state, { error }) => ({
        ...state,
        error,
        isLoading: false
    })),

    on(ProjectsActions.createProjectSuccess, (state, { project }) => ({
        ...state,
        projects: [...state.projects, project],
        isLoading: false
    })),

    on(ProjectsActions.updateProjectSuccess, (state, { project }) => ({
        ...state,
        projects: state.projects.map(p => p.id === project.id ? project : p),
        loading: false
    })),

    on(ProjectsActions.deleteProjectSuccess, (state, { id }) => ({
        ...state,
        projects: state.projects.filter(p => p.id !== id),
        isLoading: false
    }))
);