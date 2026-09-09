import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemeService } from '@core/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  template: `
    <button
      type="button"
      mat-icon-button
      class="theme-toggle-btn"
      [attr.aria-label]="theme.mode() === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
      [matTooltip]="theme.mode() === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
      (click)="theme.toggle()"
    >
      <mat-icon [class.rotate]="theme.mode() === 'light'">
        {{ theme.mode() === 'dark' ? 'dark_mode' : 'light_mode' }}
      </mat-icon>
    </button>
  `,
  styles: `
    .theme-toggle-btn {
      color: var(--text-primary) !important;
      background: var(--bg-pill) !important;
      border: 1px solid var(--border-subtle) !important;
      border-radius: 50% !important;
      transition: all 200ms ease !important;

      mat-icon {
        font-size: 1.25rem;
        inline-size: 1.25rem;
        block-size: 1.25rem;
        transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1), color 200ms ease;
      }

      &:hover {
        background: var(--bg-surface-elevated) !important;
        border-color: var(--border-hover) !important;
        color: var(--primary) !important;
      }

      .rotate {
        transform: rotate(180deg);
        color: #f59e0b;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThemeToggleComponent {
  readonly theme = inject(ThemeService);
}

