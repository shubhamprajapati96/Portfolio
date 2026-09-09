import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { APP_CONFIG, SOCIAL_LINKS } from '@core/constants/app.constants';
import { DateHelper } from '@core/helper/date.helper';

@Component({
  selector: 'app-footer',
  imports: [MatIconModule],
  template: `
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-left">
          <span class="brand-mark">SP</span>
          <div class="footer-meta">
            <span class="copyright">© {{ year }} All rights reserved</span>
            <span class="dot-separator">·</span>
            <span class="credits">Crafted by <span class="author-name">{{ config.name }}</span></span>
          </div>
        </div>

        <div class="social-pills" aria-label="Social profiles">
          @for (link of socialLinks; track link.url) {
            <a [href]="link.url" target="_blank" rel="noreferrer" [attr.aria-label]="link.label" class="social-pill">
              <mat-icon aria-hidden="true">{{ link.icon }}</mat-icon>
              <span class="social-label">{{ link.label }}</span>
            </a>
          }
        </div>
      </div>
    </footer>
  `,
  styles: `
    .footer {
      padding-block-start: 1.75rem;
      padding-block-end: calc(1.75rem + env(safe-area-inset-bottom, 0px));
      border-block-start: 1px solid var(--border-subtle);
      background: var(--bg-surface);
      color: var(--text-secondary);
      transition: background-color 250ms ease, border-color 250ms ease;
    }

    .footer-container {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 1.25rem;
      inline-size: min(100% - clamp(1.5rem, 5vw, 3.5rem), 1200px);
      margin-inline: auto;
    }

    .footer-left {
      display: flex;
      align-items: center;
      gap: 0.85rem;
    }

    .brand-mark {
      display: grid;
      place-items: center;
      inline-size: 2.25rem;
      block-size: 2.25rem;
      border-radius: 0.65rem;
      background: var(--gradient-primary);
      color: #ffffff;
      font-size: 0.85rem;
      font-weight: 800;
      box-shadow: 0 4px 12px -2px var(--primary-glow);
    }

    .footer-meta {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.45rem;
      font-size: 0.86rem;
      color: var(--text-muted);
    }

    .copyright {
      margin: 0;
      color: var(--text-muted);
    }

    .dot-separator {
      color: var(--border-hover);
      font-weight: 700;
    }

    .credits {
      margin: 0;
      color: var(--text-secondary);

      .author-name {
        color: var(--primary);
        font-weight: 600;
      }
    }

    .social-pills {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.5rem;
    }

    .social-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.4rem 0.85rem;
      border-radius: 9999px;
      background: var(--bg-surface-elevated);
      border: 1px solid var(--border-subtle);
      color: var(--text-secondary);
      font-size: 0.82rem;
      font-weight: 500;
      transition: all 180ms ease;

      mat-icon {
        font-size: 1.05rem;
        inline-size: 1.05rem;
        block-size: 1.05rem;
        color: var(--primary);
      }

      &:hover {
        background: var(--bg-pill);
        border-color: var(--border-hover);
        color: var(--text-primary);
        transform: translateY(-2px);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {
  readonly config = APP_CONFIG;
  readonly socialLinks = SOCIAL_LINKS;
  readonly year = DateHelper.year();
}

