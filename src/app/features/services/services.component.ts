import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PortfolioService } from '@core/services/portfolio.service';
import { SeoService } from '@core/services/seo.service';
import { staggerCards } from '@shared/animations/page.animations';
import { SectionHeaderComponent } from '@shared/components/section-header/section-header.component';

@Component({
  selector: 'app-services',
  imports: [MatButtonModule, MatIconModule, RouterLink, SectionHeaderComponent],
  template: `
    <section class="section services-page">
      <div class="container">
        <app-section-header
          eyebrow="Specialized Offerings"
          title="Senior frontend support from strategy to production."
          description="High-leverage engineering services for organizations requiring modern Angular expertise, accessible design systems, resilient integrations, and deep performance tuning."
        />

        <div class="grid-auto services-grid" @staggerCards>
          @for (service of services(); track service.title) {
            <article class="stagger-item service-card">
              <div class="service-icon-wrap">
                <mat-icon aria-hidden="true">{{ service.icon }}</mat-icon>
              </div>
              <div class="service-body">
                <h2>{{ service.title }}</h2>
                <p>{{ service.description }}</p>
              </div>
              <div class="service-footer">
                <a mat-button routerLink="/contact" class="discuss-btn">
                  <span>Discuss Project</span>
                  <mat-icon aria-hidden="true">arrow_forward</mat-icon>
                </a>
              </div>
            </article>
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    .services-page {
      position: relative;
    }

    .services-grid {
      align-items: stretch;
    }

    .service-card {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      padding: clamp(1.35rem, 3vw, 1.85rem);
      border: 1px solid var(--border-subtle);
      border-radius: 1.375rem;
      background: var(--bg-card);
      box-shadow: var(--shadow-card);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      transition: transform 250ms ease, border-color 250ms ease, box-shadow 250ms ease;

      &:hover {
        transform: translateY(-5px);
        border-color: var(--border-hover);
        box-shadow: var(--shadow-hover);

        .service-icon-wrap {
          transform: scale(1.08) rotate(3deg);
        }

        .discuss-btn {
          color: var(--primary) !important;
        }
      }
    }

    .service-icon-wrap {
      display: grid;
      place-items: center;
      inline-size: 3.25rem;
      block-size: 3.25rem;
      border-radius: 1rem;
      background: var(--bg-pill);
      border: 1px solid var(--border-hover);
      color: var(--primary);
      transition: transform 250ms ease;

      mat-icon {
        font-size: 1.6rem;
        inline-size: 1.6rem;
        block-size: 1.6rem;
      }
    }

    .service-body {
      display: grid;
      gap: 0.65rem;
      flex: 1;

      h2 {
        margin: 0;
        color: var(--text-primary);
        font-size: 1.25rem;
        font-weight: 700;
        letter-spacing: -0.01em;
      }

      p {
        margin: 0;
        color: var(--text-secondary);
        font-size: 0.92rem;
        line-height: 1.7;
      }
    }

    .service-footer {
      padding-block-start: 0.75rem;
      border-block-start: 1px solid var(--border-subtle);
    }

    .discuss-btn {
      color: var(--text-secondary) !important;
      padding-inline: 0 !important;
      font-weight: 600 !important;
      font-size: 0.88rem !important;

      mat-icon {
        margin-inline-start: 0.25rem;
        font-size: 1.1rem;
        inline-size: 1.1rem;
        block-size: 1.1rem;
        transition: transform 180ms ease;
      }

      &:hover mat-icon {
        transform: translateX(4px);
      }
    }
  `,
  animations: [staggerCards],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServicesComponent {
  private readonly portfolio = inject(PortfolioService);
  private readonly seo = inject(SeoService);
  readonly services = this.portfolio.services;

  constructor() {
    this.seo.update({
      title: 'Services | Shubham Prajapati',
      description: 'Full-Stack SaaS development, microservices architecture, API integrations, and modern UI/UX engineering services.'
    });
  }
}

