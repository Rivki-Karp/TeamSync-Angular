import { createReducer, on } from '@ngrx/store';
import { TasksActions } from './tasks.actions';

export interface TasksState {
    tasks: Tasks[];
    isLoading: boolean;
    error: string | null;
}

const initialState: TasksState = {
    tasks: [],
    isLoading: false,
    error: null
};

export const tasksReducer = createReducer(
    initialState,
    on(TasksActions.loadTasks, (state) => ({ ...state, isLoading: true })),
    on(TasksActions.loadTasksSuccess, (state, { tasks }) => ({ ...state, tasks, isLoading: false })),

    on(TasksActions.createTaskSuccess, (state, { task }) => ({
        ...state,
        tasks: [...state.tasks, task]
    })),

    on(TasksActions.updateTaskSuccess, (state, { task }) => ({
        ...state,
        tasks: state.tasks.map(t => t.projectId === task.projectId ? task : t)
    })),

    on(TasksActions.deleteTaskSuccess, (state, { id }) => ({
        ...state,
        tasks: state.tasks.filter(t => t.id !== id) 
    })),

    on(
        TasksActions.loadTasksFailure,
        TasksActions.createTaskFailure,
        TasksActions.updateTaskFailure,
        TasksActions.deleteTaskFailure,
        (state, { error }) => ({ ...state, error, isLoading: false })
    )
);