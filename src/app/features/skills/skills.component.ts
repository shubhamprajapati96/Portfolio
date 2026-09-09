import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { PortfolioService } from '@core/services/portfolio.service';
import { SeoService } from '@core/services/seo.service';
import { staggerCards } from '@shared/animations/page.animations';
import { SectionHeaderComponent } from '@shared/components/section-header/section-header.component';
import { SkillCardComponent } from '@shared/components/skill-card/skill-card.component';
import { TechIconComponent } from '@shared/components/tech-icon/tech-icon.component';

@Component({
  selector: 'app-skills',
  imports: [
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    SectionHeaderComponent,
    SkillCardComponent,
    TechIconComponent
  ],
  template: `
    <section class="section skills-page">
      <div class="container">
        <app-section-header
          eyebrow="Core Competencies"
          title="Software Architecture & Engineering Tooling"
          description="A 7-year production engineering toolkit spanning reactive web frameworks, distributed microservices, conversational AI systems, and cloud databases."
        />

        <!-- Elevated Production Core Showcase -->
        <div class="production-core-showcase" aria-label="Core Technology Pillars">
          <div class="core-showcase-header">
            <span class="core-live-badge">
              <span class="pulse-beacon"></span>
              <span>PRODUCTION CORE</span>
            </span>
          </div>

          <div class="core-tech-grid">
            @for (tech of coreTechnologies; track tech.name) {
              <div class="core-tech-card">
                <div class="tech-icon-disc">
                  <app-tech-icon [name]="tech.name" [fallbackIcon]="tech.icon" [size]="22" />
                </div>
                <span class="tech-card-name">{{ tech.name }}</span>
              </div>
            }
          </div>
        </div>

        <div class="filter-bar" aria-label="Filter skill categories">
          <div class="filter-chips">
            <button
              type="button"
              class="filter-pill"
              [class.active]="activeFilter() === 'ALL'"
              (click)="setFilter('ALL')"
            >
              <span>All Capabilities</span>
              <span class="count-badge">{{ skills().length }}</span>
            </button>

            @for (category of skills(); track category.name) {
              <button
                type="button"
                class="filter-pill"
                [class.active]="activeFilter() === category.name"
                (click)="setFilter(category.name)"
              >
                <app-tech-icon [name]="category.name" [fallbackIcon]="category.icon" [size]="16" />
                <span>{{ category.name }}</span>
              </button>
            }
          </div>
        </div>

        <div class="skills-grid" @staggerCards>
          @for (category of filteredSkills(); track category.name) {
            <app-skill-card class="stagger-item" [category]="category" />
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    .skills-page {
      position: relative;
    }

    /* ==========================================================================
       PRODUCTION CORE SHOWCASE
       ========================================================================== */
    .production-core-showcase {
      padding: clamp(1.25rem, 2.5vw, 1.75rem);
      border-radius: 1.5rem;
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      box-shadow: 0 10px 30px -10px var(--primary-glow);
      margin-block-end: 2rem;
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      transition: border-color 250ms ease, box-shadow 250ms ease;

      &:hover {
        border-color: var(--border-hover);
      }
    }

    .core-showcase-header {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 1rem;
      padding-block-end: 1rem;
      margin-block-end: 1.25rem;
      border-block-end: 1px solid var(--border-subtle);
    }

    .core-live-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.35rem 0.85rem;
      border-radius: 9999px;
      background: var(--bg-pill);
      border: 1px solid var(--border-hover);
      color: var(--primary);
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;

      .pulse-beacon {
        inline-size: 0.5rem;
        block-size: 0.5rem;
        border-radius: 50%;
        background: var(--primary);
        box-shadow: 0 0 8px var(--primary);
        animation: pulseBeacon 2s infinite cubic-bezier(0.4, 0, 0.6, 1);
      }
    }

    @keyframes pulseBeacon {
      0%, 100% {
        opacity: 1;
        transform: scale(1);
      }
      50% {
        opacity: 0.4;
        transform: scale(1.3);
      }
    }

    .core-tech-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(min(100%, 11.5rem), 1fr));
      gap: 0.85rem;
    }

    .core-tech-card {
      display: flex;
      align-items: center;
      gap: 0.85rem;
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
        box-shadow: 0 8px 24px -4px var(--primary-glow);

        .tech-icon-disc {
          transform: scale(1.12);
          box-shadow: 0 0 16px var(--primary-glow);
        }
      }
    }

    .tech-icon-disc {
      display: grid;
      place-items: center;
      inline-size: 2.35rem;
      block-size: 2.35rem;
      border-radius: 0.7rem;
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      color: var(--primary);
      flex-shrink: 0;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
      transition: transform 200ms ease, box-shadow 200ms ease;

      mat-icon {
        font-size: 1.15rem;
        inline-size: 1.15rem;
        block-size: 1.15rem;
      }
    }

    .tech-card-name {
      font-size: 0.92rem;
      font-weight: 600;
      color: var(--text-primary);
      line-height: 1.35;
      word-break: normal;
      overflow-wrap: break-word;
    }

    .filter-bar {
      margin-block-end: 2rem;
      overflow-x: auto;
      padding-block-end: 0.5rem;
      scrollbar-width: thin;

      &::-webkit-scrollbar {
        block-size: 4px;
      }

      &::-webkit-scrollbar-thumb {
        background: var(--border-subtle);
        border-radius: 9999px;
      }
    }

    .filter-chips {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      min-inline-size: max-content;
    }

    .filter-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      padding: 0.5rem 1rem;
      border-radius: 9999px;
      border: 1px solid var(--border-subtle);
      background: var(--bg-surface-elevated);
      color: var(--text-secondary);
      font-size: 0.85rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 180ms ease;

      mat-icon {
        font-size: 1.05rem;
        inline-size: 1.05rem;
        block-size: 1.05rem;
        color: var(--secondary);
      }

      .count-badge {
        display: inline-grid;
        place-items: center;
        padding-inline: 0.45rem;
        min-inline-size: 1.25rem;
        block-size: 1.25rem;
        border-radius: 9999px;
        background: var(--bg-pill);
        color: var(--primary);
        font-size: 0.74rem;
        font-weight: 700;
      }

      &:hover {
        background: var(--bg-pill);
        border-color: var(--border-hover);
        color: var(--text-primary);
      }

      &.active {
        background: var(--gradient-primary);
        color: #ffffff;
        border-color: transparent;
        box-shadow: 0 4px 14px -2px var(--primary-glow);

        mat-icon {
          color: #ffffff;
        }

        .count-badge {
          background: rgba(255, 255, 255, 0.25);
          color: #ffffff;
        }
      }
    }

    .skills-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: clamp(1.25rem, 3vw, 1.75rem);
      align-items: stretch;
    }
  `,
  animations: [staggerCards],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkillsComponent {
  private readonly portfolio = inject(PortfolioService);
  private readonly seo = inject(SeoService);

  readonly skills = this.portfolio.skills;
  readonly activeFilter = signal<string>('ALL');

  readonly coreTechnologies = [
    { name: 'React.js', icon: 'code' },
    { name: 'Angular', icon: 'change_history' },
    { name: 'Next.js', icon: 'view_in_ar' },
    { name: 'PHP / Laravel', icon: 'developer_mode' },
    { name: 'Node.js', icon: 'api' },
    { name: 'Git', icon: 'commit' },
    { name: 'Microservices', icon: 'account_tree' },
    { name: 'LiveKit Voice AI', icon: 'graphic_eq' },
    { name: 'ElevenLabs', icon: 'record_voice_over' },
    { name: 'OpenAI API', icon: 'psychology' },
    { name: 'Twilio IVR', icon: 'ring_volume' },
    { name: 'Stripe API', icon: 'credit_card' },
    { name: 'PostgreSQL', icon: 'storage' },
    { name: 'MySQL', icon: 'table_chart' }
  ];

  readonly filteredSkills = computed(() => {
    const filter = this.activeFilter();
    if (filter === 'ALL') {
      return this.skills();
    }
    return this.skills().filter((c) => c.name === filter);
  });

  constructor() {
    this.seo.update({
      title: 'Skills | Shubham Prajapati',
      description: 'React, Angular, Next.js, PHP, Laravel, Node.js, PostgreSQL, MySQL, Microservices, Twilio, and Stripe API skills.'
    });
  }

  setFilter(categoryName: string): void {
    this.activeFilter.set(categoryName);
  }
}
