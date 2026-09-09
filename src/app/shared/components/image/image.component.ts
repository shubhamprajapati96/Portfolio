import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-image',
  template: `<img [src]="src()" [alt]="alt()" [loading]="loading()" />`,
  styles: `
    img {
      inline-size: 100%;
      block-size: 100%;
      object-fit: cover;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageComponent {
  readonly src = input.required<string>();
  readonly alt = input.required<string>();
  readonly loading = input<'lazy' | 'eager'>('lazy');
}
