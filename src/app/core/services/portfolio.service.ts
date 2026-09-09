import { computed, Injectable, signal } from '@angular/core';
import { PORTFOLIO_DATA } from '../config/portfolio-data';

@Injectable({ providedIn: 'root' })
export class PortfolioService {
  private readonly data = signal(PORTFOLIO_DATA);

  readonly profile = computed(() => this.data().profile);
  readonly metrics = computed(() => this.data().metrics);
  readonly skills = computed(() => this.data().skills);
  readonly experiences = computed(() => this.data().experiences);
  readonly education = computed(() => this.data().education);
  readonly projects = computed(() => this.data().projects);
  readonly certifications = computed(() => this.data().certifications);
  readonly achievements = computed(() => this.data().achievements);
  readonly services = computed(() => this.data().services);
  readonly testimonials = computed(() => this.data().testimonials);
}
