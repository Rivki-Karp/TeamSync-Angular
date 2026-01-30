import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { ProjectsActions } from '../../state/projects/projects.actions';
import { selectAllProjects, selectProjectsLoading } from '../../state/projects/projects.selectors';
import { ProjectCard } from '../project-card/project-card';
import { CreateProjectDialog } from '../create-project-dialog/create-project-dialog';
import { TeamsActions } from '../../state/teams/teams.actions';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [ProjectCard, MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatDialogModule],
  templateUrl: './projects.html',
  styleUrl: './projects.css'
})
export class Projects {
  private readonly store = inject(Store);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);

  readonly projects = this.store.selectSignal(selectAllProjects);
  readonly isLoading = this.store.selectSignal(selectProjectsLoading);

  constructor() {
    this.store.dispatch(ProjectsActions.loadProjects());
    this.store.dispatch(TeamsActions.loadTeams());
  }

  openCreateProjectDialog(): void {
    this.dialog.open(CreateProjectDialog, {
      width: '500px',
      backdropClass: 'blur-backdrop',
      panelClass: 'custom-dialog-container',
      enterAnimationDuration: '300ms'
    });
  }

  openEditProjectDialog(project: any): void {
    this.dialog.open(CreateProjectDialog, {
      width: '500px',
      backdropClass: 'blur-backdrop',
      panelClass: 'custom-dialog-container',
      data: { project }
    });
  }
  onDeleteProject(id: number): void {
    if (confirm('Are you sure you want to delete this project?')) {
      this.store.dispatch(ProjectsActions.deleteProject({ id }));
    }
  }
  onViewTasks(projectId: number): void {
    this.router.navigate(['/projects', projectId, 'tasks']);
  }
}