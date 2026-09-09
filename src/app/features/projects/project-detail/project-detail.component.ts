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
    @if (project()) {
      <section class="section project-detail-page">
        <div class="container">
          <div class="breadcrumb-bar">
            <a mat-button routerLink="/projects" class="back-link">
              <mat-icon aria-hidden="true">arrow_back</mat-icon>
              <span>Back to All Projects</span>
            </a>
          </div>

          <div class="detail-layout">
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
                    <span>{{ project()!.liveUrl }}</span>
                  </div>
                </div>
                <div class="browser-body">
                  <img [src]="project()!.imageUrl" [alt]="project()!.title" fetchpriority="high" (error)="onImageError($event, project()!.id)" />
                </div>
              </div>
            </div>

            <div class="content-column">
              <div class="project-header">
                <span class="case-study-badge">Case Study</span>
                <h1 class="project-title">{{ project()!.title }}</h1>
              </div>

              <div class="project-description">
                <p>{{ project()!.description }}</p>
              </div>

              <div class="tech-stack-section">
                <h3 class="section-label">Architecture & Stack</h3>
                <div class="tech-chips">
                  @for (technology of project()!.technologies; track technology) {
                    <span class="tech-chip">
                      <app-tech-icon [name]="technology" [size]="16" />
                      <span>{{ technology }}</span>
                    </span>
                  }
                </div>
              </div>

              <div class="project-actions">
                <a mat-flat-button color="primary" [href]="project()!.liveUrl" target="_blank" rel="noreferrer" class="primary-action">
                  <mat-icon aria-hidden="true">open_in_new</mat-icon>
                  <span>Launch Live Demo</span>
                </a>
              </div>
            </div>
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
      padding-block-start: 1rem;
    }

    .breadcrumb-bar {
      margin-block-end: 2rem;
    }

    .back-link {
      color: var(--text-secondary) !important;
      border-radius: 9999px !important;
      padding-inline: 1rem !important;

      &:hover {
        color: var(--primary) !important;
        background: var(--bg-surface-elevated) !important;
      }
    }

    .detail-layout {
      display: grid;
      gap: clamp(2rem, 5vw, 3.5rem);
      align-items: center;
    }

    .visual-column {
      position: relative;
    }

    .browser-frame {
      border: 1px solid var(--border-hover);
      border-radius: 1.35rem;
      background: var(--bg-card);
      box-shadow: var(--shadow-card);
      overflow: hidden;
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
      padding: 0.25rem 0.75rem;
      border-radius: 0.5rem;
      background: var(--bg-pill);
      color: var(--text-muted);
      font-size: 0.76rem;
      font-family: monospace;
      flex: 1;
      max-inline-size: 320px;

      mat-icon {
        font-size: 0.9rem;
        inline-size: 0.9rem;
        block-size: 0.9rem;
        color: var(--secondary);
      }
    }

    .browser-body img {
      inline-size: 100%;
      aspect-ratio: 16 / 10;
      object-fit: cover;
      display: block;
    }

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
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      background: var(--bg-pill);
      border: 1px solid var(--border-hover);
      color: var(--primary);
      font-size: 0.78rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .project-title {
      margin: 0;
      color: var(--text-primary);
      font-size: clamp(2rem, 5vw, 3.25rem);
      font-weight: 800;
      line-height: 1.1;
      letter-spacing: -0.02em;
    }

    .project-description p {
      margin: 0;
      color: var(--text-secondary);
      line-height: 1.8;
      font-size: 1.05rem;
    }

    .tech-stack-section {
      display: grid;
      gap: 0.65rem;
    }

    .section-label {
      margin: 0;
      color: var(--text-primary);
      font-size: 0.9rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
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
      padding: 0.4rem 0.95rem;
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

    .project-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.85rem;
      margin-block-start: 0.5rem;

      a {
        min-block-size: 3.25rem;
        border-radius: 9999px;
        font-weight: 600;
        padding-inline: 1.35rem;
        display: inline-flex;
        align-items: center;
        gap: 0.45rem;
      }
    }

    .primary-action {
      box-shadow: 0 6px 20px -2px var(--primary-glow);
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

  constructor() {
    this.seo.update({
      title: 'Project Details | Shubham Prajapati',
      description: 'Detailed software project case study with technologies, live demo, and architecture breakdown.'
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


