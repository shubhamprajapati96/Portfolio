import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { SkillCategory } from '@core/interfaces/portfolio.interfaces';
import { TechIconComponent } from '../tech-icon/tech-icon.component';

@Component({
  selector: 'app-skill-card',
  imports: [MatIconModule, TechIconComponent],
  template: `
    <article class="skill-card">
      <!-- Card Header with Icon Box, Title & Category Tagline -->
      <header class="skill-header">
        <div class="icon-box">
          <app-tech-icon [name]="category().name" [fallbackIcon]="category().icon" [size]="24" />
        </div>
        <div class="header-info">
          <div class="title-row">
            <h3 class="category-name">{{ category().name }}</h3>
            <span class="count-pill">{{ category().skills.length }} Skills</span>
          </div>
          <p class="category-tagline">{{ getCategorySubtitle(category().name) }}</p>
        </div>
      </header>

      <!-- Advanced Skills Chip Grid (Real Tech Stack Logos) -->
      <div class="skills-grid" aria-label="Capabilities in this domain">
        @for (skill of category().skills; track skill.name) {
          <div class="skill-badge-item">
            <div class="skill-icon-pill">
              <app-tech-icon [name]="skill.name" [fallbackIcon]="skill.icon" [size]="18" />
            </div>
            <div class="skill-content">
              <span class="skill-label">{{ skill.name }}</span>
              <span class="skill-tier">
                <span class="tier-dot"></span>
                {{ getSkillTag(skill.level) }}
              </span>
            </div>
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
      align-items: flex-start;
      gap: 1rem;
      margin-block-end: 1.25rem;
      padding-block-end: 1.15rem;
      border-block-end: 1px solid var(--border-subtle);
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

    .header-info {
      display: grid;
      gap: 0.25rem;
      flex: 1;
      min-inline-size: 0;
    }

    .title-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
    }

    .category-name {
      margin: 0;
      font-size: 1.18rem;
      font-weight: 700;
      color: var(--text-primary);
      letter-spacing: -0.01em;
    }

    .count-pill {
      font-size: 0.72rem;
      font-weight: 600;
      padding: 0.2rem 0.55rem;
      border-radius: 9999px;
      background: var(--bg-surface-elevated);
      color: var(--text-muted);
      border: 1px solid var(--border-subtle);
    }

    .category-tagline {
      margin: 0;
      font-size: 0.82rem;
      color: var(--text-secondary);
      line-height: 1.4;
    }

    /* Skills Grid (replacing progress bars with clean interactive tiles) */
    .skills-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 8.5rem), 1fr));
      gap: 0.75rem;
      flex: 1;
      align-content: start;
    }

    .skill-badge-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.65rem 0.85rem;
      border-radius: 0.95rem;
      background: var(--bg-surface-elevated);
      border: 1px solid var(--border-subtle);
      transition: transform 180ms ease, border-color 180ms ease, background-color 180ms ease, box-shadow 180ms ease;

      &:hover {
        transform: translateY(-2px);
        border-color: var(--border-hover);
        background: var(--bg-pill);
        box-shadow: 0 4px 14px -2px var(--primary-glow);

        .skill-icon-pill {
          background: var(--gradient-primary);
          color: #ffffff;
          transform: scale(1.08);
        }

        .tier-dot {
          background: var(--primary);
          box-shadow: 0 0 6px var(--primary);
        }
      }
    }

    .skill-icon-pill {
      display: grid;
      place-items: center;
      inline-size: 2rem;
      block-size: 2rem;
      border-radius: 0.6rem;
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      color: var(--primary);
      flex-shrink: 0;
      transition: all 180ms ease;

      mat-icon {
        font-size: 1.1rem;
        inline-size: 1.1rem;
        block-size: 1.1rem;
      }
    }

    .skill-content {
      display: grid;
      gap: 0.15rem;
      min-inline-size: 0;
    }

    .skill-label {
      font-size: 0.88rem;
      font-weight: 600;
      color: var(--text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 1.2;
    }

    .skill-tier {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      font-size: 0.72rem;
      color: var(--text-muted);
      font-weight: 500;
    }

    .tier-dot {
      inline-size: 0.4rem;
      block-size: 0.4rem;
      border-radius: 50%;
      background: var(--success);
      flex-shrink: 0;
      transition: all 180ms ease;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkillCardComponent {
  readonly category = input.required<SkillCategory>();

  getSkillTag(level: number): string {
    if (level >= 96) return 'Core Stack';
    if (level >= 94) return 'Enterprise';
    if (level >= 90) return 'Production';
    return 'Specialized';
  }

  getCategorySubtitle(categoryName: string): string {
    const subtitles: Record<string, string> = {
      'Frontend': 'Reactive SPAs, SSR applications & component design systems',
      'Backend': 'Distributed microservices, resilient APIs & core business logic',
      'Database': 'High-concurrency relational schemas, indexing & transactional reliability',
      'AI & Voice Integrations': 'Real-time conversational voice agents, STT/TTS & LLM pipelines',
      'API Integrations & Payments': 'Multi-tier payment gateways, telephony IVR & third-party integrations',
      'DevOps & Tools': 'CI/CD automation, security hardening & system optimization',
      'Languages': 'Modern strongly typed and scripting languages for production',
      'Frameworks': 'Full-featured enterprise frameworks & robust design token systems',
      'Specializations': 'Domain expertise in voice AI, hospital logistics & legacy migrations',
      'Soft Skills': 'Technical architecture leadership, mentoring & cross-functional delivery'
    };

    return subtitles[categoryName] || 'Enterprise capabilities & production toolsets';
  }
}
