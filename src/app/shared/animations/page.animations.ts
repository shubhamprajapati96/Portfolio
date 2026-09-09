import {
  animate,
  group,
  query,
  stagger,
  style,
  transition,
  trigger
} from '@angular/animations';

export const fadeIn = trigger('fadeIn', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(16px)' }),
    animate('420ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
  ])
]);

export const scaleIn = trigger('scaleIn', [
  transition(':enter', [
    style({ opacity: 0, transform: 'scale(.96)' }),
    animate('360ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
  ])
]);

export const staggerCards = trigger('staggerCards', [
  transition(':enter', [
    query(
      '.stagger-item',
      [
        style({ opacity: 0, transform: 'translateY(18px)' }),
        stagger(70, animate('360ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })))
      ],
      { optional: true }
    )
  ])
]);

export const routeTransition = trigger('routeTransition', [
  transition('* <=> *', [
    group([
      query(':enter', [style({ opacity: 0 }), animate('220ms ease-out', style({ opacity: 1 }))], {
        optional: true
      })
    ])
  ])
]);
