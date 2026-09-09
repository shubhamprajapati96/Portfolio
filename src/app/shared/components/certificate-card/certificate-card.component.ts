import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Certification } from '@core/interfaces/portfolio.interfaces';

@Component({
  selector: 'app-certificate-card',
  imports: [MatButtonModule, MatIconModule],
  template: `
    <article class="certificate-card">
      <div class="card-header">
        <div class="cert-icon-wrap">
          <mat-icon aria-hidden="true">verified</mat-icon>
        </div>
        <span class="cert-year">{{ certification().date }}</span>
      </div>

      <div class="card-body">
        <h2 class="cert-title">{{ certification().title }}</h2>
        <p class="cert-issuer">
          <mat-icon aria-hidden="true">domain</mat-icon>
          <span>{{ certification().issuer }}</span>
        </p>
      </div>

      <div class="card-footer">
        <a mat-button [href]="certification().credentialUrl" target="_blank" rel="noreferrer" class="verify-btn">
          <span>Verify Credential</span>
          <mat-icon aria-hidden="true">open_in_new</mat-icon>
        </a>
      </div>
    </article>
  `,
  styles: `
    :host {
      display: block;
      height: 100%;
    }

    .certificate-card {
      display: flex;
      flex-direction: column;
      height: 100%;
      gap: 1.15rem;
      padding: 1.5rem;
      border: 1px solid var(--border-subtle);
      border-radius: 1.375rem;
      background: var(--bg-card);
      box-shadow: var(--shadow-card);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      transition: transform 250ms cubic-bezier(0.4, 0, 0.2, 1),
                  border-color 250ms ease,
                  box-shadow 250ms ease;

      &:hover {
        transform: translateY(-4px);
        border-color: var(--border-hover);
        box-shadow: var(--shadow-hover);

        .cert-icon-wrap {
          transform: scale(1.08) rotate(4deg);
        }
      }
    }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .cert-icon-wrap {
      display: grid;
      place-items: center;
      inline-size: 2.75rem;
      block-size: 2.75rem;
      border-radius: 0.85rem;
      background: var(--bg-pill);
      border: 1px solid var(--border-hover);
      color: var(--primary);
      box-shadow: 0 4px 14px -2px var(--primary-glow);
      transition: transform 250ms ease;

      mat-icon {
        font-size: 1.4rem;
        inline-size: 1.4rem;
        block-size: 1.4rem;
      }
    }

    .cert-year {
      display: inline-flex;
      align-items: center;
      padding: 0.25rem 0.65rem;
      border-radius: 9999px;
      background: var(--bg-surface-elevated);
      border: 1px solid var(--border-subtle);
      color: var(--text-muted);
      font-size: 0.78rem;
      font-weight: 700;
    }

    .card-body {
      display: grid;
      gap: 0.5rem;
      flex: 1;
    }

    .cert-title {
      margin: 0;
      color: var(--text-primary);
      font-size: 1.15rem;
      font-weight: 700;
      line-height: 1.35;
    }

    .cert-issuer {
      margin: 0;
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      color: var(--text-secondary);
      font-size: 0.9rem;

      mat-icon {
        color: var(--secondary);
        font-size: 1rem;
        inline-size: 1rem;
        block-size: 1rem;
      }
    }

    .card-footer {
      padding-block-start: 0.85rem;
      border-block-start: 1px solid var(--border-subtle);
    }

    .verify-btn {
      inline-size: 100%;
      justify-content: space-between !important;
      border-radius: 0.75rem !important;
      font-size: 0.86rem !important;
      font-weight: 600 !important;
      color: var(--primary) !important;

      mat-icon {
        font-size: 1.05rem;
        inline-size: 1.05rem;
        block-size: 1.05rem;
      }

      &:hover {
        background: var(--bg-pill) !important;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CertificateCardComponent {
  readonly certification = input.required<Certification>();
}

