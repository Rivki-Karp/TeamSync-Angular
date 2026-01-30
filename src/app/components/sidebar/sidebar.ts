import { Component, signal, inject, HostListener, effect } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, MatIconModule, RouterLinkActive, MatButtonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class SidebarComponent {
  private store = inject(Store);

  isCollapsed = signal(false);
  isMobileMode = signal(false);
  isDrawerOpen = signal(false);

  constructor() {
    effect(() => {
      let width = '260px';
      if (this.isMobileMode()) {
        width = '0px';
      } else if (this.isCollapsed()) {
        width = '80px';
      }
      document.documentElement.style.setProperty('--sidebar-width', width);
    });
  }
  ngOnInit() {
    this.checkScreenSize();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    const isMobile = window.innerWidth < 992;
    this.isMobileMode.set(isMobile);

    if (!isMobile) this.isDrawerOpen.set(false);
  }

  toggleSidebar() {
    if (this.isMobileMode()) {
      this.isDrawerOpen.update(v => !v);
    } else {
      this.isCollapsed.update(v => !v);
    }
  }
}