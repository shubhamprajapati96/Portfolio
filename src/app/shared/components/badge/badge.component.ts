import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-badge',
  template: `<span>{{ label() }}</span>`,
  styles: `
    span {
      display: inline-flex;
      align-items: center;
      min-block-size: 1.85rem;
      padding-inline: 0.85rem;
      border-radius: 9999px;
      background: var(--bg-pill);
      border: 1px solid var(--border-hover);
      color: var(--primary);
      font-size: 0.8rem;
      font-weight: 700;
      letter-spacing: 0.02em;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BadgeComponent {
  readonly label = input.required<string>();
}
