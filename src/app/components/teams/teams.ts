import { Component, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { TeamsActions } from '../../state/teams/teams.actions';
import { selectAllTeams, selectTeamsLoading } from '../../state/teams/teams.selectors';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TeamCard } from '../team-card/team-card';
import { CreateTeamDialog } from '../create-team-dialog/create-team-dialog';
import { AddMemberDialog } from '../add-member-dialog/add-member-dialog';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [TeamCard, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './teams.html',
  styleUrl: './teams.css'
})
export class TeamsComponent {

  private readonly store = inject(Store);
  private readonly dialog = inject(MatDialog);

  readonly teams = this.store.selectSignal(selectAllTeams);
  readonly isLoading = this.store.selectSignal(selectTeamsLoading);

  constructor() {
    this.store.dispatch(TeamsActions.loadTeams());
  }

  openCreateTeamDialog(): void {
    this.dialog.open(CreateTeamDialog, {
      width: '100%',
      maxWidth: '450px',
      panelClass: 'modern-dialog-container',
      autoFocus: false
    });
  }

  onAddMember(team: Teams): void {
    this.dialog.open(AddMemberDialog, {
      width: '500px',
      data: {
        teamId: team.id,
        teamName: team.name
      }
    });
  }
  onDeleteTeam(teamId: number): void {
    const confirmed = confirm('Are you sure you want to delete this team? This action cannot be undone.');
    if (confirmed) {
      this.store.dispatch(TeamsActions.deleteTeam({ id: teamId }));
    }
  }

  onViewProjects(teamId: number): void {
    console.log('Navigating to projects of team:', teamId);
  }
}