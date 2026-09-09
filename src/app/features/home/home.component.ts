import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { SOCIAL_LINKS } from '@core/constants/app.constants';
import { ContactRequest } from '@core/interfaces/portfolio.interfaces';
import { ContactService } from '@core/services/contact.service';
import { PortfolioService } from '@core/services/portfolio.service';
import { ScrollService } from '@core/services/scroll.service';
import { SeoService } from '@core/services/seo.service';
import { SnackbarService } from '@core/services/snackbar.service';
import { fadeIn, staggerCards } from '@shared/animations/page.animations';
import { ContactFormComponent } from '@shared/components/contact-form/contact-form.component';
import { ProjectCardComponent } from '@shared/components/project-card/project-card.component';
import { SkillCardComponent } from '@shared/components/skill-card/skill-card.component';
import { SocialIconsComponent } from '@shared/components/social-icons/social-icons.component';
import { TechIconComponent } from '@shared/components/tech-icon/tech-icon.component';

@Component({
  selector: 'app-home',
  imports: [
    ContactFormComponent,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    ProjectCardComponent,
    RouterLink,
    SkillCardComponent,
    SocialIconsComponent,
    TechIconComponent
  ],
  template: `
    <!-- 1. HERO SECTION (Introduction & Photo Split) -->
    <section id="home" class="hero" @fadeIn>
      <div class="hero-bg-glow" aria-hidden="true"></div>
      <div class="hero-grid-pattern" aria-hidden="true"></div>

      <div class="container hero-inner">
        <div class="hero-copy">
          <div class="status-pill">
            <span class="pulse-dot"></span>
            <span class="status-text">{{ profile().availability }}</span>
          </div>

          <h1 class="hero-title">
            Hi, I'm <span class="gradient-text">{{ profile().name }}</span>
          </h1>

          <h2 class="hero-subtitle">{{ profile().title }}</h2>

          <p class="hero-intro">{{ profile().intro }}</p>

          <div class="hero-actions">
            <a
              mat-flat-button
              color="primary"
              href="javascript:void(0)"
              (click)="scrollTo('projects')"
              class="primary-btn"
            >
              <mat-icon aria-hidden="true">work</mat-icon>
              <span>Explore Projects</span>
            </a>
            <a
              mat-stroked-button
              href="javascript:void(0)"
              (click)="scrollTo('contact')"
              class="secondary-btn"
            >
              <mat-icon aria-hidden="true">send</mat-icon>
              <span>Get In Touch</span>
            </a>
            <a mat-button [href]="profile().resumeUrl" download class="resume-btn">
              <mat-icon aria-hidden="true">download</mat-icon>
              <span>Resume</span>
            </a>
          </div>

          <div class="social-wrapper">
            <span class="social-caption">Connect with me:</span>
            <app-social-icons [links]="socialLinks" />
          </div>
        </div>

        <div class="hero-visual">
          <div class="profile-glow-ring" aria-hidden="true"></div>
          <figure class="profile-card">
            <img [src]="profile().imageUrl" [alt]="profile().name" fetchpriority="high" />
            <figcaption class="profile-badge">
              <div class="badge-icon">
                <mat-icon aria-hidden="true">verified</mat-icon>
              </div>
              <div class="badge-content">
                <strong>Software Developer</strong>
                <span>React · Angular · Next.js · Laravel</span>
              </div>
            </figcaption>
          </figure>

          <div class="floating-stat-card">
            <span class="stat-number">7+</span>
            <span class="stat-desc">Years of Production Experience</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 2. ABOUT & METRICS (4 Hand-Drawn Circles) -->
    <section id="about" class="section about-section" @staggerCards>
      <div class="container">
        <div class="about-header-wrap">
          <div class="eyebrow-badge">
            <span class="pulse-dot"></span>
            <span>About & Highlights</span>
          </div>
          <h2 class="section-heading-title">Engineering robust systems for 7+ years.</h2>
          <p class="section-heading-desc">{{ profile().summary }}</p>
        </div>

        <!-- 4 Distinct Circles: ( exp. ) ( 15+ ) ( 35+ ) ( 99.9% ) -->
        <div class="circular-metrics-row">
          @for (metric of metrics(); track metric.label) {
            <article class="circular-metric-card stagger-item">
              <div class="circle-ring-glow" aria-hidden="true"></div>
              <div class="circle-inner">
                <strong class="circle-value">{{ metric.value }}</strong>
                <span class="circle-label">{{ metric.label }}</span>
              </div>
            </article>
          }
        </div>
      </div>
    </section>

    <!-- 3. WORKING EXPERIENCE (Continuous Animated Dotted Timeline) -->
    <section id="experience" class="section experience-section">
      <div class="container">
        <div class="experience-header-wrap">
          <div class="eyebrow-badge">
            <span class="pulse-dot"></span>
            <span>Career Journey</span>
          </div>
          <h2 class="section-heading-title">Working Experience</h2>
          <p class="section-heading-desc">
            A continuous progression of technical leadership, SaaS platform development, and scalable microservices engineering.
          </p>
        </div>

        <div class="timeline-container">
          <!-- Continuous Animated Dotted Track flowing downward -->
          <div class="timeline-spine" aria-hidden="true"></div>

          <!-- Timeline Node 1: DEVtrust -->
          <div class="timeline-item">
            <div class="node-anchor">
              <div class="node-marker">
                <mat-icon aria-hidden="true">domain</mat-icon>
              </div>
            </div>

            <article class="timeline-content-card">
              <header class="timeline-card-header">
                <div class="node-brand-banner">
                  <span class="arrow-indicator">→</span>
                  <span class="brand-text">DEVtrust</span>
                  <span class="tenure-badge">June 2021 – August 2026 · 5+ Years</span>
                </div>
                <h3 class="role-heading">{{ experiences()[0].position }}</h3>
                <div class="company-subline">
                  <strong class="full-company-name">{{ experiences()[0].company }}</strong>
                  <span class="dot-separator">·</span>
                  <span class="company-location">
                    <mat-icon aria-hidden="true">location_on</mat-icon>
                    {{ experiences()[0].location }}
                  </span>
                </div>
              </header>

              <div class="timeline-highlights">
                <h4 class="highlights-title">Key Projects & Deliverables:</h4>
                <ul class="responsibilities-list">
                  @for (resp of experiences()[0].responsibilities; track resp) {
                    <li>
                      <mat-icon class="check-bullet" aria-hidden="true">check_circle</mat-icon>
                      <span>{{ resp }}</span>
                    </li>
                  }
                </ul>
              </div>

              <div class="tech-chip-cloud" aria-label="Technologies used at DEVtrust">
                @for (tech of experiences()[0].technologies; track tech) {
                  <span class="tech-badge">
                    <app-tech-icon [name]="tech" [size]="13" />
                    <span>{{ tech }}</span>
                  </span>
                }
              </div>
            </article>
          </div>

          <!-- Timeline Node 2: Tarkash Technology -->
          <div class="timeline-item">
            <div class="node-anchor">
              <div class="node-marker">
                <mat-icon aria-hidden="true">corporate_fare</mat-icon>
              </div>
            </div>

            <article class="timeline-content-card">
              <header class="timeline-card-header">
                <div class="node-brand-banner">
                  <span class="arrow-indicator">→</span>
                  <span class="brand-text">Tarkash</span>
                  <span class="tenure-badge">April 2019 – June 2021 · 2 Yrs 3 Mos</span>
                </div>
                <h3 class="role-heading">{{ experiences()[1].position }}</h3>
                <div class="company-subline">
                  <strong class="full-company-name">{{ experiences()[1].company }}</strong>
                  <span class="dot-separator">·</span>
                  <span class="company-location">
                    <mat-icon aria-hidden="true">location_on</mat-icon>
                    {{ experiences()[1].location }}
                  </span>
                </div>
              </header>

              <div class="timeline-highlights">
                <h4 class="highlights-title">Key Projects & Deliverables:</h4>
                <ul class="responsibilities-list">
                  @for (resp of experiences()[1].responsibilities; track resp) {
                    <li>
                      <mat-icon class="check-bullet" aria-hidden="true">check_circle</mat-icon>
                      <span>{{ resp }}</span>
                    </li>
                  }
                </ul>
              </div>

              <div class="tech-chip-cloud" aria-label="Technologies used at Tarkash">
                @for (tech of experiences()[1].technologies; track tech) {
                  <span class="tech-badge">
                    <app-tech-icon [name]="tech" [size]="13" />
                    <span>{{ tech }}</span>
                  </span>
                }
              </div>
            </article>
          </div>

          <!-- Timeline Node 3: Academic Foundation -->
          <div class="timeline-item education-node">
            <div class="node-anchor">
              <div class="node-marker edu-marker">
                <mat-icon aria-hidden="true">school</mat-icon>
              </div>
            </div>

            <article class="timeline-content-card edu-card">
              <header class="timeline-card-header">
                <div class="node-brand-banner edu-banner">
                  <span class="arrow-indicator">→</span>
                  <span class="brand-text">AKTU</span>
                  <span class="tenure-badge">2014 – 2018 · Distinction (75.8%)</span>
                </div>
                <h3 class="role-heading">{{ education()[0].degree }}</h3>
                <div class="company-subline">
                  <strong class="full-company-name">{{ education()[0].school }}</strong>
                </div>
              </header>
              <p class="edu-summary">{{ education()[0].summary }}</p>
            </article>
          </div>
        </div>
      </div>
    </section>

    <!-- 4. CORE SKILLS & CAPABILITIES -->
    <section id="skills" class="section skills-section" @staggerCards>
      <div class="container">
        <div class="skills-header-wrap">
          <div class="eyebrow-badge">
            <span class="pulse-dot"></span>
            <span>Core Competencies</span>
          </div>
          <h2 class="section-heading-title">Technical Expertise & Tooling</h2>
          <p class="section-heading-desc">
            Software engineering stack refined across 7 years of building high-throughput microservices, scalable SaaS, and conversational voice AI.
          </p>
        </div>

        <!-- Elevated Production Core Showcase -->
        <div class="production-core-showcase" aria-label="Core Technology Pillars">
          <div class="core-showcase-header">
            <div class="core-header-left">
              <span class="core-live-badge">
                <span class="pulse-beacon"></span>
                <span>PRODUCTION CORE</span>
              </span>
              <h3 class="core-headline">14 Core Technologies & Frameworks</h3>
            </div>
            <span class="core-tagline">Battle-tested in high-throughput enterprise SaaS & conversational AI systems</span>
          </div>

          <div class="core-tech-grid">
            @for (tech of coreTechnologies; track tech.name) {
              <div class="core-tech-card">
                <div class="tech-icon-disc">
                  <app-tech-icon [name]="tech.name" [fallbackIcon]="tech.icon" [size]="20" />
                </div>
                <div class="tech-meta-box">
                  <span class="tech-card-name">{{ tech.name }}</span>
                  <span class="tech-sub-status">
                    <span class="status-dot"></span>
                    Production Verified
                  </span>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Category Filter Pills -->
        <div class="skill-filters-bar" aria-label="Filter competencies by category">
          <div class="filter-chips-list">
            <button
              type="button"
              class="filter-pill"
              [class.active]="activeSkillFilter() === 'ALL'"
              (click)="setSkillFilter('ALL')"
            >
              <span>All Capabilities</span>
              <span class="count-bubble">{{ skills().length }}</span>
            </button>

            @for (category of skills(); track category.name) {
              <button
                type="button"
                class="filter-pill"
                [class.active]="activeSkillFilter() === category.name"
                (click)="setSkillFilter(category.name)"
              >
                <app-tech-icon [name]="category.name" [fallbackIcon]="category.icon" [size]="16" />
                <span>{{ category.name }}</span>
              </button>
            }
          </div>
        </div>

        <div class="skills-grid">
          @for (category of filteredSkills(); track category.name) {
            <app-skill-card class="stagger-item" [category]="category" />
          }
        </div>
      </div>
    </section>

    <!-- 5. PROJECTS SECTION (Top Img, Bottom Description) -->
    <section id="projects" class="section projects-section">
      <div class="container">
        <div class="section-row">
          <div class="section-heading">
            <div class="eyebrow-badge">
              <span class="pulse-dot"></span>
              <span>Featured Systems</span>
            </div>
            <h2 class="section-heading-title">Projects & Live Case Studies</h2>
            <p class="section-heading-desc">
              Production systems engineered for real businesses with live URL screenshots, third-party APIs, and measurable results.
            </p>
          </div>
          <a mat-stroked-button routerLink="/projects" class="view-all-btn">
            <span>View All Projects ({{ projects().length }})</span>
            <mat-icon aria-hidden="true">arrow_forward</mat-icon>
          </a>
        </div>

        <div class="projects-grid">
          @for (project of projects(); track project.id) {
            <app-project-card [project]="project" [showTechStack]="false" />
          }
        </div>
      </div>
    </section>

    <!-- 6. CONTACT DETAILS & MESSAGE FORM -->
    <section id="contact" class="section contact-section">
      <div class="container">
        <div class="contact-header-wrap">
          <div class="eyebrow-badge">
            <span class="pulse-dot"></span>
            <span>Initiate Contact</span>
          </div>
          <h2 class="section-heading-title">Contact Details</h2>
          <p class="section-heading-desc">
            Available for Senior Software Developer, AI SaaS, and Microservices leadership. Reach out directly or submit a message below.
          </p>
        </div>

        <div class="contact-grid">
          <!-- Left: Direct Details Card -->
          <article class="contact-info-card">
            <div class="info-header">
              <h3 class="inquiries-title">Direct Inquiries</h3>
              <div class="availability-pill">
                <span class="pulse-dot"></span>
                <span>{{ profile().availability }}</span>
              </div>
            </div>

            <p class="info-intro">
              Have an urgent initiative, technical discussion, or project scoping? Reach out directly:
            </p>

            <ul class="contact-links-list">
              <li>
                <a [href]="'mailto:' + profile().email" class="contact-row">
                  <div class="icon-wrap">
                    <mat-icon aria-hidden="true">alternate_email</mat-icon>
                  </div>
                  <div class="row-text">
                    <span class="label">Email</span>
                    <strong class="value">{{ profile().email }}</strong>
                  </div>
                </a>
              </li>
              <li>
                <a [href]="'tel:' + profile().phone" class="contact-row">
                  <div class="icon-wrap">
                    <mat-icon aria-hidden="true">call</mat-icon>
                  </div>
                  <div class="row-text">
                    <span class="label">Phone</span>
                    <strong class="value">{{ profile().phone }}</strong>
                  </div>
                </a>
              </li>
              <li>
                <div class="contact-row static-row">
                  <div class="icon-wrap">
                    <mat-icon aria-hidden="true">location_on</mat-icon>
                  </div>
                  <div class="row-text">
                    <span class="label">Location</span>
                    <strong class="value">{{ profile().location }}</strong>
                  </div>
                </div>
              </li>
            </ul>

            <div class="sla-notice">
              <mat-icon aria-hidden="true">schedule</mat-icon>
              <span>Typical response time: within 24 business hours.</span>
            </div>
          </article>

          <!-- Right: Interactive Form Card -->
          <article class="form-card">
            <div class="form-card-header">
              <h3 class="form-title">Send a Direct Message</h3>
              <p class="form-desc">Fill in the project requirements and I will respond promptly.</p>
            </div>
            <app-contact-form (submitted)="send($event)" />
          </article>
        </div>
      </div>
    </section>
  `,
  styles: `
    /* ==========================================================================
       HERO SECTION
       ========================================================================== */
    .hero {
      position: relative;
      min-block-size: calc(100svh - 4.5rem);
      overflow: hidden;
      padding-block: clamp(3rem, 6vw, 5.5rem) clamp(2.5rem, 5vw, 4rem);
      display: flex;
      align-items: center;
      isolation: isolate;
    }

    .hero-bg-glow {
      position: absolute;
      inset: 0;
      z-index: -2;
      background:
        radial-gradient(ellipse at 20% 30%, var(--mesh-bg-1), transparent 60%),
        radial-gradient(ellipse at 80% 20%, var(--mesh-bg-2), transparent 50%);
      pointer-events: none;
    }

    .hero-grid-pattern {
      position: absolute;
      inset: 0;
      z-index: -1;
      background:
        linear-gradient(var(--border-subtle) 1px, transparent 1px),
        linear-gradient(90deg, var(--border-subtle) 1px, transparent 1px);
      background-size: 56px 56px;
      mask-image: radial-gradient(ellipse at center, black 40%, transparent 80%);
      -webkit-mask-image: radial-gradient(ellipse at center, black 40%, transparent 80%);
      animation: drift 25s linear infinite;
      pointer-events: none;
    }

    .hero-inner {
      display: grid;
      gap: clamp(2rem, 5vw, 4rem);
      align-items: center;
    }

    .hero-copy {
      display: grid;
      gap: 1.15rem;
      max-inline-size: 680px;
    }

    .status-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      width: fit-content;
      padding: 0.35rem 0.9rem;
      border-radius: 9999px;
      background: var(--bg-pill);
      border: 1px solid var(--border-hover);
      color: var(--primary);
      font-size: 0.82rem;
      font-weight: 600;
    }

    .pulse-dot {
      inline-size: 0.55rem;
      block-size: 0.55rem;
      border-radius: 50%;
      background: var(--success);
      box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
      animation: pulse 2s infinite cubic-bezier(0.4, 0, 0.6, 1);
    }

    .hero-title {
      margin: 0;
      color: var(--text-primary);
      font-size: clamp(2.75rem, 6.5vw, 5rem);
      font-weight: 900;
      line-height: 1.04;
      letter-spacing: -0.03em;
    }

    .gradient-text {
      background: var(--gradient-primary);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .hero-subtitle {
      margin: 0;
      color: var(--primary);
      font-size: clamp(1.35rem, 3.2vw, 2.15rem);
      font-weight: 700;
      line-height: 1.2;
      letter-spacing: -0.01em;
    }

    .hero-intro {
      margin: 0;
      color: var(--text-secondary);
      font-size: clamp(1rem, 1.8vw, 1.16rem);
      line-height: 1.75;
      max-inline-size: 620px;
    }

    .hero-actions {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.75rem;
      margin-block-start: 0.5rem;

      a {
        min-block-size: 3.25rem;
        border-radius: 9999px;
        font-weight: 600;
        padding-inline: 1.35rem;
        display: inline-flex;
        align-items: center;
        gap: 0.45rem;
      }
    }

    .primary-btn {
      box-shadow: 0 8px 24px -4px var(--primary-glow);
    }

    .secondary-btn {
      color: var(--text-primary) !important;
      border-color: var(--border-subtle) !important;
      background: var(--bg-surface-elevated) !important;

      &:hover {
        border-color: var(--border-hover) !important;
        background: var(--bg-pill) !important;
      }
    }

    .resume-btn {
      color: var(--text-secondary) !important;

      &:hover {
        color: var(--primary) !important;
        background: var(--bg-surface-elevated) !important;
      }
    }

    .social-wrapper {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.85rem;
      margin-block-start: 0.75rem;
      padding-block-start: 1rem;
      border-block-start: 1px solid var(--border-subtle);
    }

    .social-caption {
      color: var(--text-muted);
      font-size: 0.84rem;
      font-weight: 500;
    }

    .hero-visual {
      position: relative;
      display: grid;
      place-items: center;
      max-inline-size: 420px;
      margin-inline: auto;
    }

    .profile-glow-ring {
      position: absolute;
      inset: -1.5rem;
      border-radius: 2.25rem;
      background: var(--gradient-primary);
      opacity: 0.35;
      filter: blur(28px);
      z-index: 0;
    }

    .profile-card {
      position: relative;
      z-index: 1;
      margin: 0;
      border: 1px solid var(--border-hover);
      border-radius: 2rem;
      background: var(--bg-card);
      box-shadow: var(--shadow-card);
      overflow: hidden;
      inline-size: 100%;
    }

    .profile-card img {
      inline-size: 100%;
      aspect-ratio: 4 / 4.8;
      object-fit: cover;
      transition: transform 500ms ease;
    }

    .profile-card:hover img {
      transform: scale(1.04);
    }

    .profile-badge {
      position: absolute;
      inset-inline: 0.85rem;
      inset-block-end: 0.85rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.85rem 1rem;
      border: 1px solid var(--border-subtle);
      border-radius: 1.15rem;
      background: var(--bg-glass-strong);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);
    }

    .badge-icon {
      display: grid;
      place-items: center;
      inline-size: 2.25rem;
      block-size: 2.25rem;
      border-radius: 0.65rem;
      background: var(--gradient-primary);
      color: #ffffff;

      mat-icon {
        font-size: 1.25rem;
        inline-size: 1.25rem;
        block-size: 1.25rem;
      }
    }

    .badge-content {
      display: grid;
      gap: 0.1rem;

      strong {
        color: var(--text-primary);
        font-size: 0.86rem;
        font-weight: 700;
      }

      span {
        color: var(--text-muted);
        font-size: 0.76rem;
      }
    }

    .floating-stat-card {
      position: absolute;
      inset-block-start: 1rem;
      inset-inline-end: -1rem;
      z-index: 2;
      display: grid;
      gap: 0.15rem;
      padding: 0.75rem 1rem;
      border-radius: 1rem;
      background: var(--bg-glass-strong);
      border: 1px solid var(--border-hover);
      box-shadow: 0 16px 36px rgba(0, 0, 0, 0.35);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      animation: float 4s ease-in-out infinite;

      .stat-number {
        font-size: 1.35rem;
        font-weight: 800;
        color: var(--primary);
        line-height: 1;
      }

      .stat-desc {
        font-size: 0.72rem;
        color: var(--text-secondary);
        font-weight: 600;
        max-inline-size: 110px;
      }
    }

    /* ==========================================================================
       SECTION HEADINGS (Reusable)
       ========================================================================== */
    .eyebrow-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      width: fit-content;
      padding: 0.3rem 0.8rem;
      border-radius: 9999px;
      background: var(--bg-pill);
      border: 1px solid var(--border-hover);
      color: var(--primary);
      font-size: 0.78rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-block-end: 0.75rem;
    }

    .section-heading-title {
      margin: 0;
      color: var(--text-primary);
      font-size: clamp(1.85rem, 4.2vw, 3rem);
      font-weight: 800;
      line-height: 1.15;
      letter-spacing: -0.02em;
    }

    .section-heading-desc {
      margin: 0;
      color: var(--text-secondary);
      font-size: clamp(0.95rem, 1.8vw, 1.12rem);
      line-height: 1.7;
      max-inline-size: 720px;
      margin-block-start: 0.5rem;
    }

    /* ==========================================================================
       2. ABOUT & 4 CIRCULAR METRICS
       ========================================================================== */
    .about-section {
      padding-block: clamp(3rem, 6vw, 5rem);
      border-block-start: 1px solid var(--border-subtle);
    }

    .about-header-wrap {
      display: grid;
      gap: 0.5rem;
      max-inline-size: 800px;
      margin-block-end: 2.75rem;
    }

    /* 4 Distinct Circles: ( exp. ) ( 15+ ) ( 35+ ) ( 99.9% ) */
    .circular-metrics-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: clamp(1.25rem, 3vw, 2.75rem);
    }

    .circular-metric-card {
      position: relative;
      display: grid;
      place-items: center;
      inline-size: clamp(140px, 19vw, 175px);
      block-size: clamp(140px, 19vw, 175px);
      border-radius: 50%;
      background: var(--bg-card);
      border: 2px solid var(--border-hover);
      box-shadow: var(--shadow-card);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      text-align: center;
      padding: 1rem;
      transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1),
                  box-shadow 300ms ease,
                  border-color 300ms ease;

      .circle-ring-glow {
        position: absolute;
        inset: -4px;
        border-radius: 50%;
        background: var(--gradient-primary);
        opacity: 0;
        z-index: -1;
        transition: opacity 300ms ease;
        filter: blur(10px);
      }

      &:hover {
        transform: translateY(-8px) scale(1.06);
        border-color: var(--primary);
        box-shadow: 0 0 35px var(--primary-glow);

        .circle-ring-glow {
          opacity: 0.5;
        }

        .circle-value {
          transform: scale(1.08);
        }
      }

      .circle-inner {
        display: grid;
        place-items: center;
        gap: 0.35rem;
      }

      .circle-value {
        font-size: clamp(1.75rem, 3.5vw, 2.4rem);
        font-weight: 900;
        color: var(--primary);
        line-height: 1;
        letter-spacing: -0.02em;
        transition: transform 250ms ease;
      }

      .circle-label {
        font-size: clamp(0.72rem, 1.2vw, 0.84rem);
        font-weight: 600;
        color: var(--text-secondary);
        line-height: 1.25;
        max-inline-size: 110px;
      }
    }

    /* ==========================================================================
       3. WORKING EXPERIENCE (CONTINUOUS ANIMATED DOTTED TIMELINE)
       ========================================================================== */
    .experience-section {
      padding-block: clamp(3.5rem, 7vw, 6rem);
      border-block-start: 1px solid var(--border-subtle);
      background: linear-gradient(180deg, transparent, rgba(56, 189, 248, 0.03), transparent);
    }

    .experience-header-wrap {
      display: grid;
      gap: 0.5rem;
      max-inline-size: 800px;
      margin-block-end: clamp(2.5rem, 5vw, 4rem);
    }

    .timeline-container {
      position: relative;
      display: grid;
      gap: clamp(2.5rem, 5vw, 4rem);
      padding-inline-start: clamp(1rem, 4vw, 3.5rem);
    }

    /* CONTINUOUS ANIMATED DOTTED TIMELINE TRACK */
    .timeline-spine {
      position: absolute;
      inset-block-start: 1.75rem;
      inset-block-end: 2rem;
      inset-inline-start: clamp(1.75rem, 4.5vw, 4.25rem);
      inline-size: 4px;
      background: repeating-linear-gradient(
        to bottom,
        var(--primary) 0px,
        var(--primary) 8px,
        transparent 8px,
        transparent 22px
      );
      background-size: 100% 44px;
      animation: timelineDottedFlow 1.35s linear infinite;
      box-shadow: 0 0 14px var(--primary-glow);
      border-radius: 9999px;
      pointer-events: none;
      z-index: 1;
    }

    @keyframes timelineDottedFlow {
      0% {
        background-position-y: 0px;
      }
      100% {
        background-position-y: 44px;
      }
    }

    .timeline-item {
      position: relative;
      display: grid;
      grid-template-columns: auto 1fr;
      gap: clamp(1.25rem, 3vw, 2.5rem);
      align-items: start;
      z-index: 2;
    }

    .node-anchor {
      position: relative;
      display: flex;
      justify-content: center;
    }

    .node-marker {
      position: relative;
      z-index: 2;
      display: grid;
      place-items: center;
      inline-size: 3.25rem;
      block-size: 3.25rem;
      border-radius: 50%;
      background: var(--bg-surface-elevated);
      border: 2px solid var(--primary);
      box-shadow: 0 0 24px var(--primary-glow);
      color: var(--primary);
      flex-shrink: 0;
      transition: transform 250ms ease, box-shadow 250ms ease;

      mat-icon {
        font-size: 1.5rem;
        inline-size: 1.5rem;
        block-size: 1.5rem;
      }

      &::after {
        content: '';
        position: absolute;
        inset: -6px;
        border-radius: 50%;
        border: 2px dashed var(--primary);
        opacity: 0.65;
        animation: rotateRing 9s linear infinite;
      }
    }

    @keyframes rotateRing {
      to {
        transform: rotate(360deg);
      }
    }

    .timeline-item:hover .node-marker {
      transform: scale(1.12);
      box-shadow: 0 0 35px var(--primary);
    }

    .edu-marker {
      border-color: var(--accent);
      color: var(--accent);
      box-shadow: 0 0 20px var(--accent-glow);

      &::after {
        border-color: var(--accent);
      }
    }

    .timeline-content-card {
      display: grid;
      gap: 1.25rem;
      padding: clamp(1.5rem, 3.5vw, 2.25rem);
      border: 1px solid var(--border-subtle);
      border-radius: 1.5rem;
      background: var(--bg-card);
      box-shadow: var(--shadow-card);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      transition: transform 250ms cubic-bezier(0.4, 0, 0.2, 1),
                  border-color 250ms ease,
                  box-shadow 250ms ease;

      &:hover {
        transform: translateY(-4px);
        border-color: var(--border-hover);
        box-shadow: var(--shadow-hover);
      }
    }

    .timeline-card-header {
      display: grid;
      gap: 0.5rem;
    }

    /* Brand arrow indicator (-> DEVtrust, -> Tarkash) */
    .node-brand-banner {
      display: inline-flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.65rem;
      width: fit-content;
      padding: 0.35rem 0.95rem;
      border-radius: 9999px;
      background: var(--bg-pill);
      border: 1px solid var(--border-hover);
      color: var(--primary);
      font-size: 0.88rem;
      font-weight: 700;

      .arrow-indicator {
        font-size: 1.15rem;
        line-height: 1;
        color: var(--primary);
        animation: arrowShift 1.6s ease-in-out infinite;
      }

      .brand-text {
        letter-spacing: 0.02em;
      }

      .tenure-badge {
        color: var(--text-muted);
        font-weight: 500;
        font-size: 0.8rem;
      }
    }

    @keyframes arrowShift {
      0%, 100% {
        transform: translateX(0);
      }
      50% {
        transform: translateX(4px);
      }
    }

    .edu-banner {
      border-color: var(--accent);
      color: var(--accent);

      .arrow-indicator {
        color: var(--accent);
      }
    }

    .role-heading {
      margin: 0;
      color: var(--text-primary);
      font-size: clamp(1.35rem, 2.5vw, 1.85rem);
      font-weight: 800;
      letter-spacing: -0.01em;
    }

    .company-subline {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.5rem;
      color: var(--text-secondary);
      font-size: 0.92rem;

      .full-company-name {
        color: var(--text-primary);
        font-weight: 600;
      }

      .dot-separator {
        color: var(--text-muted);
      }

      .company-location {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
        color: var(--text-muted);

        mat-icon {
          font-size: 1rem;
          inline-size: 1rem;
          block-size: 1rem;
        }
      }
    }

    .timeline-highlights {
      display: grid;
      gap: 0.75rem;

      .highlights-title {
        margin: 0;
        font-size: 0.95rem;
        font-weight: 700;
        color: var(--primary);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
    }

    .responsibilities-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: grid;
      gap: 0.65rem;

      li {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 0.65rem;
        align-items: start;
        color: var(--text-secondary);
        font-size: 0.93rem;
        line-height: 1.6;

        .check-bullet {
          color: var(--primary);
          font-size: 1.15rem;
          inline-size: 1.15rem;
          block-size: 1.15rem;
          margin-block-start: 0.15rem;
        }
      }
    }

    .tech-chip-cloud {
      display: flex;
      flex-wrap: wrap;
      gap: 0.45rem;
      padding-block-start: 0.75rem;
      border-block-start: 1px solid var(--border-subtle);
    }

    .tech-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.25rem 0.7rem;
      border-radius: 9999px;
      font-size: 0.78rem;
      font-weight: 600;
      background: var(--bg-surface-elevated);
      color: var(--text-secondary);
      border: 1px solid var(--border-subtle);
      transition: all 150ms ease;

      &:hover {
        border-color: var(--border-hover);
        color: var(--primary);
      }
    }

    .edu-card {
      border-color: rgba(129, 140, 248, 0.25);
    }

    .edu-summary {
      margin: 0;
      color: var(--text-secondary);
      font-size: 0.94rem;
      line-height: 1.65;
    }

    /* ==========================================================================
       4. SKILLS SECTION
       ========================================================================== */
    .skills-section {
      padding-block: clamp(3.5rem, 6vw, 5.5rem);
      border-block-start: 1px solid var(--border-subtle);
    }

    .skills-header-wrap {
      display: grid;
      gap: 0.5rem;
      max-inline-size: 800px;
      margin-block-end: 1.75rem;
    }

    /* ==========================================================================
       PRODUCTION CORE SHOWCASE
       ========================================================================== */
    .production-core-showcase {
      padding: clamp(1.25rem, 2.5vw, 1.75rem);
      border-radius: 1.5rem;
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      box-shadow: 0 10px 30px -10px var(--primary-glow);
      margin-block-end: 2rem;
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      transition: border-color 250ms ease, box-shadow 250ms ease;

      &:hover {
        border-color: var(--border-hover);
      }
    }

    .core-showcase-header {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding-block-end: 1.25rem;
      margin-block-end: 1.25rem;
      border-block-end: 1px solid var(--border-subtle);
    }

    .core-header-left {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.85rem;
    }

    .core-live-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.35rem 0.85rem;
      border-radius: 9999px;
      background: var(--bg-pill);
      border: 1px solid var(--border-hover);
      color: var(--primary);
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;

      .pulse-beacon {
        inline-size: 0.5rem;
        block-size: 0.5rem;
        border-radius: 50%;
        background: var(--primary);
        box-shadow: 0 0 8px var(--primary);
        animation: pulseBeacon 2s infinite cubic-bezier(0.4, 0, 0.6, 1);
      }
    }

    @keyframes pulseBeacon {
      0%, 100% {
        opacity: 1;
        transform: scale(1);
      }
      50% {
        opacity: 0.4;
        transform: scale(1.3);
      }
    }

    .core-headline {
      margin: 0;
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--text-primary);
      letter-spacing: -0.01em;
    }

    .core-tagline {
      font-size: 0.82rem;
      color: var(--text-secondary);
      font-weight: 500;
    }

    .core-tech-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(min(100%, 10.5rem), 1fr));
      gap: 0.75rem;
    }

    .core-tech-card {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.65rem 0.85rem;
      border-radius: 1rem;
      background: var(--bg-surface-elevated);
      border: 1px solid var(--border-subtle);
      transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1),
                  border-color 200ms ease,
                  background-color 200ms ease,
                  box-shadow 200ms ease;

      &:hover {
        transform: translateY(-3px);
        border-color: var(--border-hover);
        background: var(--bg-pill);
        box-shadow: 0 6px 18px -4px var(--primary-glow);

        .tech-icon-disc {
          transform: scale(1.12);
          box-shadow: 0 0 16px var(--primary-glow);
        }

        .status-dot {
          background: var(--primary);
          box-shadow: 0 0 6px var(--primary);
        }
      }
    }

    .tech-icon-disc {
      display: grid;
      place-items: center;
      inline-size: 2.25rem;
      block-size: 2.25rem;
      border-radius: 0.7rem;
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      color: var(--primary);
      flex-shrink: 0;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
      transition: transform 200ms ease, box-shadow 200ms ease;

      mat-icon {
        font-size: 1.15rem;
        inline-size: 1.15rem;
        block-size: 1.15rem;
      }
    }

    .tech-meta-box {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
      min-inline-size: 0;
    }

    .tech-card-name {
      font-size: 0.86rem;
      font-weight: 600;
      color: var(--text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 1.2;
    }

    .tech-sub-status {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      font-size: 0.68rem;
      font-weight: 500;
      color: var(--text-muted);

      .status-dot {
        inline-size: 0.35rem;
        block-size: 0.35rem;
        border-radius: 50%;
        background: var(--success);
        transition: all 200ms ease;
      }
    }

    /* Filter Chips Bar */
    .skill-filters-bar {
      margin-block-end: 2rem;
      overflow-x: auto;
      padding-block-end: 0.5rem;
      scrollbar-width: thin;

      &::-webkit-scrollbar {
        block-size: 4px;
      }

      &::-webkit-scrollbar-thumb {
        background: var(--border-subtle);
        border-radius: 9999px;
      }
    }

    .filter-chips-list {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      min-inline-size: max-content;
    }

    .filter-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      padding: 0.45rem 0.95rem;
      border-radius: 9999px;
      border: 1px solid var(--border-subtle);
      background: var(--bg-surface-elevated);
      color: var(--text-secondary);
      font-size: 0.84rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 180ms ease;

      mat-icon {
        font-size: 1.05rem;
        inline-size: 1.05rem;
        block-size: 1.05rem;
        color: var(--secondary);
      }

      .count-bubble {
        display: inline-grid;
        place-items: center;
        padding-inline: 0.45rem;
        min-inline-size: 1.25rem;
        block-size: 1.25rem;
        border-radius: 9999px;
        background: var(--bg-pill);
        color: var(--primary);
        font-size: 0.72rem;
        font-weight: 700;
      }

      &:hover {
        background: var(--bg-pill);
        border-color: var(--border-hover);
        color: var(--text-primary);
      }

      &.active {
        background: var(--gradient-primary);
        color: #ffffff;
        border-color: transparent;
        box-shadow: 0 4px 14px -2px var(--primary-glow);

        mat-icon {
          color: #ffffff;
        }

        .count-bubble {
          background: rgba(255, 255, 255, 0.25);
          color: #ffffff;
        }
      }
    }

    .skills-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: clamp(1.25rem, 3vw, 1.75rem);
    }

    /* ==========================================================================
       5. PROJECTS SECTION (TOP IMG, BOTTOM DESCRIPTION)
       ========================================================================== */
    .projects-section {
      padding-block: clamp(3.5rem, 7vw, 6rem);
      border-block-start: 1px solid var(--border-subtle);
    }

    .section-row {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-end;
      justify-content: space-between;
      gap: 1.5rem;
      margin-block-end: clamp(2rem, 4vw, 3rem);
    }

    .section-heading {
      display: grid;
      gap: 0.5rem;
      max-inline-size: 700px;
    }

    .view-all-btn {
      border-radius: 9999px !important;
      font-weight: 600 !important;
      padding-inline: 1.35rem !important;
      min-block-size: 3rem !important;
      color: var(--text-primary) !important;
      border-color: var(--border-subtle) !important;
      background: var(--bg-surface-elevated) !important;

      mat-icon {
        margin-inline-start: 0.35rem;
      }

      &:hover {
        border-color: var(--border-hover) !important;
        color: var(--primary) !important;
      }
    }

    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 21rem), 1fr));
      gap: clamp(1.25rem, 3vw, 2rem);
    }

    /* ==========================================================================
       6. CONTACT DETAILS SECTION
       ========================================================================== */
    .contact-section {
      padding-block: clamp(3.5rem, 7vw, 6rem);
      border-block-start: 1px solid var(--border-subtle);
      background: linear-gradient(180deg, transparent, rgba(56, 189, 248, 0.02) 60%, transparent);
    }

    .contact-header-wrap {
      display: grid;
      gap: 0.5rem;
      max-inline-size: 800px;
      margin-block-end: clamp(2rem, 4vw, 3.5rem);
    }

    .contact-grid {
      display: grid;
      gap: clamp(1.5rem, 3vw, 2.5rem);
      align-items: start;

      @media (min-width: 60rem) {
        grid-template-columns: minmax(0, 1fr) minmax(0, 1.25fr);
      }
    }

    .contact-info-card,
    .form-card {
      padding: clamp(1.5rem, 4vw, 2.5rem);
      border: 1px solid var(--border-subtle);
      border-radius: 1.5rem;
      background: var(--bg-card);
      box-shadow: var(--shadow-card);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
    }

    .contact-info-card {
      display: grid;
      gap: 1.35rem;
    }

    .info-header {
      display: grid;
      gap: 0.65rem;

      .inquiries-title {
        margin: 0;
        color: var(--text-primary);
        font-size: 1.5rem;
        font-weight: 700;
        letter-spacing: -0.01em;
      }
    }

    .availability-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      width: fit-content;
      padding: 0.35rem 0.85rem;
      border-radius: 9999px;
      background: var(--bg-pill);
      border: 1px solid var(--border-hover);
      color: var(--primary);
      font-size: 0.82rem;
      font-weight: 600;
    }

    .info-intro {
      margin: 0;
      color: var(--text-secondary);
      font-size: 0.95rem;
      line-height: 1.6;
    }

    .contact-links-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: grid;
      gap: 0.85rem;
    }

    .contact-row {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.85rem 1rem;
      border-radius: 1rem;
      border: 1px solid var(--border-subtle);
      background: var(--bg-surface-elevated);
      transition: all 180ms ease;
      color: var(--text-primary);

      &:hover:not(.static-row) {
        border-color: var(--border-hover);
        background: var(--bg-pill);
        transform: translateX(4px);

        .icon-wrap {
          background: var(--gradient-primary);
          color: #ffffff;
        }
      }
    }

    .icon-wrap {
      display: grid;
      place-items: center;
      inline-size: 2.75rem;
      block-size: 2.75rem;
      border-radius: 0.75rem;
      background: var(--bg-pill);
      color: var(--primary);
      flex-shrink: 0;
      transition: all 180ms ease;

      mat-icon {
        font-size: 1.35rem;
        inline-size: 1.35rem;
        block-size: 1.35rem;
      }
    }

    .row-text {
      display: grid;
      gap: 0.15rem;

      .label {
        font-size: 0.74rem;
        color: var(--text-muted);
        text-transform: uppercase;
        letter-spacing: 0.08em;
        font-weight: 600;
      }

      .value {
        font-size: 0.95rem;
        font-weight: 600;
        color: var(--text-primary);
        word-break: break-all;
      }
    }

    .sla-notice {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      border-radius: 0.85rem;
      background: rgba(56, 189, 248, 0.08);
      border: 1px solid var(--border-subtle);
      color: var(--text-secondary);
      font-size: 0.84rem;

      mat-icon {
        color: var(--primary);
        font-size: 1.15rem;
        inline-size: 1.15rem;
        block-size: 1.15rem;
      }
    }

    .form-card {
      display: grid;
      gap: 1.25rem;
    }

    .form-card-header {
      display: grid;
      gap: 0.25rem;

      .form-title {
        margin: 0;
        color: var(--text-primary);
        font-size: 1.45rem;
        font-weight: 700;
      }

      .form-desc {
        margin: 0;
        color: var(--text-secondary);
        font-size: 0.9rem;
      }
    }

    /* ==========================================================================
       MEDIA QUERIES & ANIMATIONS
       ========================================================================== */
    @media (min-width: 64rem) {
      .hero-inner {
        grid-template-columns: minmax(0, 1.25fr) minmax(22rem, 0.85fr);
      }
    }

    @keyframes pulse {
      0% {
        box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.6);
      }
      70% {
        box-shadow: 0 0 0 7px rgba(16, 185, 129, 0);
      }
      100% {
        box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
      }
    }

    @keyframes drift {
      to {
        transform: translate3d(-56px, -56px, 0);
      }
    }

    @keyframes float {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-8px);
      }
    }
  `,
  animations: [fadeIn, staggerCards],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements AfterViewInit {
  private readonly portfolio = inject(PortfolioService);
  private readonly seo = inject(SeoService);
  readonly scrollService = inject(ScrollService);
  private readonly contactService = inject(ContactService);
  private readonly snackbar = inject(SnackbarService);
  private readonly route = inject(ActivatedRoute);

  readonly profile = this.portfolio.profile;
  readonly metrics = this.portfolio.metrics;
  readonly projects = this.portfolio.projects;
  readonly experiences = this.portfolio.experiences;
  readonly skills = this.portfolio.skills;
  readonly education = this.portfolio.education;
  readonly socialLinks = SOCIAL_LINKS;
  readonly isSubmitting = signal(false);

  readonly activeSkillFilter = signal<string>('ALL');

  readonly filteredSkills = computed(() => {
    const filter = this.activeSkillFilter();
    if (filter === 'ALL') {
      return this.skills();
    }
    return this.skills().filter((c) => c.name === filter);
  });

  readonly coreTechnologies = [
    { name: 'React.js', icon: 'code' },
    { name: 'Angular', icon: 'change_history' },
    { name: 'Next.js', icon: 'view_in_ar' },
    { name: 'PHP / Laravel', icon: 'developer_mode' },
    { name: 'Node.js', icon: 'api' },
    { name: 'Git', icon: 'commit' },
    { name: 'Microservices', icon: 'account_tree' },
    { name: 'LiveKit Voice AI', icon: 'graphic_eq' },
    { name: 'ElevenLabs', icon: 'record_voice_over' },
    { name: 'OpenAI API', icon: 'psychology' },
    { name: 'Twilio IVR', icon: 'ring_volume' },
    { name: 'Stripe API', icon: 'credit_card' },
    { name: 'PostgreSQL', icon: 'storage' },
    { name: 'MySQL', icon: 'table_chart' }
  ];

  constructor() {
    this.seo.update({
      title: 'Shubham Prajapati | Software Developer',
      description: this.profile().intro,
      image: this.profile().imageUrl
    });
  }

  ngAfterViewInit(): void {
    this.route.fragment.subscribe((fragment) => {
      if (fragment) {
        setTimeout(() => {
          this.scrollService.scrollToSection(fragment);
        }, 150);
      }
    });
  }

  setSkillFilter(name: string): void {
    this.activeSkillFilter.set(name);
  }

  scrollTo(sectionId: string): void {
    this.scrollService.scrollToSection(sectionId);
  }

  send(request: ContactRequest): void {
    this.isSubmitting.set(true);
    this.contactService.sendMessage(request).subscribe({
      next: ({ name }: { readonly success: true; readonly name: string }) => {
        this.snackbar.success(`Thank you, ${name}! Your message has been sent successfully.`);
        this.isSubmitting.set(false);
      },
      error: () => {
        this.snackbar.error('Failed to send message. Please try again.');
        this.isSubmitting.set(false);
      }
    });
  }
}
