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
          description="Over 7 years of software engineering leadership across conversational AI, microservices architecture, and scalable SaaS platforms."
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
        </div>

        <!-- ACADEMIC QUALIFICATIONS SECTION -->
        <div class="qualifications-wrapper">
          <div class="qualifications-header-wrap">
            <div class="eyebrow-badge">
              <span class="pulse-dot"></span>
              <span>Academic Background</span>
            </div>
            <h2 class="section-heading-title">Education & Qualifications</h2>
            <p class="section-heading-desc">
              Formal engineering credentials and computer science foundation graduated with First Class Distinction.
            </p>
          </div>

          <div class="qualification-card-wrap">
            <article class="qualification-card">
              <div class="card-ambient-glow" aria-hidden="true"></div>

              <header class="qualification-header">
                <div class="institution-brand">
                  <div class="institution-icon-disc">
                    <mat-icon aria-hidden="true">school</mat-icon>
                  </div>
                  <div class="institution-details">
                    <div class="brand-badge-row">
                      <span class="arrow-indicator">→</span>
                      <span class="brand-tag">AKTU</span>
                      <span class="distinction-badge">
                        <mat-icon aria-hidden="true">verified</mat-icon>
                        <span>2014 – 2018 · Distinction (75.8%)</span>
                      </span>
                    </div>
                    <h3 class="degree-title">{{ education()[0].degree }}</h3>
                    <p class="university-name">{{ education()[0].school }}</p>
                  </div>
                </div>
              </header>

              <!-- Mentioned in Quotes with Elegant Styling -->
              <div class="qualification-quote-container">
                <div class="quote-symbol" aria-hidden="true">“</div>
                <blockquote class="qualification-quote">
                  <p class="quote-text">
                    “Graduated with 75.8% First Class with Distinction. Strong foundation in Software Engineering, Data Structures, Relational Database Management Systems, and Microservices Architecture.”
                  </p>
                </blockquote>
              </div>

              <!-- Core Engineering Focus Pillars -->
              <div class="academic-pillars-row" aria-label="Core areas of academic study">
                <span class="pillar-tag">
                  <mat-icon aria-hidden="true">code</mat-icon>
                  <span>Software Engineering</span>
                </span>
                <span class="pillar-tag">
                  <mat-icon aria-hidden="true">account_tree</mat-icon>
                  <span>Data Structures & Algorithms</span>
                </span>
                <span class="pillar-tag">
                  <mat-icon aria-hidden="true">storage</mat-icon>
                  <span>Relational Database Management</span>
                </span>
                <span class="pillar-tag">
                  <mat-icon aria-hidden="true">hub</mat-icon>
                  <span>Microservices Architecture</span>
                </span>
              </div>
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

    /* ==========================================================================
       QUALIFICATIONS SECTION
       ========================================================================== */
    .qualifications-wrapper {
      margin-block-start: clamp(3.5rem, 6vw, 5rem);
      padding-block-start: clamp(2rem, 4vw, 3rem);
    }

    .qualifications-header-wrap {
      display: grid;
      gap: 0.5rem;
      max-inline-size: 800px;
      margin-block-end: 2rem;
    }

    .qualification-card-wrap {
      max-inline-size: 920px;
    }

    .qualification-card {
      position: relative;
      border-radius: 1.75rem;
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      box-shadow: 0 16px 40px -12px var(--primary-glow);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      padding: clamp(1.5rem, 3.5vw, 2.5rem);
      overflow: hidden;
      transition: transform 250ms cubic-bezier(0.4, 0, 0.2, 1),
                  border-color 250ms ease,
                  box-shadow 250ms ease;

      &:hover {
        transform: translateY(-4px);
        border-color: var(--border-hover);
        box-shadow: 0 20px 48px -10px var(--primary-glow);

        .institution-icon-disc {
          transform: scale(1.08) rotate(3deg);
          box-shadow: 0 0 24px var(--primary-glow);
        }
      }
    }

    .card-ambient-glow {
      position: absolute;
      top: -30%;
      left: -20%;
      width: 60%;
      height: 70%;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(6, 182, 212, 0.12), transparent 70%);
      pointer-events: none;
      z-index: 0;
    }

    .qualification-header {
      position: relative;
      z-index: 1;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1.25rem;
      padding-block-end: 1.25rem;
      border-block-end: 1px solid var(--border-subtle);
    }

    .institution-brand {
      display: flex;
      align-items: flex-start;
      gap: 1.25rem;
      min-inline-size: 0;
    }

    .institution-icon-disc {
      display: grid;
      place-items: center;
      inline-size: 3.5rem;
      block-size: 3.5rem;
      border-radius: 1rem;
      background: var(--bg-pill);
      border: 1px solid var(--border-hover);
      color: var(--primary);
      box-shadow: 0 4px 16px -2px var(--primary-glow);
      flex-shrink: 0;
      transition: all 250ms ease;

      mat-icon {
        font-size: 1.85rem;
        inline-size: 1.85rem;
        block-size: 1.85rem;
      }
    }

    .institution-details {
      display: grid;
      gap: 0.35rem;
      min-inline-size: 0;
    }

    .brand-badge-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.5rem;
    }

    .brand-tag {
      font-size: 0.85rem;
      font-weight: 800;
      letter-spacing: 0.05em;
      color: var(--primary);
      text-transform: uppercase;
    }

    .distinction-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      background: rgba(6, 182, 212, 0.1);
      border: 1px solid rgba(6, 182, 212, 0.3);
      color: var(--primary);
      font-size: 0.78rem;
      font-weight: 700;

      mat-icon {
        font-size: 1rem;
        inline-size: 1rem;
        block-size: 1rem;
      }
    }

    .degree-title {
      margin: 0;
      font-size: clamp(1.2rem, 2.5vw, 1.45rem);
      font-weight: 700;
      color: var(--text-primary);
      letter-spacing: -0.01em;
      line-height: 1.3;
    }

    .university-name {
      margin: 0;
      font-size: 0.95rem;
      font-weight: 500;
      color: var(--text-secondary);
    }

    /* Mentioned in Quotes */
    .qualification-quote-container {
      position: relative;
      z-index: 1;
      margin-block: 1.5rem;
      padding: 1.35rem 1.75rem;
      border-radius: 1.25rem;
      background: var(--bg-surface-elevated);
      border: 1px solid var(--border-subtle);
      border-inline-start: 4px solid var(--primary);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
    }

    .quote-symbol {
      position: absolute;
      top: -0.25rem;
      left: 1rem;
      font-family: Georgia, serif;
      font-size: 4rem;
      line-height: 1;
      color: var(--primary);
      opacity: 0.15;
      user-select: none;
      pointer-events: none;
    }

    .qualification-quote {
      margin: 0;
      padding: 0;
      position: relative;
      z-index: 1;
    }

    .quote-text {
      margin: 0;
      font-size: clamp(0.95rem, 1.8vw, 1.05rem);
      font-style: italic;
      font-weight: 500;
      color: var(--text-primary);
      line-height: 1.7;
    }

    /* Academic Pillars Row */
    .academic-pillars-row {
      position: relative;
      z-index: 1;
      display: flex;
      flex-wrap: wrap;
      gap: 0.65rem;
      align-items: center;
    }

    .pillar-tag {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.45rem 0.95rem;
      border-radius: 9999px;
      background: var(--bg-pill);
      border: 1px solid var(--border-subtle);
      color: var(--text-secondary);
      font-size: 0.82rem;
      font-weight: 600;
      transition: all 180ms ease;

      mat-icon {
        font-size: 1.05rem;
        inline-size: 1.05rem;
        block-size: 1.05rem;
        color: var(--primary);
      }

      &:hover {
        background: var(--bg-surface-elevated);
        border-color: var(--border-hover);
        color: var(--text-primary);
        transform: translateY(-2px);
      }
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
      description: 'Professional Software Engineering & Microservices timeline for Shubham Prajapati.'
    });
  }
}
