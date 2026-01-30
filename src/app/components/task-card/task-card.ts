import { Component, input, output, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { TaskComments } from '../task-comments/task-comments';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule, MatMenuModule, MatButtonModule],
  templateUrl: './task-card.html',
  styleUrls: ['./task-card.css']
})
export class TaskCard {
  task = input.required<Tasks>();

  updateStatus = output<{ id: number, status: 'Backlog' | 'In Progress' | 'Done' }>();
  updatePriority = output<{ id: number, priority: string }>();
  deleteTask = output<number>();

  private dialog = inject(MatDialog);

  openComments(event: Event): void {
    event.stopPropagation();

    this.dialog.open(TaskComments, {
      data: { taskId: this.task().id },
      width: '100%',
      maxWidth: '500px',
      height: '80vh',
      panelClass: 'modern-chat-dialog',
      autoFocus: false
    });
  }
  priorityColor = computed(() => {
    switch (this.task().priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#3b82f6';
      default: return '#64748b';
    }
  });
}