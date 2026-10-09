import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AdminAuthService } from '../../../core/services/admin-auth.service';

@Component({
  selector: 'app-admin-login',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="admin-login-page">
      <div class="login-glow-bg" aria-hidden="true"></div>

      <div class="login-container">
        <header class="login-header">
          <a routerLink="/" class="back-link">
            <mat-icon>arrow_back</mat-icon>
            <span>Back to Portfolio</span>
          </a>

          <div class="brand-badge">
            <mat-icon>admin_panel_settings</mat-icon>
            <span>Portfolio Intelligence</span>
          </div>
          <h1 class="login-title">Admin Console</h1>
          <p class="login-subtitle">
            Sign in to inspect real-time enquiries, visitor telemetry, and APK downloads.
          </p>
        </header>

        <form [formGroup]="form" (ngSubmit)="submit()" class="login-form" novalidate>
          @if (errorMessage()) {
            <div class="error-banner" role="alert">
              <mat-icon>error_outline</mat-icon>
              <span>{{ errorMessage() }}</span>
            </div>
          }

          <mat-form-field appearance="outline" floatLabel="always" class="form-field">
            <mat-label>Admin Email</mat-label>
            <mat-icon matPrefix>mail</mat-icon>
            <input
              matInput
              formControlName="email"
              type="email"
              placeholder="Enter your email"
              autocomplete="off"
            />
          </mat-form-field>

          <mat-form-field appearance="outline" floatLabel="always" class="form-field">
            <mat-label>Password</mat-label>
            <mat-icon matPrefix>lock</mat-icon>
            <input
              matInput
              [type]="hidePassword() ? 'password' : 'text'"
              formControlName="password"
              placeholder="Enter your password"
              autocomplete="new-password"
            />
            <button
              mat-icon-button
              matSuffix
              type="button"
              (click)="hidePassword.set(!hidePassword())"
              [attr.aria-label]="hidePassword() ? 'Show password' : 'Hide password'"
            >
              <mat-icon>{{ hidePassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
          </mat-form-field>

          <button
            mat-flat-button
            color="primary"
            type="submit"
            class="submit-btn"
            [disabled]="isLoading()"
          >
            @if (isLoading()) {
              <mat-spinner diameter="20" class="spinner"></mat-spinner>
              <span>Authenticating...</span>
            } @else {
              <span class="btn-label">
                Sign In to Dashboard
                <mat-icon class="btn-icon">login</mat-icon>
              </span>
            }
          </button>
        </form>

        <footer class="login-footer">
          <p>
            Connected to <strong>NestJS + MongoDB Atlas</strong> backend.
          </p>
        </footer>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      min-block-size: 100vh;
      background: var(--bg-base, #030712);
      color: var(--text-primary, #f9fafb);
      font-family: inherit;
    }

    .admin-login-page {
      position: relative;
      min-block-size: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      overflow: hidden;
    }

    .login-glow-bg {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 50% 20%, rgba(6, 182, 212, 0.15), transparent 60%),
        radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.12), transparent 50%);
      pointer-events: none;
    }

    .login-container {
      position: relative;
      inline-size: 100%;
      max-inline-size: 30rem;
      padding: clamp(1.75rem, 5vw, 2.75rem);
      border-radius: 1.75rem;
      background: var(--bg-card, rgba(17, 24, 39, 0.85));
      border: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.1));
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
    }

    .login-header {
      margin-block-end: 2rem;
      text-align: center;
    }

    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-secondary, #9ca3af);
      margin-block-end: 1.25rem;
      transition: color 180ms ease;

      &:hover {
        color: var(--primary, #06b6d4);
      }

      mat-icon {
        font-size: 1rem;
        inline-size: 1rem;
        block-size: 1rem;
      }
    }

    .brand-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.4rem 0.9rem;
      border-radius: 999px;
      background: rgba(6, 182, 212, 0.12);
      border: 1px solid rgba(6, 182, 212, 0.3);
      color: var(--primary, #06b6d4);
      font-size: 0.825rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-block-end: 1rem;

      mat-icon {
        font-size: 1.1rem;
        inline-size: 1.1rem;
        block-size: 1.1rem;
      }
    }

    .login-title {
      font-size: clamp(1.6rem, 3.5vw, 2.1rem);
      font-weight: 800;
      letter-spacing: -0.02em;
      margin: 0 0 0.5rem;
      background: linear-gradient(135deg, #ffffff 30%, var(--primary, #06b6d4));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .login-subtitle {
      font-size: 0.925rem;
      color: var(--text-secondary, #9ca3af);
      margin: 0;
      line-height: 1.5;
    }

    .login-form {
      display: grid;
      gap: 1.25rem;
    }

    .form-field {
      inline-size: 100%;
    }

    :host ::ng-deep {
      .mat-mdc-text-field-wrapper {
        .mat-mdc-form-field-flex {
          display: flex !important;
          align-items: center !important;
          min-height: 56px !important;
        }
      }

      .mat-mdc-form-field-icon-prefix {
        padding-inline: 0.85rem 0.5rem !important;
        color: var(--secondary, #38bdf8) !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;

        .mat-icon {
          font-size: 1.25rem !important;
          inline-size: 1.25rem !important;
          block-size: 1.25rem !important;
          line-height: 1 !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          padding: 0 !important;
          margin: 0 !important;
        }
      }

      .mat-mdc-form-field-infix {
        display: flex !important;
        align-items: center !important;
        padding-top: 14px !important;
        padding-bottom: 14px !important;
        min-height: 56px !important;
      }
    }

    .submit-btn {
      min-block-size: 3.4rem !important;
      border-radius: 999px !important;
      font-size: 1rem !important;
      font-weight: 700 !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 0.6rem !important;
      background: linear-gradient(135deg, var(--primary, #06b6d4), #3b82f6) !important;
      color: #ffffff !important;
      box-shadow: 0 10px 25px -5px rgba(6, 182, 212, 0.4) !important;
      transition: all 200ms ease !important;

      &:hover:not([disabled]) {
        transform: translateY(-2px);
        box-shadow: 0 15px 30px -5px rgba(6, 182, 212, 0.6) !important;
      }

      .spinner {
        display: inline-block;
      }

      .btn-label {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
      }
    }

    .error-banner {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.85rem 1rem;
      border-radius: 0.75rem;
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.4);
      color: #fca5a5;
      font-size: 0.88rem;

      mat-icon {
        color: #ef4444;
        font-size: 1.25rem;
        inline-size: 1.25rem;
        block-size: 1.25rem;
        flex-shrink: 0;
      }
    }

    .login-footer {
      margin-block-start: 1.75rem;
      text-align: center;
      font-size: 0.8rem;
      color: var(--text-secondary, #6b7280);

      strong {
        color: var(--text-primary, #e5e7eb);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminLoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AdminAuthService);
  private readonly router = inject(Router);

  readonly isLoading = signal(false);
  readonly errorMessage = signal('');
  readonly hidePassword = signal(true);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]]
  });

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const { email, password } = this.form.getRawValue();

    this.auth.login(email, password).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.router.navigate(['/admin/dashboard']);
      },
      error: (err) => {
        this.isLoading.set(false);
        const msg =
          err?.error?.message ||
          'Failed to sign in. Please verify your credentials or check backend connection.';
        this.errorMessage.set(msg);
      }
    });
  }
}
