import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NAVIGATION_ITEMS } from '@core/constants/app.constants';
import { NavigationItem } from '@core/interfaces/portfolio.interfaces';
import { ScrollService } from '@core/services/scroll.service';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-navbar',
  imports: [MatButtonModule, MatIconModule, MatToolbarModule, ThemeToggleComponent],
  template: `
    <header class="navbar-wrapper">
      <mat-toolbar class="navbar" role="navigation" aria-label="Primary navigation">
        <a class="brand" href="javascript:void(0)" (click)="onNavClick({ label: 'Home', path: '/', icon: 'home' }, $event)" aria-label="Shubham Prajapati home">
          <span class="brand-mark">SP</span>
          <span class="brand-name">Shubham Prajapati</span>
        </a>

        <nav class="desktop-nav" aria-label="Main menu">
          @for (item of items; track item.path) {
            <a
              href="javascript:void(0)"
              class="nav-link"
              [class.active]="scrollService.activeSection() === mapPathToSection(item.path)"
              (click)="onNavClick(item, $event)"
            >
              <span>{{ item.label }}</span>
            </a>
          }
        </nav>

        <span class="spacer"></span>

        <div class="nav-actions">
          <app-theme-toggle />
          <a
            mat-flat-button
            color="primary"
            href="javascript:void(0)"
            (click)="onNavClick({ label: 'Contact', path: '/contact', icon: 'mail' }, $event)"
            class="cta-button"
          >
            <span>Hire Me</span>
            <mat-icon aria-hidden="true">arrow_forward</mat-icon>
          </a>
          <button
            type="button"
            mat-icon-button
            class="menu-button"
            [attr.aria-expanded]="isMenuOpen()"
            aria-label="Toggle navigation menu"
            (click)="toggleMenu()"
          >
            <mat-icon>{{ isMenuOpen() ? 'close' : 'menu' }}</mat-icon>
          </button>
        </div>
      </mat-toolbar>

      @if (isMenuOpen()) {
        <div class="mobile-backdrop" (click)="closeMenu()" aria-hidden="true"></div>
        <nav class="mobile-drawer" aria-label="Mobile navigation">
          <div class="mobile-drawer-inner">
            @for (item of items; track item.path) {
              <a
                href="javascript:void(0)"
                class="mobile-nav-link"
                [class.active]="scrollService.activeSection() === mapPathToSection(item.path)"
                (click)="onNavClick(item, $event)"
              >
                <span class="mobile-label">{{ item.label }}</span>
              </a>
            }
            <div class="mobile-cta-wrap">
              <a
                mat-flat-button
                color="primary"
                href="javascript:void(0)"
                (click)="onNavClick({ label: 'Contact', path: '/contact', icon: 'mail' }, $event)"
                class="mobile-cta"
              >
                <span>Hire Me</span>
                <mat-icon aria-hidden="true">arrow_forward</mat-icon>
              </a>
            </div>
          </div>
        </nav>
      }
    </header>
  `,
  styles: `
    :host {
      position: sticky;
      inset-block-start: 0;
      z-index: 100;
      display: block;
    }

    .navbar-wrapper {
      position: relative;
      background: var(--bg-glass);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border-block-end: 1px solid var(--border-subtle);
      transition: background-color 250ms ease, border-color 250ms ease;
    }

    .navbar {
      inline-size: min(100% - clamp(1rem, 4vw, 3rem), 1200px);
      min-block-size: 4.5rem;
      margin-inline: auto;
      padding-inline: 0;
      background: transparent;
      display: flex;
      align-items: center;
    }

    .brand {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      text-decoration: none;
      color: var(--text-primary);
    }

    .brand-mark {
      display: grid;
      place-items: center;
      inline-size: 2.6rem;
      block-size: 2.6rem;
      border-radius: 0.75rem;
      background: var(--gradient-primary);
      color: #ffffff;
      font-size: 0.95rem;
      font-weight: 900;
      letter-spacing: -0.05em;
      box-shadow: 0 8px 20px -2px var(--primary-glow);
      transition: transform 250ms cubic-bezier(0.4, 0, 0.2, 1);
    }

    .brand:hover .brand-mark {
      transform: scale(1.06) rotate(-3deg);
    }

    .brand-name {
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .desktop-nav {
      display: none;
      align-items: center;
      gap: 0.35rem;
      margin-inline-start: 1.75rem;
      padding: 0.3rem;
      border-radius: 9999px;
      background: var(--bg-pill);
      border: 1px solid var(--border-subtle);
    }

    .nav-link {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.45rem 1.05rem;
      border-radius: 9999px;
      font-size: 0.88rem;
      font-weight: 500;
      color: var(--text-secondary);
      transition: all 200ms ease;

      &:hover {
        color: var(--text-primary);
        background: var(--bg-surface-elevated);
      }

      &.active {
        color: #ffffff;
        background: var(--gradient-primary);
        font-weight: 600;
        box-shadow: 0 4px 14px -2px var(--primary-glow);
      }
    }

    .spacer {
      flex: 1;
    }

    .nav-actions {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }

    .cta-button {
      display: none;
      border-radius: 9999px !important;
      font-weight: 600 !important;
      padding-inline: 1.15rem !important;
      min-block-size: 2.6rem !important;
    }

    .menu-button {
      color: var(--text-primary);
    }

    .mobile-backdrop {
      position: fixed;
      inset: 0;
      z-index: 98;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(4px);
      animation: fadeIn 200ms ease;
    }

    .mobile-drawer {
      position: absolute;
      inset-inline: clamp(0.75rem, 3vw, 1.5rem);
      inset-block-start: calc(100% + 0.5rem);
      z-index: 99;
      animation: slideDown 250ms cubic-bezier(0.16, 1, 0.3, 1);
    }

    .mobile-drawer-inner {
      display: grid;
      gap: 0.4rem;
      padding: 1rem;
      border-radius: 1.25rem;
      background: var(--bg-surface);
      border: 1px solid var(--border-card);
      box-shadow: var(--shadow-card);
      max-block-size: calc(100svh - 6rem);
      overflow-y: auto;
    }

    .mobile-nav-link {
      display: flex;
      align-items: center;
      min-block-size: 2.75rem;
      padding: 0.6rem 1.1rem;
      border-radius: 0.875rem;
      color: var(--text-secondary);
      font-weight: 500;
      transition: all 180ms ease;

      .mobile-label {
        font-size: 0.95rem;
      }

      &:hover,
      &:active {
        color: var(--text-primary);
        background: var(--bg-surface-elevated);
      }

      &.active {
        color: #ffffff;
        background: var(--gradient-primary);
        font-weight: 600;
        box-shadow: 0 4px 14px -2px var(--primary-glow);
      }
    }

    .mobile-cta-wrap {
      margin-block-start: 0.5rem;
      padding-block-start: 0.75rem;
      border-block-start: 1px solid var(--border-subtle);
    }

    .mobile-cta {
      inline-size: 100%;
      min-block-size: 3rem !important;
      border-radius: 0.875rem !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 0.5rem !important;
      font-weight: 600 !important;
    }

    @media (min-width: 64rem) {
      .desktop-nav {
        display: inline-flex;
      }

      .cta-button {
        display: inline-flex;
      }

      .menu-button {
        display: none;
      }

      .mobile-backdrop,
      .mobile-drawer {
        display: none !important;
      }
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px) scale(0.98);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {
  private readonly router = inject(Router);
  readonly scrollService = inject(ScrollService);
  readonly items = NAVIGATION_ITEMS;
  readonly isMenuOpen = signal(false);

  mapPathToSection(path: string): string {
    const clean = path.replace(/^\//, '').trim();
    if (!clean || clean === 'home') return 'home';
    return clean;
  }

  onNavClick(item: NavigationItem, event: Event): void {
    event.preventDefault();
    this.closeMenu();
    const sectionId = this.mapPathToSection(item.path);

    if (this.router.url === '/' || this.router.url.startsWith('/#')) {
      this.scrollService.scrollToSection(sectionId);
    } else {
      this.router.navigate(['/'], { fragment: sectionId }).then(() => {
        setTimeout(() => this.scrollService.scrollToSection(sectionId), 100);
      });
    }
  }

  toggleMenu(): void {
    this.isMenuOpen.update((value) => !value);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  @HostListener('window:keydown.escape')
  onEscape(): void {
    if (this.isMenuOpen()) {
      this.closeMenu();
    }
  }
}


