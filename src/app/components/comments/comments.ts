import { Component, inject, input, signal, effect, ElementRef, ViewChild, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { CommentsActions } from '../../state/comments/comments.actions';
import { selectAllComments, selectCommentsLoading } from '../../state/comments/comments.selectors';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './comments.html',
  styleUrls: ['./comments.css']
})
export class CommentsComponent {
  private readonly store = inject(Store);

  taskId = input.required<number>();

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  newCommentText = signal<string>('');
  comments = this.store.selectSignal(selectAllComments);
  isLoading = this.store.selectSignal(selectCommentsLoading);

  constructor() {
    effect(() => {
      this.store.dispatch(CommentsActions.loadComments({ taskId: this.taskId() }));
    });

    effect(() => {
      if (this.comments()) {
        setTimeout(() => this.scrollToBottom(), 100);
      }
    });
  }

  sendComment(): void {
    const commentText = this.newCommentText().trim();
    if (!commentText) return;

    this.store.dispatch(CommentsActions.addComment({
      comment: {
        body: commentText,
        taskId: this.taskId()
      }
    }));

    this.newCommentText.set('');
  }

  private scrollToBottom(): void {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    }
  }

  isOwnMessage(commentUserId: number): boolean {
    return false;
  }
}