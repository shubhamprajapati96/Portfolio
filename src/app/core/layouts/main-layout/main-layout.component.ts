import { ChangeDetectionStrategy, Component, HostListener, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '@shared/components/footer/footer.component';
import { NavbarComponent } from '@shared/components/navbar/navbar.component';
import { ScrollTopButtonComponent } from '@shared/components/scroll-top-button/scroll-top-button.component';
import { routeTransition } from '@shared/animations/page.animations';
import { ScrollService } from '../../services/scroll.service';

@Component({
  selector: 'app-main-layout',
  imports: [FooterComponent, NavbarComponent, RouterOutlet, ScrollTopButtonComponent],
  template: `
    <a href="#main-content" class="skip-link">Skip to main content</a>
    <div class="layout-wrapper">
      <app-navbar />
      <main id="main-content" [@routeTransition]="outlet.activatedRouteData" tabindex="-1">
        <router-outlet #outlet="outlet" />
      </main>
      <app-footer />
      <app-scroll-top-button />
    </div>
  `,
  styles: `
    :host {
      display: block;
      min-block-size: 100vh;
    }

    .skip-link {
      position: absolute;
      inset-block-start: -100px;
      inset-inline-start: 1rem;
      z-index: 9999;
      padding: 0.75rem 1.25rem;
      border-radius: 0.5rem;
      background: var(--primary);
      color: #ffffff;
      font-weight: 700;
      text-decoration: none;
      box-shadow: var(--shadow-card);
      transition: inset-block-start 200ms ease;

      &:focus {
        inset-block-start: 1rem;
        outline: 3px solid #ffffff;
      }
    }

    .layout-wrapper {
      display: flex;
      flex-direction: column;
      min-block-size: 100vh;
    }

    main {
      flex: 1;
      min-block-size: 70vh;
      outline: none;
    }
  `,
  animations: [routeTransition],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainLayoutComponent {
  private readonly scrollService = inject(ScrollService);

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrollService.watch();
  }
}

