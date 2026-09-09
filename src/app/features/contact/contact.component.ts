import { ChangeDetectionStrategy, Component, inject, viewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ContactRequest } from '@core/interfaces/portfolio.interfaces';
import { ContactService } from '@core/services/contact.service';
import { PortfolioService } from '@core/services/portfolio.service';
import { SeoService } from '@core/services/seo.service';
import { SnackbarService } from '@core/services/snackbar.service';
import { ContactFormComponent } from '@shared/components/contact-form/contact-form.component';
import { SectionHeaderComponent } from '@shared/components/section-header/section-header.component';

@Component({
  selector: 'app-contact',
  imports: [ContactFormComponent, MatIconModule, SectionHeaderComponent],
  template: `
    <section class="section contact-page">
      <div class="container">
        <app-section-header
          eyebrow="Initiate Contact"
          title="Let’s build something sharp and durable."
          description="Use the form below for enterprise architecture reviews, signal migrations, design systems, and frontend leadership inquiries."
        />

        <div class="contact-grid">
          <article class="contact-info-card">
            <div class="info-header">
              <h2>Direct Inquiries</h2>
              <div class="availability-pill">
                <span class="pulse-dot"></span>
                <span>{{ profile().availability }}</span>
              </div>
            </div>

            <p class="info-intro">
              Have an urgent initiative or scoping conversation? Reach out directly through any of these channels:
            </p>

            <ul class="contact-links">
              <li>
                <a [href]="'mailto:' + profile().email" class="contact-row">
                  <div class="icon-wrap">
                    <mat-icon aria-hidden="true">alternate_email</mat-icon>
                  </div>
                  <div class="row-text">
                    <span class="label">Email</span>
                    <strong class="value">{{ profile().email }}</strong>
                  </div>
                </a>
              </li>
              <li>
                <div class="contact-row static-row">
                  <div class="icon-wrap">
                    <mat-icon aria-hidden="true">location_on</mat-icon>
                  </div>
                  <div class="row-text">
                    <span class="label">Location</span>
                    <strong class="value">{{ profile().location }}</strong>
                  </div>
                </div>
              </li>
            </ul>

            <div class="sla-notice">
              <mat-icon aria-hidden="true">schedule</mat-icon>
              <span>Typical response time: within 24 business hours.</span>
            </div>
          </article>

          <article class="form-card">
            <div class="form-card-header">
              <h3>Send a Message</h3>
              <p>Fill in the details below and I'll review your project scope.</p>
            </div>
            <app-contact-form (submitted)="send($event)" />
          </article>
        </div>
      </div>
    </section>
  `,
  styles: `
    .contact-page {
      position: relative;
    }

    .contact-grid {
      display: grid;
      gap: clamp(1.5rem, 3vw, 2.5rem);
      align-items: start;
    }

    .contact-info-card,
    .form-card {
      padding: clamp(1.35rem, 4vw, 2.25rem);
      border: 1px solid var(--border-subtle);
      border-radius: 1.5rem;
      background: var(--bg-card);
      box-shadow: var(--shadow-card);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
    }

    .contact-info-card {
      display: grid;
      gap: 1.25rem;
    }

    .info-header {
      display: grid;
      gap: 0.65rem;

      h2 {
        margin: 0;
        color: var(--text-primary);
        font-size: 1.45rem;
        font-weight: 700;
        letter-spacing: -0.01em;
      }
    }

    .availability-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      width: fit-content;
      padding: 0.3rem 0.8rem;
      border-radius: 9999px;
      background: var(--bg-pill);
      border: 1px solid var(--border-hover);
      color: var(--primary);
      font-size: 0.8rem;
      font-weight: 600;
    }

    .pulse-dot {
      inline-size: 0.5rem;
      block-size: 0.5rem;
      border-radius: 50%;
      background: var(--success);
      box-shadow: 0 0 6px var(--success);
    }

    .info-intro {
      margin: 0;
      color: var(--text-secondary);
      font-size: 0.92rem;
      line-height: 1.65;
    }

    .contact-links {
      display: grid;
      gap: 0.85rem;
      margin: 0;
      padding: 0;
      list-style: none;
    }

    .contact-row {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.85rem 1rem;
      border-radius: 1rem;
      background: var(--bg-surface-elevated);
      border: 1px solid var(--border-subtle);
      color: inherit;
      text-decoration: none;
      transition: all 180ms ease;

      &:hover:not(.static-row) {
        border-color: var(--border-hover);
        background: var(--bg-pill);
        transform: translateX(4px);
      }
    }

    .icon-wrap {
      display: grid;
      place-items: center;
      inline-size: 2.5rem;
      block-size: 2.5rem;
      border-radius: 0.75rem;
      background: var(--bg-pill);
      color: var(--primary);
      flex-shrink: 0;

      mat-icon {
        font-size: 1.25rem;
        inline-size: 1.25rem;
        block-size: 1.25rem;
      }
    }

    .row-text {
      display: grid;
      gap: 0.1rem;

      .label {
        color: var(--text-muted);
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .value {
        color: var(--text-primary);
        font-size: 0.92rem;
        font-weight: 600;
      }
    }

    .sla-notice {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      border-radius: 0.85rem;
      background: var(--bg-pill);
      color: var(--text-muted);
      font-size: 0.82rem;
      font-weight: 500;

      mat-icon {
        color: var(--secondary);
        font-size: 1.1rem;
        inline-size: 1.1rem;
        block-size: 1.1rem;
      }
    }

    .form-card {
      display: grid;
      gap: 1.5rem;
    }

    .form-card-header {
      display: grid;
      gap: 0.35rem;

      h3 {
        margin: 0;
        color: var(--text-primary);
        font-size: 1.35rem;
        font-weight: 700;
      }

      p {
        margin: 0;
        color: var(--text-secondary);
        font-size: 0.9rem;
      }
    }

    @media (min-width: 56rem) {
      .contact-grid {
        grid-template-columns: 0.9fr 1.1fr;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactComponent {
  private readonly portfolio = inject(PortfolioService);
  private readonly contactService = inject(ContactService);
  private readonly snackbar = inject(SnackbarService);
  private readonly seo = inject(SeoService);
  private readonly formComponent = viewChild(ContactFormComponent);

  readonly profile = this.portfolio.profile;

  constructor() {
    this.seo.update({
      title: 'Contact | Shubham Prajapati',
      description: 'Contact Shubham Prajapati for SaaS development, microservices architecture, and API integration inquiries.'
    });
  }

  send(request: ContactRequest): void {
    this.contactService.sendMessage(request).subscribe({
      next: ({ name }) => {
        this.formComponent()?.markSuccess(name);
        this.snackbar.success('Message sent successfully.');
      },
      error: () => {
        this.formComponent()?.markFailure();
        this.snackbar.error('Something went wrong. Please try again.');
      }
    });
  }
}

