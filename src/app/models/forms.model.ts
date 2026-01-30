interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password';
  icon: string;
  validators: any[];
  errorMessages: { [key: string]: string };
}
