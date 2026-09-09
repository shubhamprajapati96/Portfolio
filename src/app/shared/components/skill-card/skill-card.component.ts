import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { SkillCategory } from '@core/interfaces/portfolio.interfaces';
import { TechIconComponent } from '../tech-icon/tech-icon.component';

@Component({
  selector: 'app-skill-card',
  imports: [MatIconModule, TechIconComponent],
  template: `
    <article class="skill-card">
      <!-- Card Header with Icon Box & Title (Subtitles Removed) -->
      <header class="skill-header">
        <div class="header-left">
          <div class="icon-box">
            <app-tech-icon [name]="category().name" [fallbackIcon]="category().icon" [size]="24" />
          </div>
          <h3 class="category-name">{{ category().name }}</h3>
        </div>
        <span class="count-pill">{{ category().skills.length }} Skills</span>
      </header>

      <!-- Advanced Skills Grid - Pure Icon and Title Only -->
      <div class="skills-grid" aria-label="Capabilities in this domain">
        @for (skill of category().skills; track skill.name) {
          <div class="skill-badge-item">
            <div class="skill-icon-pill">
              <app-tech-icon [name]="skill.name" [fallbackIcon]="skill.icon" [size]="20" />
            </div>
            <span class="skill-label">{{ skill.name }}</span>
          </div>
        }
      </div>
    </article>
  `,
  styles: `
    :host {
      display: block;
      height: 100%;
    }

    .skill-card {
      display: flex;
      flex-direction: column;
      height: 100%;
      padding: clamp(1.25rem, 3vw, 1.75rem);
      border: 1px solid var(--border-subtle);
      border-radius: 1.5rem;
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

        .icon-box {
          transform: scale(1.08) rotate(4deg);
          box-shadow: 0 0 24px var(--primary-glow);
        }
      }
    }

    .skill-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      margin-block-end: 1.25rem;
      padding-block-end: 1.15rem;
      border-block-end: 1px solid var(--border-subtle);
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      min-inline-size: 0;
    }

    .icon-box {
      display: grid;
      place-items: center;
      inline-size: 2.75rem;
      block-size: 2.75rem;
      border-radius: 0.85rem;
      background: var(--bg-pill);
      border: 1px solid var(--border-hover);
      color: var(--primary);
      box-shadow: 0 4px 14px -2px var(--primary-glow);
      flex-shrink: 0;
      transition: transform 250ms ease, box-shadow 250ms ease;

      mat-icon {
        font-size: 1.35rem;
        inline-size: 1.35rem;
        block-size: 1.35rem;
      }
    }

    .category-name {
      margin: 0;
      font-size: 1.18rem;
      font-weight: 700;
      color: var(--text-primary);
      letter-spacing: -0.01em;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .count-pill {
      font-size: 0.72rem;
      font-weight: 600;
      padding: 0.25rem 0.65rem;
      border-radius: 9999px;
      background: var(--bg-surface-elevated);
      color: var(--text-muted);
      border: 1px solid var(--border-subtle);
      flex-shrink: 0;
    }

    /* Skills Grid - Modern Interactive Tiles with Only Icon & Title */
    .skills-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 14.5rem), 1fr));
      gap: 0.85rem;
      flex: 1;
      align-content: start;
    }

    .skill-badge-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      border-radius: 1rem;
      background: var(--bg-surface-elevated);
      border: 1px solid var(--border-subtle);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
      min-block-size: 3.75rem;
      transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1),
                  border-color 200ms ease,
                  background-color 200ms ease,
                  box-shadow 200ms ease;

      &:hover {
        transform: translateY(-3px);
        border-color: var(--border-hover);
        background: var(--bg-pill);
        box-shadow: 0 6px 18px -4px var(--primary-glow);

        .skill-icon-pill {
          background: var(--gradient-primary);
          color: #ffffff;
          transform: scale(1.1);
          box-shadow: 0 0 12px var(--primary-glow);
        }
      }
    }

    .skill-icon-pill {
      display: grid;
      place-items: center;
      inline-size: 2.25rem;
      block-size: 2.25rem;
      border-radius: 0.65rem;
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      color: var(--primary);
      flex-shrink: 0;
      transition: all 200ms ease;

      mat-icon {
        font-size: 1.15rem;
        inline-size: 1.15rem;
        block-size: 1.15rem;
      }
    }

    .skill-label {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--text-primary);
      line-height: 1.35;
      word-break: normal;
      overflow-wrap: break-word;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkillCardComponent {
  readonly category = input.required<SkillCategory>();
}
