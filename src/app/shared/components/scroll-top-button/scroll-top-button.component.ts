import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ScrollService } from '@core/services/scroll.service';

@Component({
  selector: 'app-scroll-top-button',
  imports: [MatButtonModule, MatIconModule],
  template: `
    @if (scroll.showScrollTop()) {
      <button
        type="button"
        mat-fab
        aria-label="Scroll to top of page"
        class="scroll-top-btn"
        (click)="scroll.scrollToTop()"
      >
        <mat-icon aria-hidden="true">keyboard_arrow_up</mat-icon>
      </button>
    }
  `,
  styles: `
    .scroll-top-btn {
      position: fixed;
      inset-inline-end: clamp(1.25rem, 3vw, 2.5rem);
      inset-block-end: calc(clamp(1.25rem, 3vw, 2.5rem) + env(safe-area-inset-bottom, 0px));
      z-index: 80;
      background: var(--gradient-primary) !important;
      color: #ffffff !important;
      border: 1px solid rgba(255, 255, 255, 0.2) !important;
      box-shadow: 0 10px 28px -4px var(--primary-glow), var(--shadow-card) !important;
      animation: popIn 250ms cubic-bezier(0.16, 1, 0.3, 1);
      transition: transform 200ms ease, box-shadow 200ms ease;

      &:hover {
        transform: translateY(-4px) scale(1.05);
        box-shadow: 0 16px 36px -4px var(--primary-glow) !important;
      }

      mat-icon {
        font-size: 1.6rem;
        inline-size: 1.6rem;
        block-size: 1.6rem;
      }
    }

    @keyframes popIn {
      from {
        opacity: 0;
        transform: translateY(16px) scale(0.85);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScrollTopButtonComponent {
  readonly scroll = inject(ScrollService);
}

