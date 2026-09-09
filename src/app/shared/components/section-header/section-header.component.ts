import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-section-header',
  template: `
    <header class="section-header">
      <div class="eyebrow-badge">
        <span class="pulse-indicator"></span>
        <span class="eyebrow-text">{{ eyebrow() }}</span>
      </div>
      <h1 class="header-title">{{ title() }}</h1>
      <p class="header-description">{{ description() }}</p>
    </header>
  `,
  styles: `
    .section-header {
      display: grid;
      gap: 0.85rem;
      max-inline-size: 820px;
      margin-block-end: clamp(1.75rem, 4vw, 3rem);
    }

    .eyebrow-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      width: fit-content;
      padding: 0.35rem 0.85rem;
      border-radius: 9999px;
      background: var(--bg-pill);
      border: 1px solid var(--border-hover);
      color: var(--primary);
    }

    .pulse-indicator {
      inline-size: 0.5rem;
      block-size: 0.5rem;
      border-radius: 50%;
      background: var(--primary);
      box-shadow: 0 0 8px var(--primary-glow);
    }

    .eyebrow-text {
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      font-size: 0.76rem;
    }

    .header-title {
      margin: 0;
      color: var(--text-primary);
      font-size: clamp(2rem, 5.5vw, 3.75rem);
      font-weight: 800;
      line-height: 1.08;
      letter-spacing: -0.02em;
    }

    .header-description {
      margin: 0;
      color: var(--text-secondary);
      font-size: clamp(0.95rem, 1.8vw, 1.15rem);
      line-height: 1.75;
      max-inline-size: 680px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SectionHeaderComponent {
  readonly eyebrow = input.required<string>();
  readonly title = input.required<string>();
  readonly description = input.required<string>();
}

