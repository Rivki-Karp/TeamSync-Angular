import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Store } from '@ngrx/store';
import { TeamsActions } from '../../state/teams/teams.actions';

@Component({
  selector: 'app-create-team-dialog',
  standalone: true,
  imports: [MatDialogModule,MatFormFieldModule,MatInputModule,MatButtonModule,ReactiveFormsModule],
  templateUrl: './create-team-dialog.html',
  styleUrl: './create-team-dialog.css'
})
export class CreateTeamDialog {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store);
  private readonly dialogRef = inject(MatDialogRef<CreateTeamDialog>);

  readonly teamForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]]
  });

  onSubmit(): void {
    if (this.teamForm.valid) {
      const { name } = this.teamForm.getRawValue();
      
      this.store.dispatch(TeamsActions.createTeam({ 
        name: name!
      }));

      this.dialogRef.close();
    }
  }
}