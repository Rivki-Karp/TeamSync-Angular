import { Component, computed, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { Store } from '@ngrx/store';
import { TeamsActions } from '../../state/teams/teams.actions';
import { selectAllUsers } from '../../state/users/users.selectors';
import { selectCurrentTeamMembers, selectTeamsLoading } from '../../state/teams/teams.selectors';
import { UsersActions } from '../../state/users/users.action';
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatListModule } from '@angular/material/list';
@Component({
  selector: 'app-add-member-dialog',
  standalone: true,
  imports: [MatListModule,MatDividerModule,  MatTooltipModule, CommonModule, MatDialogModule, MatFormFieldModule, MatSelectModule,
    MatButtonModule, MatIconModule, MatInputModule, MatDividerModule,ReactiveFormsModule],
  templateUrl: './add-member-dialog.html',
  styleUrl: './add-member-dialog.css'
})
export class AddMemberDialog {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store);
  private readonly dialogRef = inject(MatDialogRef<AddMemberDialog>);
  readonly data = inject<{ teamId: number; teamName: string }>(MAT_DIALOG_DATA);

  readonly allUsers = this.store.selectSignal(selectAllUsers);
  readonly currentMembers = this.store.selectSignal(selectCurrentTeamMembers);

  readonly isLoading = this.store.selectSignal(selectTeamsLoading);

  availableUsers = computed(() => {
    const membersIds = new Set(this.currentMembers().map(m => m.id));
    return this.allUsers().filter(user => !membersIds.has(user.id));
  });

  ngOnInit(): void {
    this.store.dispatch(TeamsActions.loadTeamMembers({ teamId: this.data.teamId }));
    this.store.dispatch(UsersActions.loadAllUsers());
  }

  readonly addMemberForm = this.fb.group({
    userId: [null as number | null, [Validators.required]],
    role: ['member', [Validators.required]]
  });

  onAddMember(): void {
    if (this.addMemberForm.valid) {
      const { userId, role } = this.addMemberForm.getRawValue();
      this.store.dispatch(TeamsActions.addMember({
        teamId: this.data.teamId,
        member: { userId: userId!, role: role! }
      }));
      this.addMemberForm.reset({ role: 'member' });
    }
    this.dialogRef.close();
  }

  onRemoveMember(userId: number): void {
    if (confirm('Are you sure you want to remove this member?')) {
      this.store.dispatch(TeamsActions.removeMember({
        teamId: this.data.teamId,
        userId
      }));
    }
    this.dialogRef.close();
  }

}