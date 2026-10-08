import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { ProjectService } from '@core/services/project.service';
import { SeoService } from '@core/services/seo.service';
import { TechIconComponent } from '@shared/components/tech-icon/tech-icon.component';

@Component({
  selector: 'app-project-detail',
  imports: [MatButtonModule, MatChipsModule, MatIconModule, RouterLink, TechIconComponent],
  template: `
    @if (project(); as p) {
      <section class="section project-detail-page">
        <div class="container">
          <!-- Breadcrumb & Category Bar -->
          <div class="breadcrumb-bar">
            <a mat-button routerLink="/projects" class="back-link">
              <mat-icon aria-hidden="true">arrow_back</mat-icon>
              <span>Back to All Projects</span>
            </a>
            @if (p.category) {
              <div class="category-badge">
                <span class="badge-dot"></span>
                <span>{{ p.category }}</span>
              </div>
            }
          </div>

          <!-- Top Showcase Stage: Dual Column -->
          <div class="detail-layout">
            <!-- Left Column: Browser Frame Preview -->
            <div class="visual-column">
              <div class="browser-frame">
                <div class="browser-header">
                  <div class="window-dots" aria-hidden="true">
                    <span class="dot red"></span>
                    <span class="dot yellow"></span>
                    <span class="dot green"></span>
                  </div>
                  <div class="browser-address-bar">
                    <mat-icon aria-hidden="true">lock</mat-icon>
                    <span>{{ p.liveUrl }}</span>
                  </div>
                </div>
                <div class="browser-body">
                  <img
                    [src]="p.imageUrl"
                    [alt]="p.title"
                    loading="eager"
                    fetchpriority="high"
                    decoding="async"
                    (error)="onImageError($event, p.id)"
                  />
                </div>
              </div>

              <!-- Quick Action Bar -->
              <div class="visual-actions">
                <a
                  mat-flat-button
                  color="primary"
                  [href]="p.liveUrl"
                  target="_blank"
                  rel="noreferrer"
                  class="primary-action"
                >
                  <mat-icon aria-hidden="true">open_in_new</mat-icon>
                  <span>Launch Live Platform</span>
                </a>
                @if (p.githubUrl && p.githubUrl !== 'https://github.com/shubhamprajapati96/Portfolio') {
                  <a
                    mat-stroked-button
                    [href]="p.githubUrl"
                    target="_blank"
                    rel="noreferrer"
                    class="secondary-action"
                  >
                    <mat-icon aria-hidden="true">code</mat-icon>
                    <span>View Repository</span>
                  </a>
                }
              </div>
            </div>

            <!-- Right Column: Project Header & High-Level Metadata -->
            <div class="content-column">
              <div class="project-header">
                <span class="case-study-badge">Production Case Study</span>
                <h1 class="project-title">{{ p.title }}</h1>
              </div>

              <!-- Role & Responsibility Banner -->
              @if (p.role) {
                <div class="role-card">
                  <div class="role-icon-box">
                    <mat-icon>engineering</mat-icon>
                  </div>
                  <div class="role-text-box">
                    <span class="role-label">Role & Engineering Leadership</span>
                    <span class="role-value">{{ p.role }}</span>
                  </div>
                </div>
              }

              <!-- Short Summary -->
              <div class="project-description">
                <p>{{ p.description }}</p>
              </div>

              <!-- Performance & Scale Metrics Grid -->
              @if (p.metrics?.length) {
                <div class="metrics-section">
                  <h3 class="section-label">Scale & Operational Highlights</h3>
                  <div class="metrics-grid">
                    @for (metric of p.metrics; track metric.label) {
                      <div class="metric-card">
                        <span class="metric-value">{{ metric.value }}</span>
                        <span class="metric-label">{{ metric.label }}</span>
                      </div>
                    }
                  </div>
                </div>
              }

              <!-- Architecture & Tech Stack -->
              <div class="tech-stack-section">
                <h3 class="section-label">Architecture & Tech Stack</h3>
                <div class="tech-chips">
                  @for (technology of p.technologies; track technology) {
                    <span class="tech-chip">
                      <app-tech-icon [name]="technology" [size]="16" />
                      <span>{{ technology }}</span>
                    </span>
                  }
                </div>
              </div>
            </div>
          </div>

          <!-- Deep-Dive Sections: In-Depth Overview & Features -->
          <div class="deep-dive-container">
            <!-- 1. Detailed Overview & Engineering Narrative -->
            @if (p.overview?.length) {
              <div class="deep-dive-card overview-card">
                <div class="card-head">
                  <div class="icon-bubble">
                    <mat-icon>auto_stories</mat-icon>
                  </div>
                  <div>
                    <h2 class="card-title">Project Overview & Architecture</h2>
                    <span class="card-subtitle">End-to-end system workflows, technical architecture, and implementation details</span>
                  </div>
                </div>
                <div class="overview-body">
                  @for (paragraph of p.overview; track paragraph) {
                    <p class="overview-paragraph">{{ paragraph }}</p>
                  }
                </div>
              </div>
            }

            <!-- 2. Key Platform Features -->
            @if (p.keyFeatures?.length) {
              <div class="deep-dive-card features-card">
                <div class="card-head">
                  <div class="icon-bubble feature-bubble">
                    <mat-icon>stars</mat-icon>
                  </div>
                  <div>
                    <h2 class="card-title">Key Platform Features & Capabilities</h2>
                    <span class="card-subtitle">Automated workflows, AI integrations, and operational tools built into the platform</span>
                  </div>
                </div>
                <div class="features-grid">
                  @for (feature of p.keyFeatures; track feature) {
                    <div class="feature-item">
                      <div class="feature-check">
                        <mat-icon>check_circle</mat-icon>
                      </div>
                      <span class="feature-text">{{ feature }}</span>
                    </div>
                  }
                </div>
              </div>
            }

            <!-- 3. Operational Impact Callout -->
            @if (p.impact) {
              <div class="impact-card">
                <div class="impact-icon-col">
                  <mat-icon>insights</mat-icon>
                </div>
                <div class="impact-text-col">
                  <span class="impact-label">Operational Impact & Production Verification</span>
                  <p class="impact-desc">{{ p.impact }}</p>
                </div>
              </div>
            }
          </div>

          <!-- Project Navigation Footer: Hop between projects -->
          <div class="project-nav-footer">
            @if (prevProject(); as prev) {
              <a [routerLink]="prev.detailsUrl" class="nav-project-card prev-card">
                <span class="nav-dir">
                  <mat-icon>arrow_back</mat-icon> Previous Project
                </span>
                <span class="nav-title">{{ prev.title }}</span>
              </a>
            } @else {
              <div></div>
            }

            @if (nextProject(); as next) {
              <a [routerLink]="next.detailsUrl" class="nav-project-card next-card">
                <span class="nav-dir">
                  Next Project <mat-icon>arrow_forward</mat-icon>
                </span>
                <span class="nav-title">{{ next.title }}</span>
              </a>
            }
          </div>
        </div>
      </section>
    } @else {
      <section class="section missing-page">
        <div class="container missing-content">
          <div class="missing-icon-wrap">
            <mat-icon aria-hidden="true">search_off</mat-icon>
          </div>
          <h1>Project not found</h1>
          <p>The project case study you requested could not be located.</p>
          <a mat-flat-button color="primary" routerLink="/projects" class="back-home-btn">
            <mat-icon aria-hidden="true">arrow_back</mat-icon>
            <span>Back to Projects</span>
          </a>
        </div>
      </section>
    }
  `,
  styles: `
    .project-detail-page {
      padding-block-start: 1.5rem;
      padding-block-end: 4rem;
    }

    .breadcrumb-bar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      margin-block-end: 2.25rem;
    }

    .back-link {
      color: var(--text-secondary) !important;
      border-radius: 9999px !important;
      padding-inline: 1.25rem !important;
      background: var(--bg-surface-elevated) !important;
      border: 1px solid var(--border-subtle) !important;
      transition: all 200ms ease !important;

      &:hover {
        color: var(--primary) !important;
        border-color: var(--border-hover) !important;
        transform: translateX(-3px);
      }
    }

    .category-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.4rem 1rem;
      border-radius: 9999px;
      background: var(--bg-pill);
      border: 1px solid var(--border-hover);
      color: var(--primary);
      font-size: 0.82rem;
      font-weight: 600;

      .badge-dot {
        inline-size: 0.45rem;
        block-size: 0.45rem;
        border-radius: 50%;
        background: #22c55e;
        box-shadow: 0 0 8px #22c55e;
      }
    }

    /* Showcase Layout */
    .detail-layout {
      display: grid;
      gap: clamp(2rem, 4vw, 3.5rem);
      align-items: start;
      margin-block-end: 3.5rem;
    }

    .visual-column {
      display: grid;
      gap: 1.25rem;
    }

    .browser-frame {
      border: 1px solid var(--border-hover);
      border-radius: 1.25rem;
      background: var(--bg-card);
      box-shadow: var(--shadow-card);
      overflow: hidden;
      transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);

      &:hover {
        border-color: var(--primary);
        box-shadow: 0 16px 36px -10px var(--primary-glow);
      }
    }

    .browser-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem 1rem;
      background: var(--bg-surface-elevated);
      border-block-end: 1px solid var(--border-subtle);
    }

    .window-dots {
      display: flex;
      gap: 0.35rem;

      .dot {
        inline-size: 0.65rem;
        block-size: 0.65rem;
        border-radius: 50%;

        &.red { background: #ef4444; }
        &.yellow { background: #f59e0b; }
        &.green { background: #10b981; }
      }
    }

    .browser-address-bar {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.3rem 0.85rem;
      border-radius: 0.5rem;
      background: var(--bg-pill);
      color: var(--text-muted);
      font-size: 0.76rem;
      font-family: monospace;
      flex: 1;
      max-inline-size: 360px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      mat-icon {
        font-size: 0.9rem;
        inline-size: 0.9rem;
        block-size: 0.9rem;
        color: #22c55e;
      }
    }

    .browser-body img {
      inline-size: 100%;
      aspect-ratio: 16 / 10;
      object-fit: cover;
      display: block;
    }

    .visual-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;

      a {
        min-block-size: 3.1rem;
        border-radius: 9999px;
        font-weight: 600;
        padding-inline: 1.35rem;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
      }
    }

    .primary-action {
      flex: 1;
      min-inline-size: 200px;
      justify-content: center;
      box-shadow: 0 8px 24px -4px var(--primary-glow);
    }

    .secondary-action {
      color: var(--text-primary) !important;
      border-color: var(--border-subtle) !important;
      background: var(--bg-surface-elevated) !important;

      &:hover {
        border-color: var(--border-hover) !important;
        color: var(--primary) !important;
      }
    }

    /* Content Column */
    .content-column {
      display: grid;
      gap: 1.5rem;
    }

    .project-header {
      display: grid;
      gap: 0.5rem;
    }

    .case-study-badge {
      display: inline-flex;
      width: fit-content;
      padding: 0.25rem 0.85rem;
      border-radius: 9999px;
      background: var(--bg-pill);
      border: 1px solid var(--border-hover);
      color: var(--primary);
      font-size: 0.76rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .project-title {
      margin: 0;
      color: var(--text-primary);
      font-size: clamp(2.2rem, 5vw, 3.4rem);
      font-weight: 800;
      line-height: 1.1;
      letter-spacing: -0.02em;
    }

    /* Role Banner */
    .role-card {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      padding: 0.85rem 1.15rem;
      border-radius: 1rem;
      background: linear-gradient(135deg, rgba(2, 132, 199, 0.12) 0%, rgba(99, 102, 241, 0.08) 100%);
      border: 1px solid var(--border-hover);

      .role-icon-box {
        display: grid;
        place-items: center;
        inline-size: 2.5rem;
        block-size: 2.5rem;
        border-radius: 0.75rem;
        background: var(--bg-pill);
        color: var(--primary);
        flex-shrink: 0;

        mat-icon {
          font-size: 1.35rem;
          inline-size: 1.35rem;
          block-size: 1.35rem;
        }
      }

      .role-text-box {
        display: flex;
        flex-direction: column;
        gap: 0.15rem;

        .role-label {
          color: var(--text-muted);
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .role-value {
          color: var(--text-primary);
          font-size: 0.95rem;
          font-weight: 600;
          line-height: 1.35;
        }
      }
    }

    .project-description p {
      margin: 0;
      color: var(--text-secondary);
      line-height: 1.75;
      font-size: 1.05rem;
    }

    /* Metrics Grid */
    .metrics-section {
      display: grid;
      gap: 0.75rem;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 10rem), 1fr));
      gap: 0.75rem;
    }

    .metric-card {
      padding: 0.85rem 1rem;
      border-radius: 0.85rem;
      background: var(--bg-surface-elevated);
      border: 1px solid var(--border-subtle);
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      transition: all 200ms ease;

      &:hover {
        border-color: var(--border-hover);
        transform: translateY(-2px);
      }

      .metric-value {
        color: var(--primary);
        font-size: 1.05rem;
        font-weight: 700;
        line-height: 1.25;
      }

      .metric-label {
        color: var(--text-muted);
        font-size: 0.74rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }
    }

    /* Tech Stack */
    .tech-stack-section {
      display: grid;
      gap: 0.65rem;
    }

    .section-label {
      margin: 0;
      color: var(--text-primary);
      font-size: 0.85rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }

    .tech-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .tech-chip {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      padding: 0.45rem 1rem;
      border-radius: 9999px;
      background: var(--bg-surface-elevated);
      border: 1px solid var(--border-subtle);
      color: var(--text-primary);
      font-size: 0.86rem;
      font-weight: 600;
      transition: all 180ms ease;

      &:hover {
        background: var(--bg-pill);
        border-color: var(--border-hover);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px var(--primary-glow);
      }
    }

    /* Deep Dive Cards */
    .deep-dive-container {
      display: grid;
      gap: 2rem;
      margin-block-end: 3.5rem;
    }

    .deep-dive-card {
      padding: clamp(1.5rem, 3.5vw, 2.5rem);
      border-radius: 1.5rem;
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      box-shadow: var(--shadow-card);
      backdrop-filter: blur(16px);
      display: grid;
      gap: 1.5rem;
      transition: border-color 200ms ease;

      &:hover {
        border-color: var(--border-hover);
      }
    }

    .card-head {
      display: flex;
      align-items: center;
      gap: 1rem;

      .icon-bubble {
        display: grid;
        place-items: center;
        inline-size: 3rem;
        block-size: 3rem;
        border-radius: 1rem;
        background: var(--bg-pill);
        color: var(--primary);
        border: 1px solid var(--border-hover);
        flex-shrink: 0;

        mat-icon {
          font-size: 1.6rem;
          inline-size: 1.6rem;
          block-size: 1.6rem;
        }

        &.feature-bubble {
          color: #a855f7;
          border-color: rgba(168, 85, 247, 0.3);
          background: rgba(168, 85, 247, 0.08);
        }
      }

      .card-title {
        margin: 0;
        color: var(--text-primary);
        font-size: clamp(1.25rem, 2.5vw, 1.65rem);
        font-weight: 700;
        letter-spacing: -0.01em;
      }

      .card-subtitle {
        color: var(--text-secondary);
        font-size: 0.88rem;
        display: block;
        margin-block-start: 0.15rem;
      }
    }

    .overview-body {
      display: grid;
      gap: 1rem;

      .overview-paragraph {
        margin: 0;
        color: var(--text-secondary);
        line-height: 1.85;
        font-size: 1.05rem;
      }
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 20rem), 1fr));
      gap: 1rem;
    }

    .feature-item {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 1rem 1.15rem;
      border-radius: 1rem;
      background: var(--bg-surface-elevated);
      border: 1px solid var(--border-subtle);
      transition: all 200ms ease;

      &:hover {
        border-color: var(--border-hover);
        background: var(--bg-pill);
        transform: translateY(-2px);
      }

      .feature-check {
        color: #22c55e;
        flex-shrink: 0;
        margin-block-start: 0.1rem;

        mat-icon {
          font-size: 1.25rem;
          inline-size: 1.25rem;
          block-size: 1.25rem;
        }
      }

      .feature-text {
        color: var(--text-primary);
        font-size: 0.95rem;
        line-height: 1.6;
        font-weight: 500;
      }
    }

    .impact-card {
      display: flex;
      align-items: flex-start;
      gap: 1.25rem;
      padding: 1.5rem 1.75rem;
      border-radius: 1.25rem;
      background: radial-gradient(circle at 10% 50%, rgba(34, 197, 94, 0.1) 0%, transparent 60%), var(--bg-card);
      border: 1px solid rgba(34, 197, 94, 0.3);

      .impact-icon-col {
        display: grid;
        place-items: center;
        inline-size: 3rem;
        block-size: 3rem;
        border-radius: 1rem;
        background: rgba(34, 197, 94, 0.12);
        color: #22c55e;
        flex-shrink: 0;

        mat-icon {
          font-size: 1.6rem;
          inline-size: 1.6rem;
          block-size: 1.6rem;
        }
      }

      .impact-text-col {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;

        .impact-label {
          color: #22c55e;
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .impact-desc {
          margin: 0;
          color: var(--text-primary);
          font-size: 1rem;
          line-height: 1.65;
          font-weight: 500;
        }
      }
    }

    /* Project Navigation Footer */
    .project-nav-footer {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 1rem;
      padding-block-start: 2rem;
      border-block-start: 1px solid var(--border-subtle);
    }

    .nav-project-card {
      flex: 1;
      min-inline-size: 220px;
      padding: 1.25rem 1.5rem;
      border-radius: 1.15rem;
      background: var(--bg-surface-elevated);
      border: 1px solid var(--border-subtle);
      text-decoration: none;
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      transition: all 200ms ease;

      &:hover {
        border-color: var(--primary);
        background: var(--bg-pill);
        transform: translateY(-2px);
      }

      &.next-card {
        text-align: right;
        align-items: flex-end;
      }

      .nav-dir {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        color: var(--text-muted);
        font-size: 0.8rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.04em;

        mat-icon {
          font-size: 1rem;
          inline-size: 1rem;
          block-size: 1rem;
        }
      }

      .nav-title {
        color: var(--text-primary);
        font-size: 1.1rem;
        font-weight: 700;
      }
    }

    /* Missing Page */
    .missing-page {
      min-block-size: 60vh;
      display: grid;
      place-items: center;
    }

    .missing-content {
      display: grid;
      place-items: center;
      gap: 1rem;
      text-align: center;
      max-inline-size: 420px;

      h1 {
        margin: 0;
        color: var(--text-primary);
        font-size: 2rem;
      }

      p {
        margin: 0;
        color: var(--text-secondary);
      }
    }

    .missing-icon-wrap {
      display: grid;
      place-items: center;
      inline-size: 4rem;
      block-size: 4rem;
      border-radius: 1.25rem;
      background: var(--bg-pill);
      color: var(--primary);

      mat-icon {
        font-size: 2.2rem;
        inline-size: 2.2rem;
        block-size: 2.2rem;
      }
    }

    .back-home-btn {
      border-radius: 9999px !important;
      margin-block-start: 1rem;
    }

    @media (min-width: 64rem) {
      .detail-layout {
        grid-template-columns: 1.15fr 0.85fr;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectDetailComponent {
  private readonly projectService = inject(ProjectService);
  private readonly seo = inject(SeoService);

  readonly id = input.required<string>();
  readonly project = computed(() => this.projectService.findById(this.id()));

  readonly allProjects = this.projectService.projects;
  readonly currentIndex = computed(() => this.allProjects().findIndex((p) => p.id === this.id()));

  readonly prevProject = computed(() => {
    const idx = this.currentIndex();
    return idx > 0 ? this.allProjects()[idx - 1] : null;
  });

  readonly nextProject = computed(() => {
    const idx = this.currentIndex();
    const projects = this.allProjects();
    return idx >= 0 && idx < projects.length - 1 ? projects[idx + 1] : null;
  });

  constructor() {
    this.seo.update({
      title: 'Project Case Study | Shubham Prajapati',
      description: 'Detailed software project case study with technical architecture, features, and live demo.'
    });
  }

  onImageError(event: Event, projectId: string): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      if (!target.dataset['fallback']) {
        target.dataset['fallback'] = '1';
        target.src = `assets/images/projects/${projectId}.jpg`;
      } else if (target.dataset['fallback'] === '1') {
        target.dataset['fallback'] = '2';
        target.src = 'assets/images/projects/default-project.svg';
      }
    }
  }
}
