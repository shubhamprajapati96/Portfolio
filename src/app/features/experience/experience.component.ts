import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { PortfolioService } from '@core/services/portfolio.service';
import { SeoService } from '@core/services/seo.service';
import { staggerCards } from '@shared/animations/page.animations';
import { SectionHeaderComponent } from '@shared/components/section-header/section-header.component';
import { TechIconComponent } from '@shared/components/tech-icon/tech-icon.component';

@Component({
  selector: 'app-experience',
  imports: [MatChipsModule, MatIconModule, SectionHeaderComponent, TechIconComponent],
  template: `
    <section class="section experience-page">
      <div class="container">
        <app-section-header
          eyebrow="Career Journey"
          title="Working Experience"
          description="Over 7 years of full-stack engineering leadership across conversational AI, hospital optimization, microservices architecture, and scalable SaaS platforms."
        />

        <div class="timeline-container">
          <!-- Continuous Animated Dotted Timeline Track -->
          <div class="timeline-spine" aria-hidden="true"></div>

          <!-- Timeline Node 1: DEVtrust -->
          <div class="timeline-item">
            <div class="node-anchor">
              <div class="node-marker">
                <mat-icon aria-hidden="true">domain</mat-icon>
              </div>
            </div>

            <article class="timeline-content-card">
              <header class="timeline-card-header">
                <div class="node-brand-banner">
                  <span class="arrow-indicator">→</span>
                  <span class="brand-text">DEVtrust</span>
                  <span class="tenure-badge">June 2021 – August 2026 · 5+ Years</span>
                </div>
                <h3 class="role-heading">{{ experiences()[0].position }}</h3>
                <div class="company-subline">
                  <strong class="full-company-name">{{ experiences()[0].company }}</strong>
                  <span class="dot-separator">·</span>
                  <span class="company-location">
                    <mat-icon aria-hidden="true">location_on</mat-icon>
                    {{ experiences()[0].location }}
                  </span>
                </div>
              </header>

              <div class="timeline-highlights">
                <h4 class="highlights-title">Key Projects & Architecture Deliverables:</h4>
                <ul class="responsibilities-list">
                  @for (resp of experiences()[0].responsibilities; track resp) {
                    <li>
                      <mat-icon class="check-bullet" aria-hidden="true">check_circle</mat-icon>
                      <span>{{ resp }}</span>
                    </li>
                  }
                </ul>
              </div>

              <div class="tech-chip-cloud" aria-label="Technologies used at DEVtrust">
                @for (tech of experiences()[0].technologies; track tech) {
                  <span class="tech-badge">
                    <app-tech-icon [name]="tech" [size]="13" />
                    <span>{{ tech }}</span>
                  </span>
                }
              </div>
            </article>
          </div>

          <!-- Timeline Node 2: Tarkash Technology -->
          <div class="timeline-item">
            <div class="node-anchor">
              <div class="node-marker">
                <mat-icon aria-hidden="true">corporate_fare</mat-icon>
              </div>
            </div>

            <article class="timeline-content-card">
              <header class="timeline-card-header">
                <div class="node-brand-banner">
                  <span class="arrow-indicator">→</span>
                  <span class="brand-text">Tarkash</span>
                  <span class="tenure-badge">April 2019 – June 2021 · 2 Yrs 3 Mos</span>
                </div>
                <h3 class="role-heading">{{ experiences()[1].position }}</h3>
                <div class="company-subline">
                  <strong class="full-company-name">{{ experiences()[1].company }}</strong>
                  <span class="dot-separator">·</span>
                  <span class="company-location">
                    <mat-icon aria-hidden="true">location_on</mat-icon>
                    {{ experiences()[1].location }}
                  </span>
                </div>
              </header>

              <div class="timeline-highlights">
                <h4 class="highlights-title">Key Projects & Deliverables:</h4>
                <ul class="responsibilities-list">
                  @for (resp of experiences()[1].responsibilities; track resp) {
                    <li>
                      <mat-icon class="check-bullet" aria-hidden="true">check_circle</mat-icon>
                      <span>{{ resp }}</span>
                    </li>
                  }
                </ul>
              </div>

              <div class="tech-chip-cloud" aria-label="Technologies used at Tarkash">
                @for (tech of experiences()[1].technologies; track tech) {
                  <span class="tech-badge">
                    <app-tech-icon [name]="tech" [size]="13" />
                    <span>{{ tech }}</span>
                  </span>
                }
              </div>
            </article>
          </div>

          <!-- Timeline Node 3: Academic Foundation -->
          <div class="timeline-item education-node">
            <div class="node-anchor">
              <div class="node-marker edu-marker">
                <mat-icon aria-hidden="true">school</mat-icon>
              </div>
            </div>

            <article class="timeline-content-card edu-card">
              <header class="timeline-card-header">
                <div class="node-brand-banner edu-banner">
                  <span class="arrow-indicator">→</span>
                  <span class="brand-text">AKTU</span>
                  <span class="tenure-badge">2014 – 2018 · Distinction (75.8%)</span>
                </div>
                <h3 class="role-heading">{{ education()[0].degree }}</h3>
                <div class="company-subline">
                  <strong class="full-company-name">{{ education()[0].school }}</strong>
                </div>
              </header>
              <p class="edu-summary">{{ education()[0].summary }}</p>
            </article>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: `
    .experience-page {
      position: relative;
      padding-block: clamp(3rem, 6vw, 5rem);
    }

    .timeline-container {
      position: relative;
      display: grid;
      gap: clamp(2.5rem, 5vw, 4rem);
      padding-inline-start: clamp(1rem, 4vw, 3.5rem);
      margin-block-start: clamp(2rem, 4vw, 3.5rem);
    }

    /* CONTINUOUS ANIMATED DOTTED LINE */
    .timeline-spine {
      position: absolute;
      inset-block-start: 1.75rem;
      inset-block-end: 2rem;
      inset-inline-start: clamp(1.75rem, 4.5vw, 4.25rem);
      inline-size: 4px;
      background: repeating-linear-gradient(
        to bottom,
        var(--primary) 0px,
        var(--primary) 8px,
        transparent 8px,
        transparent 22px
      );
      background-size: 100% 44px;
      animation: timelineDottedFlow 1.35s linear infinite;
      box-shadow: 0 0 14px var(--primary-glow);
      border-radius: 9999px;
      pointer-events: none;
      z-index: 1;
    }

    @keyframes timelineDottedFlow {
      0% {
        background-position-y: 0px;
      }
      100% {
        background-position-y: 44px;
      }
    }

    .timeline-item {
      position: relative;
      display: grid;
      grid-template-columns: auto 1fr;
      gap: clamp(1.25rem, 3vw, 2.5rem);
      align-items: start;
      z-index: 2;
    }

    .node-anchor {
      position: relative;
      display: flex;
      justify-content: center;
    }

    .node-marker {
      position: relative;
      z-index: 2;
      display: grid;
      place-items: center;
      inline-size: 3.25rem;
      block-size: 3.25rem;
      border-radius: 50%;
      background: var(--bg-surface-elevated);
      border: 2px solid var(--primary);
      box-shadow: 0 0 24px var(--primary-glow);
      color: var(--primary);
      flex-shrink: 0;
      transition: transform 250ms ease, box-shadow 250ms ease;

      mat-icon {
        font-size: 1.5rem;
        inline-size: 1.5rem;
        block-size: 1.5rem;
      }

      &::after {
        content: '';
        position: absolute;
        inset: -6px;
        border-radius: 50%;
        border: 2px dashed var(--primary);
        opacity: 0.65;
        animation: rotateRing 9s linear infinite;
      }
    }

    @keyframes rotateRing {
      to {
        transform: rotate(360deg);
      }
    }

    .timeline-item:hover .node-marker {
      transform: scale(1.12);
      box-shadow: 0 0 35px var(--primary);
    }

    .edu-marker {
      border-color: var(--accent);
      color: var(--accent);
      box-shadow: 0 0 20px var(--accent-glow);

      &::after {
        border-color: var(--accent);
      }
    }

    .timeline-content-card {
      display: grid;
      gap: 1.25rem;
      padding: clamp(1.5rem, 3.5vw, 2.25rem);
      border: 1px solid var(--border-subtle);
      border-radius: 1.5rem;
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
      }
    }

    .timeline-card-header {
      display: grid;
      gap: 0.5rem;
    }

    .node-brand-banner {
      display: inline-flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.65rem;
      width: fit-content;
      padding: 0.35rem 0.95rem;
      border-radius: 9999px;
      background: var(--bg-pill);
      border: 1px solid var(--border-hover);
      color: var(--primary);
      font-size: 0.88rem;
      font-weight: 700;

      .arrow-indicator {
        font-size: 1.15rem;
        line-height: 1;
        color: var(--primary);
        animation: arrowShift 1.6s ease-in-out infinite;
      }

      .brand-text {
        letter-spacing: 0.02em;
      }

      .tenure-badge {
        color: var(--text-muted);
        font-weight: 500;
        font-size: 0.8rem;
      }
    }

    @keyframes arrowShift {
      0%, 100% {
        transform: translateX(0);
      }
      50% {
        transform: translateX(4px);
      }
    }

    .edu-banner {
      border-color: var(--accent);
      color: var(--accent);

      .arrow-indicator {
        color: var(--accent);
      }
    }

    .role-heading {
      margin: 0;
      color: var(--text-primary);
      font-size: clamp(1.35rem, 2.5vw, 1.85rem);
      font-weight: 800;
      letter-spacing: -0.01em;
    }

    .company-subline {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.5rem;
      color: var(--text-secondary);
      font-size: 0.92rem;

      .full-company-name {
        color: var(--text-primary);
        font-weight: 600;
      }

      .dot-separator {
        color: var(--text-muted);
      }

      .company-location {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
        color: var(--text-muted);

        mat-icon {
          font-size: 1rem;
          inline-size: 1rem;
          block-size: 1rem;
        }
      }
    }

    .timeline-highlights {
      display: grid;
      gap: 0.75rem;

      .highlights-title {
        margin: 0;
        font-size: 0.95rem;
        font-weight: 700;
        color: var(--primary);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
    }

    .responsibilities-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: grid;
      gap: 0.65rem;

      li {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 0.65rem;
        align-items: start;
        color: var(--text-secondary);
        font-size: 0.93rem;
        line-height: 1.6;

        .check-bullet {
          color: var(--primary);
          font-size: 1.15rem;
          inline-size: 1.15rem;
          block-size: 1.15rem;
          margin-block-start: 0.15rem;
        }
      }
    }

    .tech-chip-cloud {
      display: flex;
      flex-wrap: wrap;
      gap: 0.45rem;
      padding-block-start: 0.75rem;
      border-block-start: 1px solid var(--border-subtle);
    }

    .tech-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.25rem 0.7rem;
      border-radius: 9999px;
      font-size: 0.78rem;
      font-weight: 600;
      background: var(--bg-surface-elevated);
      color: var(--text-secondary);
      border: 1px solid var(--border-subtle);
      transition: all 150ms ease;

      &:hover {
        border-color: var(--border-hover);
        color: var(--primary);
      }
    }

    .edu-card {
      border-color: rgba(129, 140, 248, 0.25);
    }

    .edu-summary {
      margin: 0;
      color: var(--text-secondary);
      font-size: 0.94rem;
      line-height: 1.65;
    }
  `,
  animations: [staggerCards],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExperienceComponent {
  private readonly portfolio = inject(PortfolioService);
  private readonly seo = inject(SeoService);
  readonly experiences = this.portfolio.experiences;
  readonly education = this.portfolio.education;

  constructor() {
    this.seo.update({
      title: 'Experience | Shubham Prajapati',
      description: 'Professional Full Stack & Microservices engineering timeline for Shubham Prajapati.'
    });
  }
}
