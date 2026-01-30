import { Component, input, inject, effect, signal, viewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommentsActions } from '../../state/comments/comments.actions';
import { selectAllComments, selectCommentsLoading } from '../../state/comments/comments.selectors'; // וודא נתיב נכון
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-task-comments',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule, MatInputModule, MatFormFieldModule],
  templateUrl: './task-comments.html',
  styleUrl: './task-comments.css'
})
export class TaskComments {
  private readonly store = inject(Store);
  private readonly dialogData = inject(MAT_DIALOG_DATA, { optional: true });

  taskId = input<number>(this.dialogData?.taskId);

  comments = this.store.selectSignal(selectAllComments);
  isLoading = this.store.selectSignal(selectCommentsLoading);
  newCommentText = signal('');
  private chatContainer = viewChild<ElementRef>('scrollContainer');

  constructor() {
    effect(() => {
      const id = this.taskId();
      if (id) {
        this.store.dispatch(CommentsActions.loadComments({ taskId: id }));
      }
    });

    effect(() => {
      if (this.comments()) {
        setTimeout(() => this.scrollToBottom(), 100);
      }
    });
  }

  sendComment() {
    const text = this.newCommentText().trim();
    if (!text) return;

    this.store.dispatch(CommentsActions.addComment({
      comment: {
        taskId: this.taskId(),
        body: text
      }
    }));
    this.newCommentText.set('');
  }

  private scrollToBottom() {
    const el = this.chatContainer()?.nativeElement;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }

}