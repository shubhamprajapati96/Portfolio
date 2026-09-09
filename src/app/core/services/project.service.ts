import { computed, inject, Injectable } from '@angular/core';
import { PortfolioService } from './portfolio.service';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private readonly portfolio = inject(PortfolioService);

  readonly projects = computed(() => this.portfolio.projects());

  findById(projectId: string) {
    return this.projects().find((project) => project.id === projectId);
  }
}
