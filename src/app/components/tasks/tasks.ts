import { Component, inject, signal, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { TasksActions } from '../../state/tasks/tasks.actions';
import { selectTasksByStatus, selectTasksLoading } from '../../state/tasks/tasks.selectors';
import { TaskCard } from '../task-card/task-card';
import { TaskDialog } from '../task-dialog/task-dialog';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, TaskCard, MatButtonModule, MatIconModule, MatDialogModule],
  templateUrl: './tasks.html',
  styleUrls: ['./tasks.css']
})
export class Tasks {
  private readonly store = inject(Store);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  private readonly params = toSignal(this.route.params);

  readonly projectId = computed(() => Number(this.params()?.['id']) || 0);

  readonly todoTasks = this.store.selectSignal(selectTasksByStatus('Backlog'));
  readonly inProgressTasks = this.store.selectSignal(selectTasksByStatus('In Progress'));
  readonly doneTasks = this.store.selectSignal(selectTasksByStatus('Done'));
  readonly isLoading = this.store.selectSignal(selectTasksLoading);

  constructor() {
    effect(() => {
      const id = this.projectId();
      if (id > 0) {
        this.store.dispatch(TasksActions.loadTasks({ projectId: id }));
      }
    });
  }

  openAddTaskDialog() {
    this.dialog.open(TaskDialog, {
      width: '500px',
      data: { projectId: this.projectId() },
      panelClass: 'modern-dialog'
    }).afterClosed().subscribe(result => {
      if (result) {
        this.store.dispatch(TasksActions.createTask({ task: result }));
      }
    });
  }

  onDeleteTask(id: number) {
    this.store.dispatch(TasksActions.deleteTask({ id }));
  }

  onUpdateStatus(event: { id: number, status: 'Backlog' | 'In Progress' | 'Done' }) {
    this.store.dispatch(TasksActions.updateTask({
      id: event.id,
      changes: { status: event.status }
    }));
  }

  goBack() {
    this.router.navigate(['/projects']);
  }
}