import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { Experience } from '@core/interfaces/portfolio.interfaces';

@Component({
  selector: 'app-experience-card',
  imports: [MatChipsModule, MatIconModule],
  template: `
    <article class="experience-card">
      <header class="experience-header">
        <div class="duration-badge">
          <mat-icon aria-hidden="true">calendar_today</mat-icon>
          <span>{{ experience().duration }}</span>
        </div>
        <h2 class="role-title">{{ experience().position }}</h2>
        <div class="company-row">
          <span class="company-name">{{ experience().company }}</span>
          <span class="divider">·</span>
          <span class="location">
            <mat-icon aria-hidden="true">location_on</mat-icon>
            {{ experience().location }}
          </span>
        </div>
      </header>

      <ul class="responsibilities-list">
        @for (responsibility of experience().responsibilities; track responsibility) {
          <li>
            <mat-icon class="bullet-icon" aria-hidden="true">check_circle</mat-icon>
            <span>{{ responsibility }}</span>
          </li>
        }
      </ul>

      <div class="tech-stack" aria-label="Technologies used">
        @for (technology of experience().technologies; track technology) {
          <span class="tech-tag">{{ technology }}</span>
        }
      </div>
    </article>
  `,
  styles: `
    :host {
      display: block;
      height: 100%;
    }

    .experience-card {
      display: flex;
      flex-direction: column;
      height: 100%;
      gap: 1.25rem;
      padding: 1.5rem;
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
        transform: translateY(-4px);
        border-color: var(--border-hover);
        box-shadow: var(--shadow-hover);
      }
    }

    .experience-header {
      display: grid;
      gap: 0.5rem;
    }

    .duration-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      width: fit-content;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      background: var(--bg-pill);
      border: 1px solid var(--border-hover);
      color: var(--primary);
      font-size: 0.78rem;
      font-weight: 700;

      mat-icon {
        font-size: 0.95rem;
        inline-size: 0.95rem;
        block-size: 0.95rem;
      }
    }

    .role-title {
      margin: 0;
      color: var(--text-primary);
      font-size: 1.3rem;
      font-weight: 700;
      line-height: 1.25;
    }

    .company-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.5rem;
      color: var(--text-secondary);
      font-size: 0.92rem;
    }

    .company-name {
      color: var(--primary);
      font-weight: 600;
    }

    .divider {
      color: var(--text-dim);
    }

    .location {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      color: var(--text-muted);

      mat-icon {
        font-size: 1rem;
        inline-size: 1rem;
        block-size: 1rem;
      }
    }

    .responsibilities-list {
      display: grid;
      gap: 0.75rem;
      margin: 0;
      padding: 0;
      list-style: none;
      flex: 1;

      li {
        display: flex;
        align-items: flex-start;
        gap: 0.65rem;
        color: var(--text-secondary);
        font-size: 0.92rem;
        line-height: 1.65;
      }

      .bullet-icon {
        color: var(--secondary);
        font-size: 1.15rem;
        inline-size: 1.15rem;
        block-size: 1.15rem;
        flex-shrink: 0;
        margin-block-start: 0.15rem;
      }
    }

    .tech-stack {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
      padding-block-start: 0.85rem;
      border-block-start: 1px solid var(--border-subtle);
    }

    .tech-tag {
      display: inline-flex;
      align-items: center;
      padding: 0.25rem 0.65rem;
      border-radius: 9999px;
      background: var(--bg-pill);
      border: 1px solid var(--border-subtle);
      color: var(--primary);
      font-size: 0.76rem;
      font-weight: 600;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExperienceCardComponent {
  readonly experience = input.required<Experience>();
}

