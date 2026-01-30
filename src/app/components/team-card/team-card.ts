import { Component, input, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-team-card',
  standalone: true,
  imports: [MatCardModule, CommonModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './team-card.html',
  styleUrl: './team-card.css'
})
export class TeamCard {

  team = input.required<Teams>();
  addMember = output<number>();
  viewProjects = output<number>();
  deleteTeam = output<number>();
}