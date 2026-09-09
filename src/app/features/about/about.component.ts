import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { PortfolioService } from '@core/services/portfolio.service';
import { SeoService } from '@core/services/seo.service';
import { SectionHeaderComponent } from '@shared/components/section-header/section-header.component';

@Component({
  selector: 'app-about',
  imports: [MatButtonModule, MatIconModule, MatTabsModule, SectionHeaderComponent],
  template: `
    <section class="section about-page">
      <div class="container">
        <app-section-header
          eyebrow="About Me"
          title="Architecture-minded engineer with product taste."
          [description]="profile().summary"
        />

        <div class="about-grid">
          <article class="panel philosophy-panel">
            <div class="panel-icon-wrap">
              <mat-icon aria-hidden="true">engineering</mat-icon>
            </div>
            <h2>Engineering Philosophy</h2>
            <p>
              I build scalable, high-performance SaaS applications and enterprise systems: clean microservices architecture,
              resilient RESTful APIs, robust database schema design, and seamless third-party API integrations that scale reliably under production load.
            </p>
            <div class="panel-actions">
              <a mat-flat-button color="primary" [href]="profile().resumeUrl" download class="resume-download-btn">
                <mat-icon aria-hidden="true">download</mat-icon>
                <span>Download Resume</span>
              </a>
            </div>
          </article>

          <article class="panel info-panel">
            <div class="panel-icon-wrap">
              <mat-icon aria-hidden="true">person_pin</mat-icon>
            </div>
            <h2>Key Details</h2>
            <dl class="info-list">
              <div class="info-item">
                <dt><mat-icon aria-hidden="true">mail</mat-icon> Email</dt>
                <dd>{{ profile().email }}</dd>
              </div>
              <div class="info-item">
                <dt><mat-icon aria-hidden="true">call</mat-icon> Phone</dt>
                <dd>{{ profile().phone }}</dd>
              </div>
              <div class="info-item">
                <dt><mat-icon aria-hidden="true">location_on</mat-icon> Location</dt>
                <dd>{{ profile().location }}</dd>
              </div>
              <div class="info-item">
                <dt><mat-icon aria-hidden="true">event_available</mat-icon> Availability</dt>
                <dd>{{ profile().availability }}</dd>
              </div>
            </dl>
          </article>
        </div>

        <div class="tabs-container">
          <mat-tab-group mat-stretch-tabs="false" dynamicHeight class="custom-tabs">
            <mat-tab label="Career Timeline">
              <div class="tab-grid">
                @for (item of experiences(); track item.company) {
                  <article class="timeline-card">
                    <div class="timeline-card-header">
                      <span class="duration-tag">{{ item.duration }}</span>
                      <span class="location-tag">{{ item.location }}</span>
                    </div>
                    <h3>{{ item.position }}</h3>
                    <strong class="company-name">{{ item.company }}</strong>
                    <ul class="resp-list">
                      @for (resp of item.responsibilities.slice(0, 2); track resp) {
                        <li>{{ resp }}</li>
                      }
                    </ul>
                  </article>
                }
              </div>
            </mat-tab>

            <mat-tab label="Education & Foundation">
              <div class="tab-grid">
                @for (item of education(); track item.school) {
                  <article class="timeline-card education-card">
                    <div class="timeline-card-header">
                      <span class="duration-tag">{{ item.duration }}</span>
                      <mat-icon class="edu-icon" aria-hidden="true">school</mat-icon>
                    </div>
                    <h3>{{ item.degree }}</h3>
                    <strong class="company-name">{{ item.school }}</strong>
                    <p class="edu-summary">{{ item.summary }}</p>
                  </article>
                }
              </div>
            </mat-tab>
          </mat-tab-group>
        </div>
      </div>
    </section>
  `,
  styles: `
    .about-grid {
      display: grid;
      gap: clamp(1rem, 2.5vw, 1.75rem);
      margin-block-end: 2.5rem;
    }

    .panel {
      display: flex;
      flex-direction: column;
      gap: 1.15rem;
      padding: clamp(1.25rem, 3vw, 2rem);
      border: 1px solid var(--border-subtle);
      border-radius: 1.375rem;
      background: var(--bg-card);
      box-shadow: var(--shadow-card);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      transition: transform 250ms ease, border-color 250ms ease, box-shadow 250ms ease;

      &:hover {
        border-color: var(--border-hover);
        box-shadow: var(--shadow-hover);
      }

      h2 {
        margin: 0;
        color: var(--text-primary);
        font-size: 1.35rem;
        font-weight: 700;
      }

      p {
        margin: 0;
        color: var(--text-secondary);
        font-size: 0.95rem;
        line-height: 1.75;
        flex: 1;
      }
    }

    .panel-icon-wrap {
      display: grid;
      place-items: center;
      inline-size: 2.75rem;
      block-size: 2.75rem;
      border-radius: 0.85rem;
      background: var(--bg-pill);
      border: 1px solid var(--border-hover);
      color: var(--primary);

      mat-icon {
        font-size: 1.4rem;
        inline-size: 1.4rem;
        block-size: 1.4rem;
      }
    }

    .panel-actions {
      margin-block-start: 0.5rem;
    }

    .resume-download-btn {
      border-radius: 9999px !important;
      font-weight: 600 !important;
      padding-inline: 1.35rem !important;
      min-block-size: 3rem !important;
    }

    .info-list {
      display: grid;
      gap: 0.9rem;
      margin: 0;
    }

    .info-item {
      display: grid;
      gap: 0.2rem;
      padding-block-end: 0.75rem;
      border-block-end: 1px solid var(--border-subtle);

      &:last-child {
        border-block-end: none;
        padding-block-end: 0;
      }

      dt {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        color: var(--text-muted);
        font-size: 0.82rem;
        font-weight: 600;

        mat-icon {
          color: var(--secondary);
          font-size: 1rem;
          inline-size: 1rem;
          block-size: 1rem;
        }
      }

      dd {
        margin: 0;
        color: var(--text-primary);
        font-size: 0.94rem;
        font-weight: 500;
      }
    }

    .tabs-container {
      margin-block-start: 2rem;
    }

    .custom-tabs {
      background: transparent;
    }

    .tab-grid {
      display: grid;
      gap: 1.25rem;
      padding-block-start: 1.5rem;
    }

    .timeline-card {
      display: grid;
      gap: 0.65rem;
      padding: 1.35rem;
      border: 1px solid var(--border-subtle);
      border-radius: 1.25rem;
      background: var(--bg-card);
      box-shadow: var(--shadow-sm);
      transition: transform 200ms ease, border-color 200ms ease;

      &:hover {
        transform: translateY(-3px);
        border-color: var(--border-hover);
      }

      h3 {
        margin: 0;
        color: var(--text-primary);
        font-size: 1.18rem;
        font-weight: 700;
      }
    }

    .timeline-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
    }

    .duration-tag {
      display: inline-flex;
      align-items: center;
      padding: 0.2rem 0.65rem;
      border-radius: 9999px;
      background: var(--bg-pill);
      color: var(--primary);
      font-size: 0.78rem;
      font-weight: 700;
    }

    .location-tag {
      color: var(--text-muted);
      font-size: 0.8rem;
    }

    .company-name {
      color: var(--secondary);
      font-size: 0.92rem;
      font-weight: 600;
    }

    .resp-list {
      margin: 0;
      padding-inline-start: 1.15rem;
      display: grid;
      gap: 0.45rem;
      color: var(--text-secondary);
      font-size: 0.88rem;
      line-height: 1.6;
    }

    .edu-icon {
      color: var(--primary);
    }

    .edu-summary {
      margin: 0;
      color: var(--text-secondary);
      font-size: 0.88rem;
      line-height: 1.65;
    }

    @media (min-width: 48rem) {
      .about-grid {
        grid-template-columns: 1fr 1fr;
      }

      .tab-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent {
  private readonly portfolio = inject(PortfolioService);
  private readonly seo = inject(SeoService);

  readonly profile = this.portfolio.profile;
  readonly experiences = this.portfolio.experiences;
  readonly education = this.portfolio.education;

  constructor() {
    this.seo.update({
      title: 'About | Shubham Prajapati',
      description: 'Career summary, education, experience, and contact details for Shubham Prajapati.'
    });
  }
}

