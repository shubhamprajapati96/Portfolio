import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PortfolioService } from '@core/services/portfolio.service';
import { SeoService } from '@core/services/seo.service';
import { SectionHeaderComponent } from '@shared/components/section-header/section-header.component';

@Component({
  selector: 'app-testimonials',
  imports: [MatButtonModule, MatIconModule, SectionHeaderComponent],
  template: `
    <section class="section testimonials-page">
      <div class="container">
        <app-section-header
          eyebrow="Peer & Client Endorsements"
          title="Trusted by product and engineering leaders."
          description="Direct feedback from engineering executives and principal teammates on platform delivery, architecture, and team enablement."
        />

        <div class="testimonial-wrapper">
          <div class="quote-watermark" aria-hidden="true">“</div>
          <article class="testimonial-card">
            <div class="testimonial-quote-icon">
              <mat-icon aria-hidden="true">format_quote</mat-icon>
            </div>

            <blockquote class="testimonial-quote">
              “{{ active().quote }}”
            </blockquote>

            <div class="author-profile">
              <div class="avatar-ring">
                <img [src]="active().avatarUrl" [alt]="active().name" loading="lazy" />
              </div>
              <div class="author-details">
                <h2 class="author-name">{{ active().name }}</h2>
                <p class="author-role">{{ active().role }}</p>
              </div>
            </div>

            <div class="carousel-nav">
              <button
                type="button"
                mat-icon-button
                aria-label="Previous testimonial"
                class="carousel-arrow"
                (click)="previous()"
              >
                <mat-icon aria-hidden="true">chevron_left</mat-icon>
              </button>

              <div class="carousel-dots" role="tablist" aria-label="Testimonial slides">
                @for (item of testimonials(); track item.name; let idx = $index) {
                  <button
                    type="button"
                    role="tab"
                    class="dot-indicator"
                    [class.active]="index() === idx"
                    [attr.aria-selected]="index() === idx"
                    [attr.aria-label]="'Go to testimonial ' + (idx + 1)"
                    (click)="goTo(idx)"
                  ></button>
                }
              </div>

              <button
                type="button"
                mat-icon-button
                aria-label="Next testimonial"
                class="carousel-arrow"
                (click)="next()"
              >
                <mat-icon aria-hidden="true">chevron_right</mat-icon>
              </button>
            </div>
          </article>
        </div>
      </div>
    </section>
  `,
  styles: `
    .testimonials-page {
      position: relative;
    }

    .testimonial-wrapper {
      position: relative;
      max-inline-size: 880px;
      margin-inline: auto;
    }

    .quote-watermark {
      position: absolute;
      inset-inline-start: 1rem;
      inset-block-start: -2rem;
      font-size: 14rem;
      font-family: Georgia, serif;
      color: var(--primary);
      opacity: 0.05;
      line-height: 1;
      pointer-events: none;
      user-select: none;
      z-index: 0;
    }

    .testimonial-card {
      position: relative;
      z-index: 1;
      display: grid;
      justify-items: center;
      gap: clamp(1.25rem, 3vw, 2rem);
      padding: clamp(1.75rem, 5vw, 3.5rem);
      border: 1px solid var(--border-subtle);
      border-radius: 1.75rem;
      background: var(--bg-card);
      box-shadow: var(--shadow-card);
      text-align: center;
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      animation: fadeIn 350ms ease;
    }

    .testimonial-quote-icon {
      display: grid;
      place-items: center;
      inline-size: 3rem;
      block-size: 3rem;
      border-radius: 50%;
      background: var(--bg-pill);
      border: 1px solid var(--border-hover);
      color: var(--primary);

      mat-icon {
        font-size: 1.6rem;
        inline-size: 1.6rem;
        block-size: 1.6rem;
      }
    }

    .testimonial-quote {
      margin: 0;
      color: var(--text-primary);
      font-size: clamp(1.15rem, 2.5vw, 1.65rem);
      line-height: 1.65;
      font-weight: 500;
      letter-spacing: -0.01em;
      max-inline-size: 720px;
    }

    .author-profile {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
    }

    .avatar-ring {
      display: inline-block;
      padding: 3px;
      border-radius: 50%;
      background: var(--gradient-primary);
      box-shadow: 0 4px 14px -2px var(--primary-glow);

      img {
        inline-size: 4.25rem;
        block-size: 4.25rem;
        border-radius: 50%;
        object-fit: cover;
        display: block;
        background: var(--bg-surface);
      }
    }

    .author-details {
      display: grid;
      gap: 0.15rem;

      .author-name {
        margin: 0;
        color: var(--text-primary);
        font-size: 1.2rem;
        font-weight: 700;
      }

      .author-role {
        margin: 0;
        color: var(--secondary);
        font-size: 0.88rem;
        font-weight: 500;
      }
    }

    .carousel-nav {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      margin-block-start: 0.5rem;
    }

    .carousel-arrow {
      color: var(--text-primary) !important;
      background: var(--bg-pill) !important;
      border: 1px solid var(--border-subtle) !important;
      transition: all 180ms ease !important;

      &:hover {
        border-color: var(--border-hover) !important;
        color: var(--primary) !important;
        background: var(--bg-surface-elevated) !important;
      }
    }

    .carousel-dots {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .dot-indicator {
      inline-size: 0.65rem;
      block-size: 0.65rem;
      border-radius: 9999px;
      border: none;
      background: var(--border-subtle);
      cursor: pointer;
      padding: 0;
      transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);

      &:hover {
        background: var(--text-muted);
      }

      &.active {
        inline-size: 1.75rem;
        background: var(--primary);
        box-shadow: 0 0 8px var(--primary-glow);
      }
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(8px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestimonialsComponent {
  private readonly portfolio = inject(PortfolioService);
  private readonly seo = inject(SeoService);
  readonly testimonials = this.portfolio.testimonials;
  readonly index = signal(0);
  readonly active = computed(() => this.testimonials()[this.index()]);

  constructor() {
    this.seo.update({
      title: 'Testimonials | Shubham Prajapati',
      description: 'Testimonials and recommendations from engineering directors, architects, and product leads.'
    });
  }

  next(): void {
    this.index.update((value) => (value + 1) % this.testimonials().length);
  }

  previous(): void {
    this.index.update((value) => (value === 0 ? this.testimonials().length - 1 : value - 1));
  }

  goTo(idx: number): void {
    this.index.set(idx);
  }
}

