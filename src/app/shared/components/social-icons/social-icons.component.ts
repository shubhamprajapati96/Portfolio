import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SocialLink } from '@core/interfaces/portfolio.interfaces';

@Component({
  selector: 'app-social-icons',
  imports: [MatIconModule, MatTooltipModule],
  template: `
    <div class="social-icons">
      @for (link of links(); track link.url) {
        <a
          [href]="link.url"
          target="_blank"
          rel="noreferrer"
          [attr.aria-label]="link.label"
          [matTooltip]="link.label"
          class="social-btn"
        >
          <mat-icon aria-hidden="true">{{ link.icon }}</mat-icon>
        </a>
      }
    </div>
  `,
  styles: `
    .social-icons {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.65rem;
    }

    .social-btn {
      display: grid;
      place-items: center;
      inline-size: 2.75rem;
      block-size: 2.75rem;
      border: 1px solid var(--border-subtle);
      border-radius: 0.85rem;
      background: var(--bg-surface-elevated);
      color: var(--text-secondary);
      box-shadow: var(--shadow-sm);
      transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1),
                  color 200ms ease,
                  border-color 200ms ease,
                  background 200ms ease,
                  box-shadow 200ms ease;

      mat-icon {
        font-size: 1.25rem;
        inline-size: 1.25rem;
        block-size: 1.25rem;
      }

      &:hover {
        transform: translateY(-3px);
        border-color: var(--border-hover);
        background: var(--bg-pill);
        color: var(--primary);
        box-shadow: 0 8px 20px -2px var(--primary-glow);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SocialIconsComponent {
  readonly links = input.required<readonly SocialLink[]>();
}

