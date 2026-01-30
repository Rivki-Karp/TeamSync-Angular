import { Component, input, output, inject, signal, computed } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-auth-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, 
    MatFormFieldModule, MatButtonModule, MatIconModule, MatCardModule],
  templateUrl: './auth-form.html',
  styleUrl: './auth-form.css'
})
export class AuthFormComponent {
 private fb = inject(FormBuilder);

  fields = input.required<FormField[]>();
  title = input.required<string>();
  subtitle = input<string>('');
  submitLabel = input<string>('Submit');
  isLoading = input<boolean>(false);
  errorMessage = input<string | null>(null);

  formSubmit = output<any>();
  hidePassword = signal(true);

  // בניית הטופס בצורה ריאקטיבית ברגע שהקומפוננטה נוצרת
form = computed(() => {
    const group: any = {};
    this.fields().forEach(field => {
      group[field.name] = ['', field.validators];
    });
    return this.fb.group(group);
  });

  onSubmit() {
    if (this.form().valid) {
      this.formSubmit.emit(this.form().value);
    } else {
      this.form().markAllAsTouched();
    }
  }

  objectKeys(obj: any) {
    return Object.keys(obj);
  }
}