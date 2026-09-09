import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProjectService } from '@core/services/project.service';
import { SeoService } from '@core/services/seo.service';
import { staggerCards } from '@shared/animations/page.animations';
import { ProjectCardComponent } from '@shared/components/project-card/project-card.component';
import { SectionHeaderComponent } from '@shared/components/section-header/section-header.component';

@Component({
  selector: 'app-projects',
  imports: [MatButtonModule, MatIconModule, ProjectCardComponent, SectionHeaderComponent],
  template: `
    <section class="section projects-page">
      <div class="container">
        <app-section-header
          eyebrow="Featured Case Studies"
          title="Selected systems with measurable engineering outcomes."
          description="Production platforms engineered for speed, enterprise accessibility, modular design token architecture, and high reliability."
        />

        <div class="filter-bar" aria-label="Filter projects by technology">
          <div class="filter-chips">
            <button
              type="button"
              class="filter-pill"
              [class.active]="selectedTech() === 'ALL'"
              (click)="setTech('ALL')"
            >
              <span>All Projects</span>
              <span class="count-badge">{{ projects().length }}</span>
            </button>

            @for (tech of availableTechnologies(); track tech) {
              <button
                type="button"
                class="filter-pill"
                [class.active]="selectedTech() === tech"
                (click)="setTech(tech)"
              >
                <span>{{ tech }}</span>
              </button>
            }
          </div>
        </div>

        <div class="grid-auto projects-grid" @staggerCards>
          @for (project of filteredProjects(); track project.id) {
            <app-project-card class="stagger-item" [project]="project" [showTechStack]="false" [priority]="$index < 2" />
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    .projects-page {
      position: relative;
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

        .count-badge {
          background: rgba(255, 255, 255, 0.25);
          color: #ffffff;
        }
      }
    }

    .projects-grid {
      align-items: stretch;
    }
  `,
  animations: [staggerCards],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsComponent {
  private readonly projectService = inject(ProjectService);
  private readonly seo = inject(SeoService);

  readonly projects = this.projectService.projects;
  readonly selectedTech = signal<string>('ALL');

  readonly availableTechnologies = computed(() => {
    const techSet = new Set<string>();
    for (const project of this.projects()) {
      for (const t of project.technologies) {
        techSet.add(t);
      }
    }
    return Array.from(techSet);
  });

  readonly filteredProjects = computed(() => {
    const tech = this.selectedTech();
    if (tech === 'ALL') {
      return this.projects();
    }
    return this.projects().filter((p) => p.technologies.includes(tech));
  });

  constructor() {
    this.seo.update({
      title: 'Projects | Shubham Prajapati',
      description: 'SaaS and software engineering projects with live demos, technologies, and architecture details.'
    });
  }

  setTech(tech: string): void {
    this.selectedTech.set(tech);
  }
}

