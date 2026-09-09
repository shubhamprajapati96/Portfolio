import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  imports: [MatDialogModule],
  template: `
    <h2 mat-dialog-title>{{ title() }}</h2>
    <mat-dialog-content>
      <ng-content />
    </mat-dialog-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogComponent {
  readonly title = input('Details');
}
