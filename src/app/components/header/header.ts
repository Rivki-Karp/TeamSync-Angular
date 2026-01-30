import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthActions } from '../../state/auth/auth.actions';
import { selectToken, selectAuthState } from '../../state/auth/auth.selectors';
import { App } from '../../app'; 
import { map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive,MatIconModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class HeaderComponent {
 public router = inject(Router);
  public store = inject(Store);
  app = inject(App); 
  authState = toSignal(this.store.select(selectAuthState));
  isLoggedIn = toSignal(this.store.select(selectToken).pipe(map(t => !!t)));

  logout() {
    this.store.dispatch(AuthActions.logout());
  }
}