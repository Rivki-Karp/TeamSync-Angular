import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'landing-page',
  standalone: true,
  imports: [MatButtonModule,MatIconModule],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css',
})
export class LandingPage {
  private router = inject(Router);

  features = [
    { icon: 'dashboard', title: 'Unified Dashboard', description: 'See everything at a glance.' },
    { icon: 'people', title: 'Team Collaboration', description: 'Work together seamlessly.' },
    { icon: 'analytics', title: 'Smart Analytics', description: 'Track progress effortlessly.' },
    { icon: 'integration_instructions', title: 'Easy Integration', description: 'Connect your favorite tools.' }
  ];

  testimonials = [
    { name: 'Sarah Chen', role: 'Product Manager', company: 'TechCorp', text: 'TeamSync transformed how we work.', avatar: '👩‍💼' },
    { name: 'Marcus Johnson', role: 'Founder', company: 'GrowthLab', text: 'Simple, powerful, beautiful.', avatar: '👨‍💻' }
  ];

  goToLogin() { this.router.navigate(['/login']); }
  goToRegister() { this.router.navigate(['/signup']); }
  scrollToFeatures() { document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); }
}