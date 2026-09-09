import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-chip',
  imports: [MatChipsModule],
  template: `<mat-chip>{{ label() }}</mat-chip>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChipComponent {
  readonly label = input.required<string>();
}
