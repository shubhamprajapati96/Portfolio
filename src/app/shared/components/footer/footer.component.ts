import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { APP_CONFIG, NAVIGATION_ITEMS, SOCIAL_LINKS } from '@core/constants/app.constants';
import { DateHelper } from '@core/helper/date.helper';

@Component({
  selector: 'app-footer',
  imports: [MatDividerModule, MatIconModule, RouterLink],
  template: `
    <footer class="footer">
      <div class="footer-inner">
        <section class="footer-brand-section">
          <div class="brand-header">
            <span class="brand-mark">SP</span>
            <div class="brand-text">
              <h2>{{ config.name }}</h2>
              <p class="brand-title">{{ config.title }}</p>
            </div>
          </div>
          <p class="brand-tagline">
            Building scalable SaaS platforms, robust microservices, and high-performance web applications with Angular, React, Node.js, and Laravel.
          </p>
          <div class="status-pill">
            <span class="dot"></span>
            <span>Available for Full Stack & Microservices Opportunities</span>
          </div>
        </section>

        <section class="footer-nav-section">
          <h3 class="section-title">Navigation</h3>
          <nav aria-label="Footer navigation" class="footer-nav-links">
            @for (item of navItems; track item.path) {
              <a [routerLink]="item.path" class="footer-nav-link">
                <mat-icon aria-hidden="true">{{ item.icon }}</mat-icon>
                <span>{{ item.label }}</span>
              </a>
            }
          </nav>
        </section>

        <section class="footer-contact-section">
          <h3 class="section-title">Connect</h3>
          <div class="contact-items">
            <a [href]="'mailto:' + config.email" class="contact-link">
              <mat-icon aria-hidden="true">alternate_email</mat-icon>
              <span>{{ config.email }}</span>
            </a>
            <a [href]="'tel:' + config.phone" class="contact-link">
              <mat-icon aria-hidden="true">call</mat-icon>
              <span>{{ config.phone }}</span>
            </a>
            <div class="contact-location">
              <mat-icon aria-hidden="true">location_on</mat-icon>
              <span>{{ config.location }}</span>
            </div>
          </div>

          <div class="social-pills" aria-label="Social profiles">
            @for (link of socialLinks; track link.url) {
              <a [href]="link.url" target="_blank" rel="noreferrer" [attr.aria-label]="link.label" class="social-pill">
                <mat-icon aria-hidden="true">{{ link.icon }}</mat-icon>
                <span class="social-label">{{ link.label }}</span>
              </a>
            }
          </div>
        </section>
      </div>

      <div class="footer-bottom">
        <mat-divider />
        <div class="bottom-content">
          <p class="copyright">© {{ year }} {{ config.name }}. All rights reserved.</p>
          <p class="credits">Crafted with Angular 22, Signals, and Material 3</p>
        </div>
      </div>
    </footer>
  `,
  styles: `
    .footer {
      padding-block: clamp(3rem, 6vw, 4.5rem) 2rem;
      border-block-start: 1px solid var(--border-subtle);
      background: var(--bg-surface);
      color: var(--text-secondary);
      transition: background-color 250ms ease, border-color 250ms ease;
    }

    .footer-inner {
      display: grid;
      gap: 2.5rem;
      inline-size: min(100% - clamp(1.5rem, 5vw, 3.5rem), 1200px);
      margin-inline: auto;
    }

    .footer-brand-section {
      display: grid;
      gap: 1rem;
      max-inline-size: 420px;
    }

    .brand-header {
      display: flex;
      align-items: center;
      gap: 0.85rem;
    }

    .brand-mark {
      display: grid;
      place-items: center;
      inline-size: 2.5rem;
      block-size: 2.5rem;
      border-radius: 0.75rem;
      background: var(--gradient-primary);
      color: #ffffff;
      font-size: 0.95rem;
      font-weight: 800;
      box-shadow: 0 6px 16px -2px var(--primary-glow);
    }

    .brand-text {
      display: grid;
      gap: 0.1rem;

      h2 {
        margin: 0;
        color: var(--text-primary);
        font-size: 1.25rem;
        font-weight: 700;
      }

      .brand-title {
        margin: 0;
        color: var(--primary);
        font-size: 0.84rem;
        font-weight: 600;
      }
    }

    .brand-tagline {
      margin: 0;
      color: var(--text-secondary);
      font-size: 0.9rem;
      line-height: 1.65;
    }

    .status-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      width: fit-content;
      padding: 0.35rem 0.8rem;
      border-radius: 9999px;
      background: var(--bg-pill);
      border: 1px solid var(--border-hover);
      color: var(--text-secondary);
      font-size: 0.78rem;
      font-weight: 500;

      .dot {
        inline-size: 0.45rem;
        block-size: 0.45rem;
        border-radius: 50%;
        background: var(--success);
        box-shadow: 0 0 6px var(--success);
      }
    }

    .section-title {
      margin: 0 0 1rem;
      color: var(--text-primary);
      font-size: 1rem;
      font-weight: 700;
      letter-spacing: -0.01em;
    }

    .footer-nav-links {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.65rem 1rem;
    }

    .footer-nav-link {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      color: var(--text-secondary);
      font-size: 0.88rem;
      padding: 0.25rem 0;
      transition: color 180ms ease, transform 180ms ease;

      mat-icon {
        color: var(--secondary);
        font-size: 1.1rem;
        inline-size: 1.1rem;
        block-size: 1.1rem;
      }

      &:hover {
        color: var(--primary);
        transform: translateX(3px);
      }
    }

    .footer-contact-section {
      display: grid;
      gap: 1rem;
    }

    .contact-items {
      display: grid;
      gap: 0.65rem;
    }

    .contact-link,
    .contact-location {
      display: inline-flex;
      align-items: center;
      gap: 0.55rem;
      color: var(--text-secondary);
      font-size: 0.88rem;

      mat-icon {
        color: var(--secondary);
        font-size: 1.1rem;
        inline-size: 1.1rem;
        block-size: 1.1rem;
      }
    }

    .contact-link:hover {
      color: var(--primary);
    }

    .social-pills {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-block-start: 0.5rem;
    }

    .social-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.45rem 0.85rem;
      border-radius: 0.75rem;
      background: var(--bg-surface-elevated);
      border: 1px solid var(--border-subtle);
      color: var(--text-secondary);
      font-size: 0.82rem;
      font-weight: 500;
      transition: all 180ms ease;

      mat-icon {
        font-size: 1.1rem;
        inline-size: 1.1rem;
        block-size: 1.1rem;
        color: var(--primary);
      }

      &:hover {
        background: var(--bg-pill);
        border-color: var(--border-hover);
        color: var(--text-primary);
        transform: translateY(-2px);
      }
    }

    .footer-bottom {
      inline-size: min(100% - clamp(1.5rem, 5vw, 3.5rem), 1200px);
      margin-inline: auto;
      margin-block-start: 2rem;

      mat-divider {
        border-color: var(--border-subtle) !important;
        margin-block-end: 1.5rem;
      }
    }

    .bottom-content {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      color: var(--text-muted);
      font-size: 0.84rem;

      p {
        margin: 0;
      }
    }

    @media (min-width: 48rem) {
      .footer-inner {
        grid-template-columns: 1.2fr 1fr;
      }

      .footer-contact-section {
        grid-column: 1 / -1;
      }
    }

    @media (min-width: 64rem) {
      .footer-inner {
        grid-template-columns: 1.4fr 0.9fr 1.1fr;
      }

      .footer-contact-section {
        grid-column: auto;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {
  readonly config = APP_CONFIG;
  readonly navItems = NAVIGATION_ITEMS;
  readonly socialLinks = SOCIAL_LINKS;
  readonly year = DateHelper.year();
}

