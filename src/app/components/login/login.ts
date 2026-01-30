import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { Store } from '@ngrx/store';
import { AuthActions } from '../../state/auth/auth.actions';
import { selectIsLoading, selectAuthError } from '../../state/auth/auth.selectors';
import { Router, RouterLink } from '@angular/router';
import { AuthFormComponent } from '../auth-form/auth-form';

export const LOGIN_FIELDS: FormField[] = [
  {
    name: 'email',
    label: 'Email Address',
    type: 'email',
    icon: 'email',
    validators: [Validators.required, Validators.email],
    errorMessages: {
      required: 'Email is required',
      email: 'Please enter a valid email address'
    }
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    icon: 'lock',
    validators: [Validators.required, Validators.minLength(6)],
    errorMessages: {
      required: 'Password is required',
      minlength: 'Password must be at least 6 characters'
    }
  }
];

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,MatInputModule,MatFormFieldModule,MatButtonModule,MatIconModule,MatCardModule,ReactiveFormsModule,AuthFormComponent,RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder);
  private store = inject(Store);
private router = inject(Router);

  isLoading = this.store.selectSignal(selectIsLoading);
  authError = this.store.selectSignal(selectAuthError);
  hidePassword = signal(true);

  readonly loginFields = LOGIN_FIELDS;

  loginForm: FormGroup = this.fb.group(
    this.loginFields.reduce((acc, field) => {
      acc[field.name] = ['', field.validators];
      return acc;
    }, {} as any)
  );

  objectKeys(obj: any) {
    return Object.keys(obj);
  }

  onSubmit(formData: any) {
  if (formData) {
    this.store.dispatch(AuthActions.loginRequest(formData));
  }
}
}