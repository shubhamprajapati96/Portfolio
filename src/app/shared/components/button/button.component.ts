import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-button',
  imports: [MatButtonModule, MatIconModule],
  template: `
    <a mat-flat-button [href]="href()" [attr.aria-label]="label()">
      @if (icon()) {
        <mat-icon aria-hidden="true">{{ icon() }}</mat-icon>
      }
      {{ label() }}
    </a>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent {
  readonly label = input.required<string>();
  readonly href = input('#');
  readonly icon = input('');
}
