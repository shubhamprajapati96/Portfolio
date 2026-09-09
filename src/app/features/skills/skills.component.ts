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
          title="Full Stack Architecture & Engineering Tooling"
          description="A 7-year production engineering toolkit spanning reactive web frameworks, distributed microservices, conversational AI systems, and cloud databases."
        />

        <!-- Featured Core Tech Stack Spotlight Ribbon -->
        <div class="tech-spotlight-bar" aria-label="Core Technology Pillars">
          <div class="spotlight-title">
            <mat-icon aria-hidden="true">stars</mat-icon>
            <span>Production Core:</span>
          </div>
          <div class="spotlight-tags">
            @for (tech of coreTechnologies; track tech.name) {
              <div class="spotlight-chip">
                <app-tech-icon [name]="tech.name" [fallbackIcon]="tech.icon" [size]="16" />
                <span class="chip-name">{{ tech.name }}</span>
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

    /* Core Tech Spotlight Ribbon */
    .tech-spotlight-bar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.85rem;
      padding: 0.85rem 1.25rem;
      border-radius: 1.15rem;
      background: var(--bg-card);
      border: 1px solid var(--border-hover);
      box-shadow: 0 4px 20px -4px var(--primary-glow);
      margin-block-end: 1.5rem;
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
    }

    .spotlight-title {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      color: var(--primary);
      font-size: 0.84rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      flex-shrink: 0;

      mat-icon {
        font-size: 1.15rem;
        inline-size: 1.15rem;
        block-size: 1.15rem;
      }
    }

    .spotlight-tags {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.45rem;
      flex: 1;
    }

    .spotlight-chip {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.3rem 0.65rem;
      border-radius: 9999px;
      background: var(--bg-surface-elevated);
      border: 1px solid var(--border-subtle);
      color: var(--text-primary);
      font-size: 0.8rem;
      font-weight: 600;
      transition: all 180ms ease;

      .chip-icon {
        font-size: 0.95rem;
        inline-size: 0.95rem;
        block-size: 0.95rem;
        color: var(--primary);
      }

      &:hover {
        border-color: var(--border-hover);
        background: var(--bg-pill);
        transform: translateY(-2px);
        box-shadow: 0 2px 10px var(--primary-glow);
      }
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
      gap: clamp(1.25rem, 3vw, 2rem);
      align-items: stretch;

      @media (min-width: 48rem) {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
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
