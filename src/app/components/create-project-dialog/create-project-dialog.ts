import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

import { selectAllTeams } from '../../state/teams/teams.selectors';
import { ProjectsActions } from '../../state/projects/projects.actions';

@Component({
  selector: 'app-create-project-dialog',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,MatDialogModule,MatFormFieldModule,MatInputModule,MatSelectModule, MatButtonModule ],
  templateUrl: './create-project-dialog.html',
  styleUrl: './create-project-dialog.css'
})
export class CreateProjectDialog {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store);
  private readonly dialogRef = inject(MatDialogRef<CreateProjectDialog>);

public data = inject(MAT_DIALOG_DATA, { optional: true });

  readonly teams = this.store.selectSignal(selectAllTeams);
isEditMode = false;
  
projectForm = this.fb.group({
    teamId: [null as number | null, [Validators.required]],
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: ['']
  });

  constructor() {
    if (this.data?.project) {
      this.isEditMode = true;
      this.projectForm.patchValue({
        teamId: this.data.project.team_id,
        name: this.data.project.name,
        description: this.data.project.description
      });
      this.projectForm.get('teamId')?.disable();
    }
  }

  onSubmit(): void {
    if (this.projectForm.valid) {
      const rawValue = this.projectForm.getRawValue();
      
      if (this.isEditMode) {
        this.store.dispatch(ProjectsActions.updateProject({ 
          id: this.data.project.id, 
          updates: {
            name: rawValue.name!,
            description: rawValue.description ?? '',
            team_id: Number(rawValue.teamId)
          } 
        }));
      } else {
        const newProject = {
          teamId: Number(rawValue.teamId),
          name: rawValue.name!,
          description: rawValue.description ?? ''
        };
        this.store.dispatch(ProjectsActions.createProject({ project: newProject }));
      }

      this.dialogRef.close(true);
    }
  }
}