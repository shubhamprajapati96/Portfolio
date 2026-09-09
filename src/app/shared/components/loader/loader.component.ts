import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loader',
  imports: [MatProgressSpinnerModule],
  template: `<mat-spinner [diameter]="diameter()" aria-label="Loading content" />`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoaderComponent {
  readonly diameter = input(36);
}
