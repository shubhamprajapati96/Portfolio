import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SeoService } from '@core/services/seo.service';

@Component({
  selector: 'app-not-found',
  imports: [MatButtonModule, MatIconModule, RouterLink],
  template: `
    <section class="not-found-section">
      <div class="not-found-card">
        <div class="code-badge">Error 404</div>
        <h1 class="error-code gradient-text">404</h1>
        <h2 class="error-title">Page Not Found</h2>
        <p class="error-desc">
          The page or route you are looking for has been moved, removed, or never existed in this application.
        </p>
        <div class="action-buttons">
          <a mat-flat-button color="primary" routerLink="/" class="home-btn">
            <mat-icon aria-hidden="true">home</mat-icon>
            <span>Return to Homepage</span>
          </a>
          <a mat-stroked-button routerLink="/projects" class="projects-btn">
            <mat-icon aria-hidden="true">work</mat-icon>
            <span>Explore Projects</span>
          </a>
        </div>
      </div>
    </section>
  `,
  styles: `
    .not-found-section {
      display: grid;
      place-items: center;
      min-block-size: calc(80vh - 4.5rem);
      padding: 2rem 1rem;
      text-align: center;
    }

    .not-found-card {
      display: grid;
      justify-items: center;
      gap: 1rem;
      max-inline-size: 32rem;
      padding: clamp(2rem, 5vw, 3.5rem) clamp(1.5rem, 4vw, 2.5rem);
      border: 1px solid var(--border-subtle);
      border-radius: 1.75rem;
      background: var(--bg-card);
      box-shadow: var(--shadow-card);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
    }

    .code-badge {
      display: inline-flex;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      background: var(--bg-pill);
      border: 1px solid var(--border-hover);
      color: var(--primary);
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .error-code {
      margin: 0;
      font-size: clamp(5rem, 15vw, 8.5rem);
      font-weight: 900;
      line-height: 0.9;
      letter-spacing: -0.04em;
    }

    .error-title {
      margin: 0;
      color: var(--text-primary);
      font-size: clamp(1.5rem, 3.5vw, 2rem);
      font-weight: 700;
    }

    .error-desc {
      margin: 0;
      color: var(--text-secondary);
      font-size: 0.95rem;
      line-height: 1.65;
    }

    .action-buttons {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 0.75rem;
      margin-block-start: 1rem;

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

    .home-btn {
      box-shadow: 0 6px 20px -2px var(--primary-glow);
    }

    .projects-btn {
      color: var(--text-primary) !important;
      border-color: var(--border-subtle) !important;
      background: var(--bg-surface-elevated) !important;

      &:hover {
        border-color: var(--border-hover) !important;
        color: var(--primary) !important;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotFoundComponent {
  private readonly seo = inject(SeoService);

  constructor() {
    this.seo.update({
      title: '404 Not Found | Shubham Prajapati',
      description: 'The requested portfolio page could not be found.'
    });
  }
}

