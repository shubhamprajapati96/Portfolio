import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

export class CustomValidators {
  static email(): ValidatorFn {
    return Validators.email;
  }

  static phone(): ValidatorFn {
    return (control: AbstractControl<string | null>): ValidationErrors | null => {
      const value = control.value?.trim();
      return !value || /^\+?[0-9\s().-]{7,}$/.test(value) ? null : { phone: true };
    };
  }

  static url(): ValidatorFn {
    return (control: AbstractControl<string | null>): ValidationErrors | null => {
      const value = control.value?.trim();
      return !value || /^https?:\/\/.+\..+/.test(value) ? null : { url: true };
    };
  }

  static required(): ValidatorFn {
    return Validators.required;
  }

  static minLength(length: number): ValidatorFn {
    return Validators.minLength(length);
  }

  static maxLength(length: number): ValidatorFn {
    return Validators.maxLength(length);
  }

  static noWhitespace(): ValidatorFn {
    return (control: AbstractControl<string | null>): ValidationErrors | null => {
      const value = control.value;
      if (value !== null && value !== undefined && typeof value === 'string' && value.length > 0) {
        return value.trim().length === 0 ? { whitespace: true } : null;
      }
      return null;
    };
  }

  static noSpecialCharacters(): ValidatorFn {
    return (control: AbstractControl<string | null>): ValidationErrors | null => {
      const value = control.value?.trim();
      return !value || /^[a-zA-Z0-9\s]+$/.test(value) ? null : { specialCharacters: true };
    };
  }

  static strongPassword(): ValidatorFn {
    return (control: AbstractControl<string | null>): ValidationErrors | null => {
      const value = control.value ?? '';
      return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{10,}$/.test(value)
        ? null
        : { strongPassword: true };
    };
  }
}
