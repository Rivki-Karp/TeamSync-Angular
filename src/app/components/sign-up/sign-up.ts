
import { Component, inject } from '@angular/core';
import { LOGIN_FIELDS } from '../login/login';
import { CommonModule } from '@angular/common';
import { AuthFormComponent } from '../auth-form/auth-form';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectAuthError, selectIsLoading } from '../../state/auth/auth.selectors';
import { Validators } from '@angular/forms';
import { AuthActions } from '../../state/auth/auth.actions';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, AuthFormComponent, RouterLink],
  templateUrl: './sign-up.html'
})
export class Signup {
  private store = inject(Store);
  isLoading = this.store.selectSignal(selectIsLoading);
  authError = this.store.selectSignal(selectAuthError);

  readonly signupFields: FormField[] = [
    {
      name: 'name',
      label: 'Full Name',
      type: 'text',
      icon: 'person',
      validators: [Validators.required],
      errorMessages: { required: 'Full name is required' }
    },
    ...LOGIN_FIELDS
  ];

  onSignup(formData: any) {
    this.store.dispatch(AuthActions.signupRequest(formData));
  }
}