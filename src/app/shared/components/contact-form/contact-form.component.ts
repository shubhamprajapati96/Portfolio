import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ContactRequest } from '@core/interfaces/portfolio.interfaces';
import { CustomValidators } from '@shared/validators/custom.validators';

@Component({
  selector: 'app-contact-form',
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule
  ],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()" novalidate class="contact-form">
      <div class="form-row">
        <mat-form-field appearance="outline" floatLabel="always" class="form-field">
          <mat-label>Your Name</mat-label>
          <mat-icon matPrefix class="field-icon">person</mat-icon>
          <input matInput formControlName="name" placeholder="e.g. John Doe" autocomplete="name" />
          @if (form.controls.name.hasError('required') || form.controls.name.hasError('whitespace')) {
            <mat-error>Name is required.</mat-error>
          } @else if (form.controls.name.hasError('minlength')) {
            <mat-error>Name must be at least 2 characters.</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" floatLabel="always" class="form-field">
          <mat-label>Email Address</mat-label>
          <mat-icon matPrefix class="field-icon">mail</mat-icon>
          <input matInput formControlName="email" type="email" placeholder="e.g. john@company.com" autocomplete="email" />
          @if (form.controls.email.hasError('required')) {
            <mat-error>Email is required.</mat-error>
          } @else if (form.controls.email.hasError('email')) {
            <mat-error>Enter a valid email address.</mat-error>
          }
        </mat-form-field>
      </div>

      <mat-form-field appearance="outline" floatLabel="always" class="form-field">
        <mat-label>Subject</mat-label>
        <mat-icon matPrefix class="field-icon">topic</mat-icon>
        <input matInput formControlName="subject" placeholder="Project Architecture / Leadership" />
        @if (form.controls.subject.hasError('required') || form.controls.subject.hasError('whitespace')) {
          <mat-error>Subject is required.</mat-error>
        } @else if (form.controls.subject.hasError('maxlength')) {
          <mat-error>Subject cannot exceed 100 characters.</mat-error>
        }
      </mat-form-field>

      <mat-form-field appearance="outline" floatLabel="always" class="form-field message-field">
        <mat-label>Your Message</mat-label>
        <mat-icon matPrefix class="field-icon textarea-icon">edit_note</mat-icon>
        <textarea
          matInput
          formControlName="message"
          rows="5"
          placeholder="Tell me about your project scope, timeline, and goals..."
        ></textarea>
        <mat-hint align="end">{{ form.controls.message.value.length }} / 20 min characters</mat-hint>
        @if (form.controls.message.hasError('required') || form.controls.message.hasError('whitespace')) {
          <mat-error>Message is required.</mat-error>
        } @else if (form.controls.message.hasError('minlength')) {
          <mat-error>Please provide at least 20 characters.</mat-error>
        }
      </mat-form-field>

      @if (successMessage()) {
        <div class="success-banner" role="status">
          <mat-icon aria-hidden="true">check_circle</mat-icon>
          <span>{{ successMessage() }}</span>
        </div>
      }

      <button
        mat-flat-button
        color="primary"
        type="submit"
        class="submit-btn"
        [disabled]="isSubmitting()"
      >
        @if (isSubmitting()) {
          <span class="btn-content">
            <mat-spinner diameter="20" class="submit-spinner" />
            <span>Sending Message...</span>
          </span>
        } @else {
          <span class="btn-content">
            <span>Send Message</span>
            <mat-icon aria-hidden="true" class="send-icon">send</mat-icon>
          </span>
        }
      </button>
    </form>
  `,
  styles: `
    .contact-form {
      display: grid;
      gap: 1rem;
    }

    .form-row {
      display: grid;
      gap: 1rem;

      @media (min-width: 40rem) {
        grid-template-columns: 1fr 1fr;
      }
    }

    .form-field {
      inline-size: 100%;
    }

    :host ::ng-deep {
      .form-field {
        .mat-mdc-text-field-wrapper {
          .mat-mdc-form-field-flex {
            align-items: center;
          }
        }

        .mat-mdc-form-field-icon-prefix {
          padding-inline: 0.75rem 0.4rem !important;
          color: var(--secondary) !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;

          .mat-icon {
            font-size: 1.25rem !important;
            inline-size: 1.25rem !important;
            block-size: 1.25rem !important;
            line-height: 1 !important;
            margin: 0 !important;
          }
        }
      }

      .message-field {
        .mat-mdc-text-field-wrapper .mat-mdc-form-field-flex {
          align-items: flex-start !important;
        }

        .mat-mdc-form-field-icon-prefix {
          align-self: flex-start !important;
          padding-block-start: 1rem !important;
          padding-block-end: 0 !important;
        }

        textarea.mat-mdc-input-element {
          padding-block-start: 0.85rem !important;
        }
      }

      .submit-btn {
        min-block-size: 3.5rem !important;
        border-radius: 9999px !important;
        font-size: 1rem !important;
        font-weight: 700 !important;
        margin-block-start: 0.5rem;
        width: 100% !important;

        .mdc-button__label {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 0.65rem !important;
        }

        .btn-content {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.65rem;
        }

        .send-icon {
          font-size: 1.2rem !important;
          inline-size: 1.2rem !important;
          block-size: 1.2rem !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          margin: 0 !important;
          transition: transform 200ms ease;
        }

        &:hover:not([disabled]) .send-icon {
          transform: translateX(4px);
        }
      }
    }

    textarea {
      resize: vertical;
      min-block-size: 8.5rem;
    }

    .submit-spinner {
      display: inline-block;
    }

    .success-banner {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin: 0;
      padding: 1rem 1.25rem;
      border: 1px solid var(--success);
      border-radius: 1rem;
      background: var(--success-bg);
      color: var(--text-primary);
      font-size: 0.95rem;
      font-weight: 500;
      animation: fadeIn 300ms ease;

      mat-icon {
        color: var(--success);
        font-size: 1.4rem;
        inline-size: 1.4rem;
        block-size: 1.4rem;
        flex-shrink: 0;
      }
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(-6px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactFormComponent {
  private readonly formBuilder = inject(FormBuilder);
  readonly submitted = output<ContactRequest>();
  readonly isSubmitting = signal(false);
  readonly successMessage = signal('');

  readonly form = this.formBuilder.nonNullable.group({
    name: ['', [CustomValidators.required(), CustomValidators.noWhitespace(), CustomValidators.minLength(2)]],
    email: ['', [CustomValidators.required(), CustomValidators.email()]],
    subject: ['', [CustomValidators.required(), CustomValidators.noWhitespace(), CustomValidators.maxLength(100)]],
    message: ['', [CustomValidators.required(), CustomValidators.noWhitespace(), CustomValidators.minLength(20)]]
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.form.updateValueAndValidity();
      return;
    }

    this.isSubmitting.set(true);
    this.successMessage.set('');
    this.submitted.emit(this.form.getRawValue());
  }

  markSuccess(name: string): void {
    this.isSubmitting.set(false);
    this.successMessage.set(`Thanks, ${name}! Your message has been received. I'll get back to you promptly.`);
    this.form.reset();
  }

  markFailure(): void {
    this.isSubmitting.set(false);
  }
}


