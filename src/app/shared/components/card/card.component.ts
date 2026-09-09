import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-card',
  imports: [MatCardModule],
  template: `
    <mat-card appearance="outlined">
      @if (title()) {
        <mat-card-header>
          <mat-card-title>{{ title() }}</mat-card-title>
        </mat-card-header>
      }
      <mat-card-content>
        <ng-content />
      </mat-card-content>
    </mat-card>
  `,
  styles: `
    mat-card {
      height: 100%;
      border-radius: 1.25rem;
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      box-shadow: var(--shadow-card);
      color: var(--text-primary);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent {
  readonly title = input('');
}
