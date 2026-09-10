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
    <!-- Modern Tech Canvas Background (Cyber Grid, Dot Matrix, Ambient Aurora Orbs) -->
    <div class="home-backdrop" aria-hidden="true">
      <div class="backdrop-beam"></div>
      <div class="backdrop-grid"></div>
      <div class="backdrop-dots"></div>
      <div class="backdrop-orb orb-1"></div>
      <div class="backdrop-orb orb-2"></div>
      <div class="backdrop-orb orb-3"></div>
      <div class="backdrop-orb orb-4"></div>
    </div>

    <!-- 1. HERO SECTION (Introduction & Photo Split) -->
    <section id="home" class="hero">
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
    <section id="about" class="section about-section">
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
        </div>
      </div>
    </section>

    <!-- 4. ACADEMIC QUALIFICATIONS -->
    <section id="qualifications" class="section qualifications-section">
      <div class="container">
        <div class="qualifications-header-wrap">
          <div class="eyebrow-badge">
            <span class="pulse-dot"></span>
            <span>Academic Background</span>
          </div>
          <h2 class="section-heading-title">Education & Qualifications</h2>
          <p class="section-heading-desc">
            Formal engineering credentials and computer science foundation graduated with First Class Distinction.
          </p>
        </div>

        <div class="qualification-card-wrap">
          <article class="qualification-card">
            <div class="card-ambient-glow" aria-hidden="true"></div>

            <header class="qualification-header">
              <div class="institution-brand">
                <div class="institution-icon-disc">
                  <mat-icon aria-hidden="true">school</mat-icon>
                </div>
                <div class="institution-details">
                  <div class="brand-badge-row">
                    <span class="arrow-indicator">→</span>
                    <span class="brand-tag">AKTU</span>
                    <span class="distinction-badge">
                      <mat-icon aria-hidden="true">verified</mat-icon>
                      <span>2014 – 2018 · Distinction (75.8%)</span>
                    </span>
                  </div>
                  <h3 class="degree-title">{{ education()[0].degree }}</h3>
                  <p class="university-name">{{ education()[0].school }}</p>
                </div>
              </div>
            </header>

            <!-- Mentioned in Quotes with Elegant Styling -->
            <div class="qualification-quote-container">
              <div class="quote-symbol" aria-hidden="true">“</div>
              <blockquote class="qualification-quote">
                <p class="quote-text">
                  “Graduated with 75.8% First Class with Distinction. Strong foundation in Software Engineering, Data Structures, Relational Database Management Systems, and Microservices Architecture.”
                </p>
              </blockquote>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- 4. CORE SKILLS & CAPABILITIES -->
    <section id="skills" class="section skills-section">
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
            <span class="core-live-badge">
              <span class="pulse-beacon"></span>
              <span>PRODUCTION CORE</span>
            </span>
          </div>

          <div class="core-tech-grid">
            @for (tech of coreTechnologies; track tech.name) {
              <div class="core-tech-card">
                <div class="tech-icon-disc">
                  <app-tech-icon [name]="tech.name" [fallbackIcon]="tech.icon" [size]="22" />
                </div>
                <span class="tech-card-name">{{ tech.name }}</span>
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
            <app-project-card [project]="project" [showTechStack]="false" [priority]="$index < 2" />
          }
        </div>
      </div>
    </section>

    <!-- 5.5 MOBILE APK DOWNLOAD & INCLINED 3D APP SHOWCASE (Website Only, Hidden in APK) -->
    @if (!isMobileApp()) {
      <section id="mobile-app" class="section mobile-app-section" aria-label="Mobile Application Showcase & Download">
        <div class="container">
          <div class="mobile-app-card">
            <!-- Neo-Cyber Ambient Lighting & Animated Glows -->
            <div class="mobile-ambient-glow glow-1" aria-hidden="true"></div>
            <div class="mobile-ambient-glow glow-2" aria-hidden="true"></div>
            <div class="mobile-grid-pattern" aria-hidden="true"></div>

            <div class="mobile-app-content">
              <!-- Left Column: High-Impact Typography, Feature Grid & Action Buttons -->
              <div class="mobile-info-col">
                <div class="app-badge">
                  <span class="app-pulse-dot"></span>
                  <mat-icon class="badge-icon">phone_android</mat-icon>
                  <span>Native Android Application</span>
                </div>

                <h2 class="mobile-headline">
                  Experience My Portfolio as a
                  <span class="gradient-text-vibrant">Native Mobile App</span>
                </h2>

                <p class="mobile-desc">
                  Engineered with <strong>Capacitor 7</strong> and <strong>Angular 19</strong>, packaged into a high-performance native Android application. Explore full case studies, review architecture benchmarks, and initiate contact on the go with zero browser chrome or latency.
                </p>

                <!-- 3 Futuristic Feature Glass Cards -->
                <div class="mobile-features-grid">
                  <div class="mobile-feature-item">
                    <div class="feature-icon-box icon-bolt">
                      <mat-icon>bolt</mat-icon>
                    </div>
                    <div class="feature-text">
                      <strong>Instant Launch & 60 FPS</strong>
                      <span>Zero browser overhead, buttery smooth hardware-accelerated animations.</span>
                    </div>
                  </div>

                  <div class="mobile-feature-item">
                    <div class="feature-icon-box icon-offline">
                      <mat-icon>wifi_off</mat-icon>
                    </div>
                    <div class="feature-text">
                      <strong>Offline-First Architecture</strong>
                      <span>Core assets, resume, and project summaries instantly accessible offline.</span>
                    </div>
                  </div>

                  <div class="mobile-feature-item">
                    <div class="feature-icon-box icon-secure">
                      <mat-icon>verified_user</mat-icon>
                    </div>
                    <div class="feature-text">
                      <strong>Signed & Verified Build</strong>
                      <span>Compiled directly via automated GitHub Actions CI/CD with release hashes.</span>
                    </div>
                  </div>
                </div>

                <!-- APK Action Buttons -->
                <div class="apk-actions-wrapper">
                  <a
                    mat-flat-button
                    href="downloads/Shubham-Portfolio.apk"
                    download="Shubham-Portfolio.apk"
                    class="download-apk-btn"
                  >
                    <mat-icon class="btn-dl-icon">download</mat-icon>
                    <div class="btn-copy">
                      <span class="btn-sub">Direct Download APK</span>
                      <span class="btn-main">Download Android App</span>
                    </div>
                    <span class="btn-shine-bar" aria-hidden="true"></span>
                  </a>

                  <a
                    mat-stroked-button
                    href="https://github.com/shubhamprajapati96/Portfolio/actions/workflows/build-apk.yml"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="github-release-btn"
                  >
                    <mat-icon>code</mat-icon>
                    <span>CI/CD Pipeline</span>
                  </a>
                </div>

                <!-- APK Meta Specs -->
                <div class="apk-meta-specs">
                  <span class="meta-tag">
                    <mat-icon>android</mat-icon> Android 8.0+
                  </span>
                  <span class="meta-tag">
                    <mat-icon>straighten</mat-icon> ~12.8 MB
                  </span>
                  <span class="meta-tag">
                    <mat-icon>verified</mat-icon> v1.0.0 Release
                  </span>
                </div>
              </div>

              <!-- Right Column: Inclined 3D iPhone with Live Animations -->
              <div class="mobile-device-col">
                <div class="device-stage">
                  <!-- Concentric Pulsing Radar Rings -->
                  <div class="device-radar-rings" aria-hidden="true">
                    <div class="radar-ring ring-1"></div>
                    <div class="radar-ring ring-2"></div>
                    <div class="radar-ring ring-3"></div>
                  </div>

                  <!-- Ambient Core Glow behind tilted device -->
                  <div class="device-backdrop-glow" aria-hidden="true"></div>

                  <!-- 3D Suspended Micro-Badges -->
                  <div class="floating-badge badge-top-right">
                    <div class="floating-badge-icon icon-speed">
                      <mat-icon>speed</mat-icon>
                    </div>
                    <div class="floating-badge-body">
                      <span class="fb-title">Performance</span>
                      <span class="fb-value">60 FPS Native</span>
                    </div>
                  </div>

                  <div class="floating-badge badge-bottom-left">
                    <div class="floating-badge-icon icon-cap">
                      <mat-icon>offline_bolt</mat-icon>
                    </div>
                    <div class="floating-badge-body">
                      <span class="fb-title">Capacitor 7</span>
                      <span class="fb-value">Cross-Platform</span>
                    </div>
                  </div>

                  <!-- Inclined 3D iPhone 16 Pro Frame with Live Floating Motion -->
                  <div class="iphone-3d-chassis" role="img" aria-label="Live interactive 3D inclined mobile app preview">
                    <!-- Physical Hardware Buttons (Extruded along left 3D edge) -->
                    <div class="hw-action-button"></div>
                    <div class="hw-volume-up"></div>
                    <div class="hw-volume-down"></div>
                    <div class="hw-power-button"></div>

                    <!-- Outer Titanium Bezel -->
                    <div class="iphone-bezel">
                      <!-- Inner OLED Screen -->
                      <div class="iphone-screen">
                        <!-- Live Dynamic Island with Active Sound Wave -->
                        <div class="dynamic-island">
                          <div class="island-live-activity">
                            <span class="live-dot"></span>
                            <div class="live-eq">
                              <span class="eq-bar eq-1"></span>
                              <span class="eq-bar eq-2"></span>
                              <span class="eq-bar eq-3"></span>
                            </div>
                          </div>
                          <div class="island-camera-cluster">
                            <div class="island-sensor"></div>
                            <div class="island-camera"></div>
                          </div>
                        </div>

                        <!-- Live Sweeping Glass Glare Beam -->
                        <div class="screen-shine-beam" aria-hidden="true"></div>
                        <div class="screen-glare-static" aria-hidden="true"></div>

                        <!-- Real App Screen Image -->
                        <picture class="screen-picture">
                          <source srcset="assets/images/app-screen.webp" type="image/webp" />
                          <img
                            src="assets/images/app-screen.png"
                            alt="Shubham Prajapati Portfolio Mobile App Interface"
                            class="app-screenshot"
                            loading="lazy"
                            (error)="onScreenImgError($event)"
                          />
                        </picture>

                        <!-- iOS Home Indicator -->
                        <div class="home-indicator"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    }

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
    :host {
      display: block;
      position: relative;
      overflow-x: clip;
    }

    /* ==========================================================================
       MODERN TECH CANVAS BACKDROP (CYBER GRID + DOT MATRIX + AURORA ORBS)
       ========================================================================== */
    .home-backdrop {
      position: absolute;
      inset: 0;
      overflow: hidden;
      pointer-events: none;
      z-index: 0;
    }

    .backdrop-beam {
      position: absolute;
      inset-block-start: 0;
      inset-inline: 0;
      block-size: clamp(550px, 80vh, 950px);
      background: var(--pattern-beam), var(--pattern-beam-accent);
      pointer-events: none;
    }

    .backdrop-grid {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(to right, var(--pattern-grid) 1px, transparent 1px),
        linear-gradient(to bottom, var(--pattern-grid) 1px, transparent 1px);
      background-size: 96px 96px;
      pointer-events: none;
    }

    .backdrop-dots {
      position: absolute;
      inset: 0;
      background-image: radial-gradient(circle at 1.5px 1.5px, var(--pattern-dot) 1.2px, transparent 1.2px);
      background-size: 24px 24px;
      pointer-events: none;
    }

    .backdrop-orb {
      position: absolute;
      border-radius: 50%;
      pointer-events: none;
      will-change: transform;
    }

    .orb-1 {
      inset-block-start: 3%;
      inset-inline-start: -8%;
      inline-size: clamp(350px, 45vw, 650px);
      block-size: clamp(350px, 45vw, 650px);
      background: radial-gradient(circle, var(--mesh-bg-1) 0%, transparent 68%);
      filter: blur(80px);
      animation: floatAmbient1 22s ease-in-out infinite alternate;
    }

    .orb-2 {
      inset-block-start: 18%;
      inset-inline-end: -6%;
      inline-size: clamp(320px, 40vw, 600px);
      block-size: clamp(320px, 40vw, 600px);
      background: radial-gradient(circle, var(--mesh-bg-2) 0%, transparent 68%);
      filter: blur(90px);
      animation: floatAmbient2 26s ease-in-out infinite alternate;
    }

    .orb-3 {
      inset-block-start: 48%;
      inset-inline-start: -5%;
      inline-size: clamp(380px, 50vw, 700px);
      block-size: clamp(380px, 50vw, 700px);
      background: radial-gradient(circle, var(--mesh-bg-3) 0%, transparent 70%);
      filter: blur(100px);
      animation: floatAmbient1 28s ease-in-out infinite alternate-reverse;
    }

    .orb-4 {
      inset-block-start: 78%;
      inset-inline-end: -4%;
      inline-size: clamp(340px, 42vw, 620px);
      block-size: clamp(340px, 42vw, 620px);
      background: radial-gradient(circle, var(--mesh-bg-1) 0%, transparent 70%);
      filter: blur(85px);
      animation: floatAmbient2 24s ease-in-out infinite alternate;
    }

    @keyframes floatAmbient1 {
      0% {
        transform: translate3d(0, 0, 0) scale(1);
      }
      100% {
        transform: translate3d(35px, -30px, 0) scale(1.08);
      }
    }

    @keyframes floatAmbient2 {
      0% {
        transform: translate3d(0, 0, 0) scale(1);
      }
      100% {
        transform: translate3d(-30px, 25px, 0) scale(1.06);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .backdrop-orb {
        animation: none !important;
      }
    }

    /* ==========================================================================
       HERO SECTION
       ========================================================================== */
    .hero {
      position: relative;
      z-index: 1;
      min-block-size: calc(100svh - 4.5rem);
      overflow: hidden;
      padding-block: clamp(3rem, 6vw, 5.5rem) clamp(2.5rem, 5vw, 4rem);
      display: flex;
      align-items: center;
      isolation: isolate;
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

    /* ==========================================================================
       4. QUALIFICATIONS SECTION
       ========================================================================== */
    .qualifications-section {
      padding-block: clamp(3.5rem, 6vw, 5rem);
      position: relative;
    }

    .qualifications-header-wrap {
      display: grid;
      gap: 0.5rem;
      max-inline-size: 800px;
      margin-block-end: 2rem;
    }

    .qualification-card-wrap {
      inline-size: 100%;
      max-inline-size: 100%;
    }

    .qualification-card {
      position: relative;
      inline-size: 100%;
      border-radius: 1.75rem;
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      box-shadow: 0 16px 40px -12px var(--primary-glow);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      padding: clamp(1.5rem, 3.5vw, 2.5rem);
      overflow: hidden;
      transition: transform 250ms cubic-bezier(0.4, 0, 0.2, 1),
                  border-color 250ms ease,
                  box-shadow 250ms ease;

      &:hover {
        transform: translateY(-4px);
        border-color: var(--border-hover);
        box-shadow: 0 20px 48px -10px var(--primary-glow);

        .institution-icon-disc {
          transform: scale(1.08) rotate(3deg);
          box-shadow: 0 0 24px var(--primary-glow);
        }
      }
    }

    .card-ambient-glow {
      position: absolute;
      top: -30%;
      left: -20%;
      width: 60%;
      height: 70%;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(6, 182, 212, 0.12), transparent 70%);
      pointer-events: none;
      z-index: 0;
    }

    .qualification-header {
      position: relative;
      z-index: 1;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1.25rem;
      padding-block-end: 1.25rem;
      border-block-end: 1px solid var(--border-subtle);
    }

    .institution-brand {
      display: flex;
      align-items: flex-start;
      gap: 1.25rem;
      min-inline-size: 0;
    }

    .institution-icon-disc {
      display: grid;
      place-items: center;
      inline-size: 3.5rem;
      block-size: 3.5rem;
      border-radius: 1rem;
      background: var(--bg-pill);
      border: 1px solid var(--border-hover);
      color: var(--primary);
      box-shadow: 0 4px 16px -2px var(--primary-glow);
      flex-shrink: 0;
      transition: all 250ms ease;

      mat-icon {
        font-size: 1.85rem;
        inline-size: 1.85rem;
        block-size: 1.85rem;
      }
    }

    .institution-details {
      display: grid;
      gap: 0.35rem;
      min-inline-size: 0;
    }

    .brand-badge-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.5rem;
    }

    .brand-tag {
      font-size: 0.85rem;
      font-weight: 800;
      letter-spacing: 0.05em;
      color: var(--primary);
      text-transform: uppercase;
    }

    .distinction-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      background: rgba(6, 182, 212, 0.1);
      border: 1px solid rgba(6, 182, 212, 0.3);
      color: var(--primary);
      font-size: 0.78rem;
      font-weight: 700;

      mat-icon {
        font-size: 1rem;
        inline-size: 1rem;
        block-size: 1rem;
      }
    }

    .degree-title {
      margin: 0;
      font-size: clamp(1.2rem, 2.5vw, 1.45rem);
      font-weight: 700;
      color: var(--text-primary);
      letter-spacing: -0.01em;
      line-height: 1.3;
    }

    .university-name {
      margin: 0;
      font-size: 0.95rem;
      font-weight: 500;
      color: var(--text-secondary);
    }

    /* Mentioned in Quotes */
    .qualification-quote-container {
      position: relative;
      z-index: 1;
      margin-block-start: 1.5rem;
      margin-block-end: 0;
      padding: 1.35rem 1.75rem;
      border-radius: 1.25rem;
      background: var(--bg-surface-elevated);
      border: 1px solid var(--border-subtle);
      border-inline-start: 4px solid var(--primary);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
    }

    .quote-symbol {
      position: absolute;
      top: -0.25rem;
      left: 1rem;
      font-family: Georgia, serif;
      font-size: 4rem;
      line-height: 1;
      color: var(--primary);
      opacity: 0.15;
      user-select: none;
      pointer-events: none;
    }

    .qualification-quote {
      margin: 0;
      padding: 0;
      position: relative;
      z-index: 1;
    }

    .quote-text {
      margin: 0;
      font-size: clamp(0.95rem, 1.8vw, 1.05rem);
      font-style: italic;
      font-weight: 500;
      color: var(--text-primary);
      line-height: 1.7;
    }

    /* ==========================================================================
       4. SKILLS SECTION
       ========================================================================== */
    .skills-section {
      padding-block: clamp(3.5rem, 6vw, 5.5rem);
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
      align-items: center;
      justify-content: flex-start;
      gap: 1rem;
      padding-block-end: 1rem;
      margin-block-end: 1.25rem;
      border-block-end: 1px solid var(--border-subtle);
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

    .core-tech-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(min(100%, 11.5rem), 1fr));
      gap: 0.85rem;
    }

    .core-tech-card {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      padding: 0.75rem 1rem;
      border-radius: 1rem;
      background: var(--bg-surface-elevated);
      border: 1px solid var(--border-subtle);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
      min-block-size: 3.75rem;
      transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1),
                  border-color 200ms ease,
                  background-color 200ms ease,
                  box-shadow 200ms ease;

      &:hover {
        transform: translateY(-3px);
        border-color: var(--border-hover);
        background: var(--bg-pill);
        box-shadow: 0 8px 24px -4px var(--primary-glow);

        .tech-icon-disc {
          transform: scale(1.12);
          box-shadow: 0 0 16px var(--primary-glow);
        }
      }
    }

    .tech-icon-disc {
      display: grid;
      place-items: center;
      inline-size: 2.35rem;
      block-size: 2.35rem;
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

    .tech-card-name {
      font-size: 0.92rem;
      font-weight: 600;
      color: var(--text-primary);
      line-height: 1.35;
      word-break: normal;
      overflow-wrap: break-word;
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
       MOBILE APK & INCLINED 3D APP SHOWCASE (Ultra-Modern Neo-Cyber Design)
       ========================================================================== */
    .mobile-app-section {
      position: relative;
      padding: 5rem 0 3.5rem;
      overflow: hidden;

      .mobile-app-card {
        position: relative;
        border-radius: 2.25rem;
        background: radial-gradient(circle at 85% 25%, rgba(99, 102, 241, 0.22) 0%, transparent 45%),
                    radial-gradient(circle at 15% 75%, rgba(56, 189, 248, 0.16) 0%, transparent 40%),
                    linear-gradient(145deg, #090e1c 0%, #0d152a 50%, #070a14 100%);
        border: 1px solid rgba(99, 102, 241, 0.3);
        box-shadow: 0 30px 70px -15px rgba(0, 0, 0, 0.85),
                    0 0 60px rgba(99, 102, 241, 0.18),
                    inset 0 1px 0 rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(28px);
        -webkit-backdrop-filter: blur(28px);
        overflow: hidden;
        padding: 4rem 3.5rem;

        @media (max-width: 48rem) {
          padding: 2.5rem 1.5rem;
          border-radius: 1.75rem;
        }
      }

      .mobile-ambient-glow {
        position: absolute;
        border-radius: 50%;
        filter: blur(70px);
        pointer-events: none;

        &.glow-1 {
          top: -15%;
          right: 10%;
          width: 34rem;
          height: 34rem;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, rgba(168, 85, 247, 0.15) 50%, transparent 70%);
          animation: floatGlow 10s ease-in-out infinite alternate;
        }

        &.glow-2 {
          bottom: -10%;
          left: 5%;
          width: 28rem;
          height: 28rem;
          background: radial-gradient(circle, rgba(56, 189, 248, 0.2) 0%, rgba(99, 102, 241, 0.1) 50%, transparent 70%);
        }
      }

      .mobile-grid-pattern {
        position: absolute;
        inset: 0;
        background-image: radial-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1px);
        background-size: 28px 28px;
        opacity: 0.6;
        pointer-events: none;
      }

      .mobile-app-content {
        position: relative;
        z-index: 2;
        display: grid;
        grid-template-columns: 1fr;
        gap: 3.5rem;
        align-items: center;

        @media (min-width: 64rem) {
          grid-template-columns: 1.12fr 0.88fr;
          gap: 4rem;
        }
      }

      /* Left Column: High-Impact Typography & Feature Grid */
      .mobile-info-col {
        display: flex;
        flex-direction: column;
        gap: 1.6rem;
      }

      .app-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.65rem;
        align-self: flex-start;
        padding: 0.45rem 1.15rem;
        border-radius: 9999px;
        background: rgba(56, 189, 248, 0.1);
        border: 1px solid rgba(56, 189, 248, 0.4);
        box-shadow: 0 0 15px rgba(56, 189, 248, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15);
        color: #38bdf8;
        font-size: 0.85rem;
        font-weight: 600;
        letter-spacing: 0.03em;

        .app-pulse-dot {
          width: 0.55rem;
          height: 0.55rem;
          border-radius: 50%;
          background: #38bdf8;
          box-shadow: 0 0 10px #38bdf8;
          animation: pulseCyan 2s infinite;
        }

        .badge-icon {
          font-size: 1.15rem;
          width: 1.15rem;
          height: 1.15rem;
        }
      }

      .mobile-headline {
        margin: 0;
        font-size: clamp(2.2rem, 3.6vw, 3.1rem);
        font-weight: 800;
        line-height: 1.15;
        letter-spacing: -0.03em;
        color: #ffffff !important;
        text-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
      }

      .gradient-text-vibrant {
        background: linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #f472b6 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        display: inline-block;
        filter: drop-shadow(0 0 25px rgba(56, 189, 248, 0.4));
      }

      .mobile-desc {
        margin: 0;
        color: #cbd5e1 !important;
        font-size: 1.05rem;
        line-height: 1.7;

        strong {
          color: #ffffff !important;
          font-weight: 600;
        }
      }

      .mobile-features-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1.1rem;
        margin-top: 0.35rem;

        @media (min-width: 40rem) {
          grid-template-columns: repeat(3, 1fr);
        }
      }

      .mobile-feature-item {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        padding: 1.15rem;
        border-radius: 1.15rem;
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.09);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.08);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        transition: transform 0.25s cubic-bezier(0.2, 0, 0, 1), border-color 0.25s ease, box-shadow 0.25s ease;

        &:hover {
          transform: translateY(-3px);
          border-color: rgba(56, 189, 248, 0.45);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4), 0 0 20px rgba(56, 189, 248, 0.2);
        }

        .feature-icon-box {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.35rem;
          height: 2.35rem;
          border-radius: 0.75rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);

          &.icon-bolt {
            background: linear-gradient(135deg, rgba(56, 189, 248, 0.25), rgba(99, 102, 241, 0.25));
            border: 1px solid rgba(56, 189, 248, 0.35);
            color: #38bdf8;
          }

          &.icon-offline {
            background: linear-gradient(135deg, rgba(168, 85, 247, 0.25), rgba(236, 72, 153, 0.25));
            border: 1px solid rgba(168, 85, 247, 0.35);
            color: #c084fc;
          }

          &.icon-secure {
            background: linear-gradient(135deg, rgba(34, 197, 94, 0.25), rgba(16, 185, 129, 0.25));
            border: 1px solid rgba(34, 197, 94, 0.35);
            color: #4ade80;
          }

          mat-icon {
            font-size: 1.3rem;
            width: 1.3rem;
            height: 1.3rem;
          }
        }

        .feature-text {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;

          strong {
            color: #ffffff !important;
            font-size: 0.92rem;
            font-weight: 700;
          }

          span {
            color: #94a3b8 !important;
            font-size: 0.82rem;
            line-height: 1.45;
          }
        }
      }

      .apk-actions-wrapper {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 1.15rem;
        margin-top: 0.5rem;
      }

      .download-apk-btn {
        position: relative !important;
        overflow: hidden !important;
        display: inline-flex !important;
        align-items: center !important;
        gap: 0.95rem !important;
        padding: 0.85rem 1.85rem !important;
        height: auto !important;
        border-radius: 1.15rem !important;
        background: linear-gradient(135deg, #2563eb 0%, #6366f1 50%, #9333ea 100%) !important;
        color: #ffffff !important;
        box-shadow: 0 12px 30px -5px rgba(99, 102, 241, 0.65),
                    0 0 25px rgba(56, 189, 248, 0.4),
                    inset 0 1px 0 rgba(255, 255, 255, 0.4) !important;
        text-decoration: none !important;
        transition: transform 0.2s cubic-bezier(0.2, 0, 0, 1), box-shadow 0.2s ease !important;

        &:hover {
          transform: translateY(-3px) scale(1.02) !important;
          box-shadow: 0 18px 36px -5px rgba(99, 102, 241, 0.85),
                      0 0 35px rgba(56, 189, 248, 0.6),
                      inset 0 1px 0 rgba(255, 255, 255, 0.5) !important;
        }

        .btn-dl-icon {
          font-size: 1.7rem;
          width: 1.7rem;
          height: 1.7rem;
        }

        .btn-copy {
          display: flex;
          flex-direction: column;
          text-align: left;
          line-height: 1.2;

          .btn-sub {
            font-size: 0.72rem;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            color: rgba(255, 255, 255, 0.85);
            font-weight: 600;
          }

          .btn-main {
            font-size: 1.1rem;
            font-weight: 800;
            color: #ffffff;
          }
        }

        .btn-shine-bar {
          position: absolute;
          top: -50%;
          left: -80%;
          width: 50%;
          height: 200%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.35), transparent);
          transform: rotate(25deg);
          animation: btnShine 4s infinite;
          pointer-events: none;
        }
      }

      .github-release-btn {
        display: inline-flex !important;
        align-items: center !important;
        gap: 0.55rem !important;
        padding: 0.85rem 1.45rem !important;
        height: auto !important;
        border-radius: 1.15rem !important;
        color: #f1f5f9 !important;
        border: 1px solid rgba(255, 255, 255, 0.18) !important;
        background: rgba(255, 255, 255, 0.05) !important;
        backdrop-filter: blur(10px) !important;
        transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease !important;

        &:hover {
          transform: translateY(-2px) !important;
          background: rgba(255, 255, 255, 0.1) !important;
          border-color: #38bdf8 !important;
          box-shadow: 0 0 20px rgba(56, 189, 248, 0.3) !important;
        }
      }

      .apk-meta-specs {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 1.35rem;
        padding-top: 0.65rem;
        border-top: 1px solid rgba(255, 255, 255, 0.08);

        .meta-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          color: #94a3b8;
          font-size: 0.82rem;

          mat-icon {
            font-size: 1rem;
            width: 1rem;
            height: 1rem;
            color: #38bdf8;
          }
        }
      }

      /* Right Column: 3D Stage with Inclined iPhone */
      .mobile-device-col {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .device-stage {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        perspective: 1400px;
        perspective-origin: 50% 50%;
        transform-style: preserve-3d;
        padding: 3rem 1.5rem;
        width: 100%;
      }

      /* Concentric Pulsing Radar Rings */
      .device-radar-rings {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 440px;
        height: 440px;
        pointer-events: none;
        z-index: 1;

        .radar-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 1px solid rgba(99, 102, 241, 0.25);
          animation: radarPulse 6s cubic-bezier(0.2, 0.8, 0.2, 1) infinite;

          &.ring-1 { animation-delay: 0s; }
          &.ring-2 { animation-delay: 2s; }
          &.ring-3 { animation-delay: 4s; }
        }
      }

      .device-backdrop-glow {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 320px;
        height: 320px;
        background: radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, rgba(168, 85, 247, 0.2) 45%, transparent 70%);
        filter: blur(55px);
        border-radius: 50%;
        pointer-events: none;
        z-index: 2;
      }

      /* 3D Floating Micro-Badges */
      .floating-badge {
        position: absolute;
        z-index: 30;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.7rem 1.15rem;
        border-radius: 1.15rem;
        background: rgba(9, 14, 28, 0.88);
        border: 1px solid rgba(255, 255, 255, 0.16);
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        pointer-events: none;

        &.badge-top-right {
          top: 6%;
          right: -1rem;
          animation: floatBadgeTop 5s ease-in-out infinite;

          @media (max-width: 48rem) {
            right: 0;
            top: 2%;
          }
        }

        &.badge-bottom-left {
          bottom: 6%;
          left: -1.25rem;
          animation: floatBadgeBottom 5s ease-in-out infinite 1.5s;

          @media (max-width: 48rem) {
            left: 0;
            bottom: 2%;
          }
        }

        .floating-badge-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.25rem;
          height: 2.25rem;
          border-radius: 0.65rem;

          &.icon-speed {
            background: linear-gradient(135deg, rgba(236, 72, 153, 0.3), rgba(168, 85, 247, 0.3));
            color: #f472b6;
          }

          &.icon-cap {
            background: linear-gradient(135deg, rgba(56, 189, 248, 0.3), rgba(99, 102, 241, 0.3));
            color: #38bdf8;
          }

          mat-icon {
            font-size: 1.25rem;
            width: 1.25rem;
            height: 1.25rem;
          }
        }

        .floating-badge-body {
          display: flex;
          flex-direction: column;

          .fb-title {
            font-size: 0.7rem;
            color: #94a3b8;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }

          .fb-value {
            font-size: 0.92rem;
            color: #ffffff;
            font-weight: 700;
          }
        }
      }

      /* 3D INCLINED IPHONE 16 PRO CHASSIS */
      .iphone-3d-chassis {
        position: relative;
        z-index: 10;
        width: 275px;
        max-width: 78vw;
        aspect-ratio: 9 / 19.5;
        border-radius: 46px;
        background: #1c1f26;
        transform-style: preserve-3d;
        transform-origin: center center;

        /* Live 3D Inclined Floating Levitation Motion */
        animation: deviceInclineFloat 6s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;

        padding: 9px;
        display: flex;
        flex-direction: column;
        cursor: pointer;
        transition: box-shadow 0.4s ease;

        /* Realistic Multi-Layer 3D Extrusion Shadows for physical thickness */
        box-shadow:
          -1px 1px 0 #4a5568,
          -2px 2px 0 #3b4252,
          -3px 3px 0 #2d3748,
          -4px 4px 0 #1e2532,
          -5px 5px 0 #151a24,
          -6px 6px 0 #0d1017,
          -8px 8px 1px #080a0f,
          -15px 22px 35px rgba(0, 0, 0, 0.8),
          -28px 45px 75px rgba(0, 0, 0, 0.65),
          0 0 50px rgba(99, 102, 241, 0.35);

        &:hover {
          animation-play-state: paused;
          transform: rotateY(-18deg) rotateX(12deg) rotateZ(-3deg) translateY(-8px) scale(1.02);
          box-shadow:
            -1px 1px 0 #4a5568,
            -2px 2px 0 #3b4252,
            -3px 3px 0 #2d3748,
            -4px 4px 0 #1e2532,
            -5px 5px 0 #151a24,
            -6px 6px 0 #0d1017,
            -18px 28px 42px rgba(0, 0, 0, 0.9),
            -35px 55px 90px rgba(0, 0, 0, 0.75),
            0 0 65px rgba(56, 189, 248, 0.45);
        }

        @media (min-width: 48rem) {
          width: 295px;
          border-radius: 50px;
          padding: 10px;
        }

        /* Physical Hardware Buttons Extruded from 3D Left Edge */
        .hw-action-button,
        .hw-volume-up,
        .hw-volume-down,
        .hw-power-button {
          position: absolute;
          background: #383d47;
          border-radius: 3px;
          box-shadow: -1px 1px 2px rgba(0, 0, 0, 0.6);
        }

        .hw-action-button {
          left: -4px;
          top: 85px;
          width: 4px;
          height: 22px;
        }

        .hw-volume-up {
          left: -4px;
          top: 120px;
          width: 4px;
          height: 44px;
        }

        .hw-volume-down {
          left: -4px;
          top: 174px;
          width: 4px;
          height: 44px;
        }

        .hw-power-button {
          right: -4px;
          top: 130px;
          width: 4px;
          height: 62px;
        }

        .iphone-bezel {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 38px;
          background: #000000;
          overflow: hidden;
          display: flex;
          flex-direction: column;

          @media (min-width: 48rem) {
            border-radius: 42px;
          }
        }

        .iphone-screen {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
          background: #0a0e1a;
          display: flex;
          flex-direction: column;
        }

        /* Live Animated Dynamic Island */
        .dynamic-island {
          position: absolute;
          top: 9px;
          left: 50%;
          transform: translateX(-50%);
          width: 96px;
          height: 24px;
          background: #000000;
          border-radius: 14px;
          z-index: 20;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 9px;
          box-shadow: 0 0 1px 1px rgba(255, 255, 255, 0.12);

          .island-live-activity {
            display: flex;
            align-items: center;
            gap: 4px;

            .live-dot {
              width: 5px;
              height: 5px;
              border-radius: 50%;
              background: #22c55e;
              box-shadow: 0 0 6px #22c55e;
              animation: pulseGreen 1.5s infinite;
            }

            .live-eq {
              display: flex;
              align-items: center;
              gap: 2px;
              height: 10px;

              .eq-bar {
                width: 2px;
                background: #22c55e;
                border-radius: 1px;
                animation: eqDance 1.2s ease-in-out infinite;

                &.eq-1 { height: 4px; animation-delay: 0.1s; }
                &.eq-2 { height: 8px; animation-delay: 0.3s; }
                &.eq-3 { height: 6px; animation-delay: 0.2s; }
              }
            }
          }

          .island-camera-cluster {
            display: flex;
            align-items: center;
            gap: 5px;

            .island-sensor {
              width: 4px;
              height: 4px;
              border-radius: 50%;
              background: #0d121f;
            }

            .island-camera {
              width: 9px;
              height: 9px;
              border-radius: 50%;
              background: #090d16;
              border: 1px solid rgba(59, 130, 246, 0.6);
              box-shadow: inset 0 0 3px rgba(99, 102, 241, 0.9);
            }
          }
        }

        /* Live Sweeping Shimmer Beam */
        .screen-shine-beam {
          position: absolute;
          inset: -60%;
          background: linear-gradient(
            115deg,
            transparent 38%,
            rgba(255, 255, 255, 0.18) 48%,
            rgba(255, 255, 255, 0.35) 50%,
            rgba(255, 255, 255, 0.18) 52%,
            transparent 62%
          );
          pointer-events: none;
          z-index: 15;
          animation: shineSweep 4.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        .screen-glare-static {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.01) 35%, transparent 60%);
          pointer-events: none;
          z-index: 12;
        }

        .screen-picture {
          width: 100%;
          height: 100%;
          display: block;
        }

        .app-screenshot {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top center;
          display: block;
        }

        /* iOS Home Indicator */
        .home-indicator {
          position: absolute;
          bottom: 7px;
          left: 50%;
          transform: translateX(-50%);
          width: 95px;
          height: 3.5px;
          background: rgba(255, 255, 255, 0.7);
          border-radius: 999px;
          z-index: 15;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
        }
      }
    }

    /* Fallback media query to hide section if running standalone PWA / APK webview */
    @media all and (display-mode: standalone) {
      .mobile-app-section {
        display: none !important;
      }
    }

    /* Keyframe Animations for Mobile Device & Live Showcase */
    @keyframes deviceInclineFloat {
      0%, 100% {
        transform: rotateY(-24deg) rotateX(16deg) rotateZ(-5deg) translateY(0px);
      }
      50% {
        transform: rotateY(-18deg) rotateX(11deg) rotateZ(-3deg) translateY(-20px);
      }
    }

    @keyframes radarPulse {
      0% {
        transform: scale(0.6);
        opacity: 0.8;
      }
      50% {
        opacity: 0.25;
      }
      100% {
        transform: scale(1.35);
        opacity: 0;
      }
    }

    @keyframes shineSweep {
      0% {
        transform: translateX(-120%) translateY(-120%) rotate(25deg);
      }
      25%, 100% {
        transform: translateX(120%) translateY(120%) rotate(25deg);
      }
    }

    @keyframes pulseCyan {
      0% {
        box-shadow: 0 0 0 0 rgba(56, 189, 248, 0.7);
      }
      70% {
        box-shadow: 0 0 0 8px rgba(56, 189, 248, 0);
      }
      100% {
        box-shadow: 0 0 0 0 rgba(56, 189, 248, 0);
      }
    }

    @keyframes pulseGreen {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.85); }
    }

    @keyframes eqDance {
      0%, 100% { height: 3px; }
      50% { height: 10px; }
    }

    @keyframes floatBadgeTop {
      0%, 100% {
        transform: translateY(0) rotate(0deg);
      }
      50% {
        transform: translateY(-12px) rotate(1.5deg);
      }
    }

    @keyframes floatBadgeBottom {
      0%, 100% {
        transform: translateY(0) rotate(0deg);
      }
      50% {
        transform: translateY(-10px) rotate(-1.5deg);
      }
    }

    @keyframes btnShine {
      0% {
        transform: translateX(-150%) rotate(25deg);
      }
      30%, 100% {
        transform: translateX(350%) rotate(25deg);
      }
    }

    @keyframes floatGlow {
      0% {
        transform: translate(0, 0) scale(1);
      }
      100% {
        transform: translate(-30px, 20px) scale(1.08);
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
  readonly isMobileApp = signal<boolean>(false);

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
    if (typeof window !== 'undefined') {
      const win = window as any;
      const isCapacitor = Boolean(
        win.Capacitor?.isNativePlatform?.() ||
        win.Capacitor?.getPlatform?.() === 'android' ||
        win.Capacitor?.getPlatform?.() === 'ios'
      );
      const isStandalone = window.matchMedia?.('(display-mode: standalone)')?.matches ?? false;
      const isCustomScheme = window.location.protocol === 'capacitor:' || window.location.protocol === 'ionic:';
      this.isMobileApp.set(isCapacitor || isStandalone || isCustomScheme);
    }

    this.seo.update({
      title: 'Shubham Prajapati | Software Developer',
      description: this.profile().intro,
      image: this.profile().imageUrl
    });
  }

  onScreenImgError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img && !img.src.includes('app-screen.png')) {
      img.src = 'assets/images/app-screen.png';
    }
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
