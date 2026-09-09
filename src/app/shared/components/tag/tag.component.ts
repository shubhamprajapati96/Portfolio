import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-tag',
  template: `<span>#{{ label() }}</span>`,
  styles: `
    span {
      color: #9ca3af;
      font-size: 0.86rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagComponent {
  readonly label = input.required<string>();
}
