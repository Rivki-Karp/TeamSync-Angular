import { Component, signal, effect, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthActions } from './state/auth/auth.actions';
import { toSignal } from '@angular/core/rxjs-interop';
import { selectToken } from './state/auth/auth.selectors';
import { map } from 'rxjs';
import { HeaderComponent } from './components/header/header';
import { SidebarComponent } from './components/sidebar/sidebar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,HeaderComponent,SidebarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private platformId = inject(PLATFORM_ID);
  private store = inject(Store); 
  
  protected readonly title = signal('TeamSync');
  isDarkMode = signal(false);

  isLoggedIn = toSignal(
    this.store.select(selectToken).pipe(map(token => !!token)),
    { initialValue: false }
  );

  constructor() {
    this.store.dispatch(AuthActions.checkAuth());

    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem('theme');
      this.isDarkMode.set(savedTheme === 'dark');
    }

    effect(() => {
      if (isPlatformBrowser(this.platformId)) {
        const theme = this.isDarkMode() ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
      }
    });
  }

  toggleTheme() {
    this.isDarkMode.update(prev => !prev);
  }
}