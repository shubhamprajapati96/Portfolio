import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { Project } from '@core/interfaces/portfolio.interfaces';
import { TechIconComponent } from '../tech-icon/tech-icon.component';

@Component({
  selector: 'app-project-card',
  imports: [MatButtonModule, MatChipsModule, MatIconModule, RouterLink, TechIconComponent],
  template: `
    <article class="project-card">
      <div class="image-wrapper">
        <a [routerLink]="project().detailsUrl" class="image-link" [attr.aria-label]="project().title + ' details'">
          <img
            [src]="project().imageUrl"
            [alt]="project().title"
            [loading]="priority() ? 'eager' : 'lazy'"
            [attr.fetchpriority]="priority() ? 'high' : 'auto'"
            decoding="async"
            (error)="onImageError($event, project().id)"
          />
          <div class="image-overlay">
            <span class="preview-badge">
              <mat-icon aria-hidden="true">visibility</mat-icon>
              <span>Explore Case Study</span>
            </span>
          </div>
        </a>
      </div>

      <div class="card-body">
        <div class="title-row">
          <h2 class="project-title">
            <a [routerLink]="project().detailsUrl">{{ project().title }}</a>
          </h2>
        </div>

        <p class="project-description">{{ project().description }}</p>

        @if (showTechStack()) {
          <div class="tech-stack" aria-label="Project technologies">
            @for (technology of project().technologies; track technology) {
              <span class="tech-tag">
                <app-tech-icon [name]="technology" [size]="14" />
                <span>{{ technology }}</span>
              </span>
            }
          </div>
        }

        <div class="actions">
          <a mat-button [href]="project().liveUrl" target="_blank" rel="noreferrer" class="action-link">
            <mat-icon aria-hidden="true">open_in_new</mat-icon>
            <span>Live Demo</span>
          </a>
          <a mat-flat-button color="primary" [routerLink]="project().detailsUrl" class="details-btn">
            <span>Details</span>
            <mat-icon aria-hidden="true">arrow_forward</mat-icon>
          </a>
        </div>
      </div>
    </article>
  `,
  styles: `
    :host {
      display: block;
      height: 100%;
    }

    .project-card {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
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
        transform: translateY(-6px);
        border-color: var(--border-hover);
        box-shadow: var(--shadow-hover);

        img {
          transform: scale(1.06);
        }

        .image-overlay {
          opacity: 1;
        }

        .project-title a {
          color: var(--primary);
        }
      }
    }

    .image-wrapper {
      position: relative;
      overflow: hidden;
      background: var(--bg-surface-elevated);
    }

    .image-link {
      display: block;
      position: relative;
      aspect-ratio: 16 / 10;
      overflow: hidden;
    }

    img {
      inline-size: 100%;
      block-size: 100%;
      object-fit: cover;
      transition: transform 400ms cubic-bezier(0.2, 0.8, 0.2, 1);
    }

    .image-overlay {
      position: absolute;
      inset: 0;
      display: grid;
      place-items: center;
      background: rgba(7, 10, 19, 0.55);
      backdrop-filter: blur(3px);
      opacity: 0;
      transition: opacity 250ms ease;
    }

    .preview-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      padding: 0.5rem 1rem;
      border-radius: 9999px;
      background: var(--bg-glass-strong);
      border: 1px solid var(--border-hover);
      color: #ffffff;
      font-size: 0.82rem;
      font-weight: 600;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);

      mat-icon {
        font-size: 1rem;
        inline-size: 1rem;
        block-size: 1rem;
        color: var(--primary);
      }
    }

    .card-body {
      display: flex;
      flex-direction: column;
      flex: 1;
      gap: 0.95rem;
      padding: 1.35rem;
    }

    .title-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .project-title {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 700;
      line-height: 1.25;

      a {
        color: var(--text-primary);
        text-decoration: none;
        transition: color 200ms ease;
      }
    }

    .project-description {
      margin: 0;
      color: var(--text-secondary);
      font-size: 0.92rem;
      line-height: 1.65;
      flex: 1;
    }

    .tech-stack {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
      margin-block-start: 0.25rem;
    }

    .tech-tag {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.25rem 0.65rem;
      border-radius: 9999px;
      background: var(--bg-pill);
      border: 1px solid var(--border-subtle);
      color: var(--primary);
      font-size: 0.76rem;
      font-weight: 600;
      letter-spacing: 0.01em;
    }

    .actions {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.5rem;
      margin-block-start: 0.5rem;
      padding-block-start: 0.85rem;
      border-block-start: 1px solid var(--border-subtle);
    }

    .action-link {
      font-size: 0.84rem !important;
      font-weight: 500 !important;
      color: var(--text-secondary) !important;
      border-radius: 9999px !important;

      mat-icon {
        font-size: 1.05rem;
        inline-size: 1.05rem;
        block-size: 1.05rem;
        margin-inline-end: 0.2rem;
      }

      &:hover {
        color: var(--text-primary) !important;
        background: var(--bg-surface-elevated) !important;
      }
    }

    .details-btn {
      margin-inline-start: auto;
      border-radius: 9999px !important;
      font-size: 0.84rem !important;
      font-weight: 600 !important;
      padding-inline: 0.95rem !important;

      mat-icon {
        font-size: 1rem;
        inline-size: 1rem;
        block-size: 1rem;
        margin-inline-start: 0.2rem;
      }
    }

    @media (max-width: 30rem) {
      .details-btn {
        margin-inline-start: 0;
        inline-size: 100%;
        justify-content: center;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectCardComponent {
  readonly project = input.required<Project>();
  readonly showTechStack = input<boolean>(true);
  readonly priority = input<boolean>(false);

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


