import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PortfolioService } from '@core/services/portfolio.service';
import { SeoService } from '@core/services/seo.service';
import { staggerCards } from '@shared/animations/page.animations';
import { SectionHeaderComponent } from '@shared/components/section-header/section-header.component';

@Component({
  selector: 'app-achievements',
  imports: [MatIconModule, SectionHeaderComponent],
  template: `
    <section class="section achievements-page">
      <div class="container">
        <app-section-header
          eyebrow="Milestones & Recognition"
          title="Business outcomes backed by frontend craft."
          description="Key milestones where architecture, design systems, and rigorous quality engineering created measurable organizational impact."
        />

        <div class="achievement-list" @staggerCards>
          @for (achievement of achievements(); track achievement.title) {
            <article class="stagger-item achievement-card">
              <div class="achievement-icon-wrap">
                <mat-icon aria-hidden="true">emoji_events</mat-icon>
              </div>
              <div class="achievement-content">
                <div class="achievement-header">
                  <span class="achievement-date">{{ achievement.date }}</span>
                </div>
                <h2>{{ achievement.title }}</h2>
                <p>{{ achievement.description }}</p>
              </div>
            </article>
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    .achievements-page {
      position: relative;
    }

    .achievement-list {
      display: grid;
      gap: 1.25rem;
    }

    .achievement-card {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: clamp(1rem, 3vw, 1.5rem);
      padding: clamp(1.25rem, 3vw, 1.75rem);
      border: 1px solid var(--border-subtle);
      border-radius: 1.375rem;
      background: var(--bg-card);
      box-shadow: var(--shadow-card);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      transition: transform 200ms ease, border-color 200ms ease, box-shadow 200ms ease;

      &:hover {
        transform: translateY(-3px);
        border-color: var(--border-hover);
        box-shadow: var(--shadow-hover);
      }
    }

    .achievement-icon-wrap {
      display: grid;
      place-items: center;
      inline-size: 3.25rem;
      block-size: 3.25rem;
      border-radius: 1rem;
      background: rgba(245, 158, 11, 0.12);
      border: 1px solid rgba(245, 158, 11, 0.3);
      color: #f59e0b;
      box-shadow: 0 4px 16px -2px rgba(245, 158, 11, 0.25);

      mat-icon {
        font-size: 1.6rem;
        inline-size: 1.6rem;
        block-size: 1.6rem;
      }
    }

    .achievement-content {
      display: grid;
      gap: 0.45rem;

      h2 {
        margin: 0;
        color: var(--text-primary);
        font-size: 1.22rem;
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

    .achievement-header {
      display: flex;
      align-items: center;
    }

    .achievement-date {
      display: inline-flex;
      padding: 0.2rem 0.65rem;
      border-radius: 9999px;
      background: var(--bg-pill);
      color: var(--primary);
      font-size: 0.78rem;
      font-weight: 700;
    }

    @media (max-width: 36rem) {
      .achievement-card {
        grid-template-columns: 1fr;
      }
    }
  `,
  animations: [staggerCards],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AchievementsComponent {
  private readonly portfolio = inject(PortfolioService);
  private readonly seo = inject(SeoService);
  readonly achievements = this.portfolio.achievements;

  constructor() {
    this.seo.update({
      title: 'Achievements | Shubham Prajapati',
      description: 'Software engineering achievements and scalable SaaS delivery milestones for Shubham Prajapati.'
    });
  }
}

