import { Component, computed, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { Store } from '@ngrx/store';
import { selectAllTeams } from '../../state/teams/teams.selectors';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [MatMenuModule, CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule],
  templateUrl: './project-card.html',
  styleUrl: './project-card.css'
})
export class ProjectCard {
  private store = inject(Store);
  project = input.required<any>();
  teams = this.store.selectSignal(selectAllTeams);

  viewDetails = output<number>();
  edit = output<any>();
  delete = output<number>();

  teamName = computed(() => {
    const team = this.teams().find(t => t.id === this.project().team_id);
    return team ? team.name : 'Unknown Team';
  });

  onEdit(event: Event) {
    event.stopPropagation();
    this.edit.emit(this.project());
  }

  onDelete(event: Event) {
    event.stopPropagation();
    this.delete.emit(this.project().id);
  }
}