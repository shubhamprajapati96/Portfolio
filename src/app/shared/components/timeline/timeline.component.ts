import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Experience } from '@core/interfaces/portfolio.interfaces';

@Component({
  selector: 'app-timeline',
  imports: [MatIconModule],
  template: `
    <div class="timeline-container">
      @for (item of items(); track item.company) {
        <article class="timeline-item">
          <div class="timeline-dot-wrap">
            <span class="timeline-dot"></span>
          </div>
          <div class="timeline-card">
            <span class="timeline-duration">{{ item.duration }}</span>
            <h2 class="timeline-role">{{ item.position }}</h2>
            <p class="timeline-company">
              <mat-icon aria-hidden="true">business</mat-icon>
              <span>{{ item.company }} · {{ item.location }}</span>
            </p>
          </div>
        </article>
      }
    </div>
  `,
  styles: `
    .timeline-container {
      display: grid;
      gap: 1.5rem;
      position: relative;
      padding-inline-start: 2rem;

      &::before {
        content: '';
        position: absolute;
        inset-inline-start: 0.6rem;
        inset-block-start: 0.5rem;
        inset-block-end: 0.5rem;
        inline-size: 2px;
        background: linear-gradient(180deg, var(--primary), var(--secondary), var(--border-subtle));
      }
    }

    .timeline-item {
      position: relative;
      display: grid;
    }

    .timeline-dot-wrap {
      position: absolute;
      inset-inline-start: -2rem;
      inset-block-start: 1.25rem;
      display: grid;
      place-items: center;
      inline-size: 1.25rem;
      block-size: 1.25rem;
      border-radius: 50%;
      background: var(--bg-surface);
    }

    .timeline-dot {
      inline-size: 0.75rem;
      block-size: 0.75rem;
      border-radius: 50%;
      background: var(--gradient-primary);
      box-shadow: 0 0 10px var(--primary-glow);
    }

    .timeline-card {
      display: grid;
      gap: 0.35rem;
      padding: 1.25rem;
      border-radius: 1.15rem;
      border: 1px solid var(--border-subtle);
      background: var(--bg-card);
      box-shadow: var(--shadow-sm);
      transition: transform 200ms ease, border-color 200ms ease, box-shadow 200ms ease;

      &:hover {
        transform: translateX(4px);
        border-color: var(--border-hover);
        box-shadow: var(--shadow-md);
      }
    }

    .timeline-duration {
      color: var(--primary);
      font-size: 0.8rem;
      font-weight: 700;
    }

    .timeline-role {
      margin: 0;
      color: var(--text-primary);
      font-size: 1.15rem;
      font-weight: 700;
    }

    .timeline-company {
      margin: 0;
      display: flex;
      align-items: center;
      gap: 0.35rem;
      color: var(--text-secondary);
      font-size: 0.88rem;

      mat-icon {
        color: var(--secondary);
        font-size: 1rem;
        inline-size: 1rem;
        block-size: 1rem;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimelineComponent {
  readonly items = input.required<readonly Experience[]>();
}

