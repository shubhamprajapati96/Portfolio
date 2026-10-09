import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  AdminApiService,
  DashboardStats,
  DownloadItem,
  EnquiryItem,
  VisitorItem
} from '../../../core/services/admin-api.service';
import { AdminAuthService } from '../../../core/services/admin-auth.service';

@Component({
  selector: 'app-admin-dashboard',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatTooltipModule
  ],
  template: `
    <div class="admin-dashboard-layout">
      <!-- TOP NAVIGATION BAR -->
      <header class="admin-topbar">
        <div class="topbar-left">
          <div class="admin-logo-badge">
            <mat-icon>shield</mat-icon>
            <span class="logo-text">Portfolio Control Center</span>
          </div>

          <div class="db-status-pill" [class.connected]="isMongoOnline()">
            <span class="status-dot"></span>
            <span>{{ dbStatus() }}</span>
          </div>
        </div>

        <div class="topbar-right">
          <a routerLink="/" class="preview-site-btn">
            <mat-icon>open_in_new</mat-icon>
            <span>Live Portfolio</span>
          </a>

          <div class="user-profile-badge">
            <mat-icon>account_circle</mat-icon>
            <span class="user-email">{{ currentEmail() }}</span>
          </div>

          <button mat-icon-button (click)="logout()" matTooltip="Sign Out" class="logout-btn">
            <mat-icon>logout</mat-icon>
          </button>
        </div>
      </header>

      <!-- MAIN CONTENT WRAPPER -->
      <main class="admin-main">
        <!-- TABS NAV -->
        <div class="tabs-nav-bar">
          <button
            type="button"
            class="tab-btn"
            [class.active]="activeTab() === 'overview'"
            (click)="setTab('overview')"
          >
            <mat-icon>insights</mat-icon>
            <span>Overview & KPIs</span>
          </button>

          <button
            type="button"
            class="tab-btn"
            [class.active]="activeTab() === 'enquiries'"
            (click)="setTab('enquiries')"
          >
            <mat-icon>contact_mail</mat-icon>
            <span>Enquiries</span>
            @if (stats()?.kpis?.newEnquiries) {
              <span class="badge-count">{{ stats()?.kpis?.newEnquiries }}</span>
            }
          </button>

          <button
            type="button"
            class="tab-btn"
            [class.active]="activeTab() === 'visitors'"
            (click)="setTab('visitors')"
          >
            <mat-icon>travel_explore</mat-icon>
            <span>Visitors Telemetry</span>
          </button>

          <button
            type="button"
            class="tab-btn"
            [class.active]="activeTab() === 'downloads'"
            (click)="setTab('downloads')"
          >
            <mat-icon>download_for_offline</mat-icon>
            <span>APK Downloads</span>
            @if (stats()?.kpis?.totalDownloads) {
              <span class="badge-count count-cyan">{{ stats()?.kpis?.totalDownloads }}</span>
            }
          </button>
        </div>

        @if (isLoading()) {
          <div class="loading-state">
            <mat-spinner diameter="40"></mat-spinner>
            <p>Loading analytics and telemetry data...</p>
          </div>
        } @else {
          <!-- TAB 1: OVERVIEW & KPIS -->
          @if (activeTab() === 'overview') {
            <section class="tab-pane overview-pane">
              <!-- KPI STAT CARDS -->
              <div class="kpi-grid">
                <article class="kpi-card card-cyan">
                  <div class="kpi-header">
                    <span class="kpi-label">Total Visitors</span>
                    <div class="kpi-icon-wrap"><mat-icon>group</mat-icon></div>
                  </div>
                  <div class="kpi-value">{{ stats()?.kpis?.totalVisitors || 0 }}</div>
                  <div class="kpi-meta">
                    <span class="meta-highlight">+{{ stats()?.kpis?.todayVisitors || 0 }} today</span>
                    <span class="meta-sub">· {{ stats()?.kpis?.totalVisits || 0 }} total sessions</span>
                  </div>
                </article>

                <article class="kpi-card card-purple">
                  <div class="kpi-header">
                    <span class="kpi-label">Contact Enquiries</span>
                    <div class="kpi-icon-wrap"><mat-icon>mail</mat-icon></div>
                  </div>
                  <div class="kpi-value">{{ stats()?.kpis?.totalEnquiries || 0 }}</div>
                  <div class="kpi-meta">
                    <span class="meta-highlight">{{ stats()?.kpis?.newEnquiries || 0 }} unread</span>
                    <span class="meta-sub">· +{{ stats()?.kpis?.todayEnquiries || 0 }} today</span>
                  </div>
                </article>

                <article class="kpi-card card-emerald">
                  <div class="kpi-header">
                    <span class="kpi-label">APK Downloads</span>
                    <div class="kpi-icon-wrap"><mat-icon>android</mat-icon></div>
                  </div>
                  <div class="kpi-value">{{ stats()?.kpis?.totalDownloads || 0 }}</div>
                  <div class="kpi-meta">
                    <span class="meta-highlight">+{{ stats()?.kpis?.todayDownloads || 0 }} today</span>
                    <span class="meta-sub">· Android Mobile App</span>
                  </div>
                </article>

                <article class="kpi-card card-blue">
                  <div class="kpi-header">
                    <span class="kpi-label">Platform Distribution</span>
                    <div class="kpi-icon-wrap"><mat-icon>devices</mat-icon></div>
                  </div>
                  <div class="kpi-value">
                    {{ stats()?.sourceBreakdown?.web || 0 }} <span class="kpi-unit">Web</span> /
                    {{ stats()?.sourceBreakdown?.apk || 0 }} <span class="kpi-unit">APK</span>
                  </div>
                  <div class="kpi-meta">
                    <span class="meta-sub">Desktop: {{ stats()?.deviceBreakdown?.desktop || 0 }} · Mobile: {{ stats()?.deviceBreakdown?.mobile || 0 }}</span>
                  </div>
                </article>
              </div>

              <!-- DISTRIBUTION & TOP COUNTRIES -->
              <div class="overview-analytics-grid">
                <!-- TOP COUNTRIES -->
                <article class="dash-card">
                  <header class="dash-card-header">
                    <div class="card-title-group">
                      <mat-icon>public</mat-icon>
                      <h3>Top Visitor Countries</h3>
                    </div>
                    <span class="card-meta">Geographic Telemetry</span>
                  </header>

                  <div class="country-list">
                    @if (stats()?.topCountries?.length) {
                      @for (item of stats()?.topCountries; track item.country) {
                        <div class="country-row">
                          <div class="country-info">
                            <span class="country-name">{{ item.country }}</span>
                            <span class="country-count">{{ item.count }} visits</span>
                          </div>
                          <div class="progress-track">
                            <div
                              class="progress-fill"
                              [style.width.%]="calcPercentage(item.count, stats()?.kpis?.totalVisitors)"
                            ></div>
                          </div>
                        </div>
                      }
                    } @else {
                      <div class="empty-state">
                        <mat-icon>map</mat-icon>
                        <p>No geographic visitor data captured yet.</p>
                      </div>
                    }
                  </div>
                </article>

                <!-- RECENT ACTIVITY FEED -->
                <article class="dash-card">
                  <header class="dash-card-header">
                    <div class="card-title-group">
                      <mat-icon>history</mat-icon>
                      <h3>Recent Activity Stream</h3>
                    </div>
                    <span class="card-meta">Real-Time Events</span>
                  </header>

                  <div class="activity-feed">
                    @if (stats()?.recentActivity?.length) {
                      @for (act of stats()?.recentActivity; track act.timestamp) {
                        <div class="activity-item">
                          <div class="act-icon-wrap" [class]="act.type">
                            <mat-icon>
                              @if (act.type === 'enquiry') { contact_mail }
                              @else if (act.type === 'download') { download }
                              @else { visibility }
                            </mat-icon>
                          </div>
                          <div class="act-content">
                            <strong class="act-title">{{ act.title }}</strong>
                            <p class="act-subtitle">{{ act.subtitle }}</p>
                            <span class="act-meta">{{ act.meta }} · {{ formatTime(act.timestamp) }}</span>
                          </div>
                        </div>
                      }
                    } @else {
                      <div class="empty-state">
                        <mat-icon>schedule</mat-icon>
                        <p>Waiting for live visits, downloads, or contact enquiries.</p>
                      </div>
                    }
                  </div>
                </article>
              </div>
            </section>
          }

          <!-- TAB 2: ENQUIRIES -->
          @if (activeTab() === 'enquiries') {
            <section class="tab-pane">
              <div class="pane-controls">
                <div class="search-wrap">
                  <mat-icon>search</mat-icon>
                  <input
                    type="text"
                    [(ngModel)]="enquirySearch"
                    (input)="filterEnquiries()"
                    placeholder="Search by name, email, subject, or message..."
                  />
                </div>

                <div class="filter-pills">
                  <button
                    type="button"
                    class="filter-pill"
                    [class.active]="enquiryStatusFilter === 'all'"
                    (click)="setEnquiryFilter('all')"
                  >
                    All ({{ allEnquiries().length }})
                  </button>
                  <button
                    type="button"
                    class="filter-pill"
                    [class.active]="enquiryStatusFilter === 'new'"
                    (click)="setEnquiryFilter('new')"
                  >
                    New ({{ countByStatus('new') }})
                  </button>
                  <button
                    type="button"
                    class="filter-pill"
                    [class.active]="enquiryStatusFilter === 'read'"
                    (click)="setEnquiryFilter('read')"
                  >
                    Read ({{ countByStatus('read') }})
                  </button>
                  <button
                    type="button"
                    class="filter-pill"
                    [class.active]="enquiryStatusFilter === 'replied'"
                    (click)="setEnquiryFilter('replied')"
                  >
                    Replied ({{ countByStatus('replied') }})
                  </button>
                </div>
              </div>

              <!-- ENQUIRIES LIST TABLE -->
              <div class="data-table-wrap">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th>Sender</th>
                      <th>Subject & Message</th>
                      <th>Origin & Device</th>
                      <th>Source</th>
                      <th>Status</th>
                      <th>Received</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    @if (filteredEnquiries().length) {
                      @for (item of filteredEnquiries(); track item._id) {
                        <tr [class.unread]="item.status === 'new'">
                          <td>
                            <div class="sender-cell">
                              <strong class="sender-name">{{ item.name }}</strong>
                              <a [href]="'mailto:' + item.email" class="sender-email">{{ item.email }}</a>
                            </div>
                          </td>
                          <td>
                            <div class="subject-cell">
                              <span class="subject-text">{{ item.subject }}</span>
                              <p class="msg-snippet">{{ item.message }}</p>
                            </div>
                          </td>
                          <td>
                            <div class="location-cell">
                              <span class="loc-geo">{{ item.city }}, {{ item.country }}</span>
                              <span class="loc-ip">{{ item.ipAddress }} · {{ item.deviceType }}</span>
                            </div>
                          </td>
                          <td>
                            <span class="source-tag" [class.apk]="item.source === 'apk'">
                              {{ item.source.toUpperCase() }}
                            </span>
                          </td>
                          <td>
                            <select
                              class="status-select"
                              [value]="item.status"
                              (change)="onStatusChange(item, $event)"
                            >
                              <option value="new">New</option>
                              <option value="read">Read</option>
                              <option value="replied">Replied</option>
                              <option value="archived">Archived</option>
                            </select>
                          </td>
                          <td>
                            <span class="time-cell">{{ formatTime(item.createdAt) }}</span>
                          </td>
                          <td>
                            <div class="row-actions">
                              <a
                                [href]="'mailto:' + item.email + '?subject=Re: ' + item.subject"
                                class="action-btn email-btn"
                                matTooltip="Reply via Email"
                              >
                                <mat-icon>reply</mat-icon>
                              </a>
                              <button
                                type="button"
                                class="action-btn delete-btn"
                                matTooltip="Delete Enquiry"
                                (click)="deleteEnquiry(item._id)"
                              >
                                <mat-icon>delete_outline</mat-icon>
                              </button>
                            </div>
                          </td>
                        </tr>
                      }
                    } @else {
                      <tr>
                        <td colspan="7" class="empty-cell">
                          <mat-icon>inbox</mat-icon>
                          <p>No enquiries matching current filters.</p>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </section>
          }

          <!-- TAB 3: VISITORS -->
          @if (activeTab() === 'visitors') {
            <section class="tab-pane">
              <div class="pane-controls">
                <div class="search-wrap">
                  <mat-icon>search</mat-icon>
                  <input
                    type="text"
                    [(ngModel)]="visitorSearch"
                    (input)="filterVisitors()"
                    placeholder="Search by IP, city, country, browser, or OS..."
                  />
                </div>

                <div class="filter-pills">
                  <button
                    type="button"
                    class="filter-pill"
                    [class.active]="visitorSourceFilter === 'all'"
                    (click)="setVisitorSourceFilter('all')"
                  >
                    All Visitors ({{ allVisitors().length }})
                  </button>
                  <button
                    type="button"
                    class="filter-pill"
                    [class.active]="visitorSourceFilter === 'web'"
                    (click)="setVisitorSourceFilter('web')"
                  >
                    Web Visitors
                  </button>
                  <button
                    type="button"
                    class="filter-pill"
                    [class.active]="visitorSourceFilter === 'apk'"
                    (click)="setVisitorSourceFilter('apk')"
                  >
                    APK App Visitors
                  </button>
                </div>
              </div>

              <!-- VISITORS TABLE -->
              <div class="data-table-wrap">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th>IP & Location</th>
                      <th>Platform / Source</th>
                      <th>Device & Browser</th>
                      <th>Page Visited</th>
                      <th>Referrer</th>
                      <th>Visits</th>
                      <th>Last Active</th>
                    </tr>
                  </thead>
                  <tbody>
                    @if (filteredVisitors().length) {
                      @for (v of filteredVisitors(); track v._id) {
                        <tr>
                          <td>
                            <div class="sender-cell">
                              <strong class="sender-name">{{ v.city }}, {{ v.country }}</strong>
                              <span class="sender-email">{{ v.ipAddress }} · {{ v.region }}</span>
                            </div>
                          </td>
                          <td>
                            <span class="source-tag" [class.apk]="v.source === 'apk'">
                              {{ v.source.toUpperCase() }}
                            </span>
                          </td>
                          <td>
                            <div class="subject-cell">
                              <span class="subject-text">{{ v.browser }} on {{ v.os }}</span>
                              <span class="msg-snippet">Device: {{ v.deviceType }}</span>
                            </div>
                          </td>
                          <td>
                            <span class="path-badge">{{ v.pageUrl }}</span>
                          </td>
                          <td>
                            <span class="referrer-text">{{ v.referrer }}</span>
                          </td>
                          <td>
                            <span class="count-pill">{{ v.visitCount }}</span>
                          </td>
                          <td>
                            <span class="time-cell">{{ formatTime(v.lastVisitedAt) }}</span>
                          </td>
                        </tr>
                      }
                    } @else {
                      <tr>
                        <td colspan="7" class="empty-cell">
                          <mat-icon>person_search</mat-icon>
                          <p>No visitor logs matching filters.</p>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </section>
          }

          <!-- TAB 4: APK DOWNLOADS -->
          @if (activeTab() === 'downloads') {
            <section class="tab-pane">
              <!-- APK HEADER CALLOUT -->
              <div class="apk-download-hero-card">
                <div class="hero-apk-left">
                  <div class="apk-icon-circle"><mat-icon>android</mat-icon></div>
                  <div class="hero-apk-details">
                    <h3>Android APK Download Telemetry</h3>
                    <p>
                      Tracks who, where, and when visitors downloaded
                      <strong>Shubham-Portfolio.apk</strong> from the website.
                    </p>
                  </div>
                </div>

                <div class="hero-apk-actions">
                  <a
                    href="/downloads/Shubham-Portfolio.apk"
                    download="Shubham-Portfolio.apk"
                    class="apk-test-btn"
                  >
                    <mat-icon>download</mat-icon>
                    <span>Download APK File</span>
                  </a>
                </div>
              </div>

              <!-- DOWNLOADS LOG TABLE -->
              <div class="data-table-wrap">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th>Downloader Location</th>
                      <th>IP Address</th>
                      <th>Platform / Device</th>
                      <th>User Agent</th>
                      <th>Version</th>
                      <th>Download Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    @if (downloads().length) {
                      @for (dl of downloads(); track dl._id) {
                        <tr>
                          <td>
                            <div class="sender-cell">
                              <strong class="sender-name">{{ dl.city }}, {{ dl.country }}</strong>
                              <span class="sender-email">{{ dl.region }}</span>
                            </div>
                          </td>
                          <td>
                            <span class="loc-ip">{{ dl.ipAddress }}</span>
                          </td>
                          <td>
                            <span class="source-tag apk">
                              {{ dl.platform }} ({{ dl.deviceType }})
                            </span>
                          </td>
                          <td>
                            <span class="ua-snippet" [title]="dl.userAgent">{{ dl.userAgent }}</span>
                          </td>
                          <td>
                            <span class="version-tag">v{{ dl.version }}</span>
                          </td>
                          <td>
                            <span class="time-cell">{{ formatTime(dl.timestamp) }}</span>
                          </td>
                        </tr>
                      }
                    } @else {
                      <tr>
                        <td colspan="6" class="empty-cell">
                          <mat-icon>cloud_download</mat-icon>
                          <p>No APK download logs recorded yet. Clicks on the website download button will appear here in real time.</p>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </section>
          }
        }
      </main>
    </div>
  `,
  styles: `
    :host {
      display: block;
      min-block-size: 100vh;
      background: var(--bg-base, #030712);
      color: var(--text-primary, #f9fafb);
      font-family: inherit;
    }

    .admin-dashboard-layout {
      min-block-size: 100vh;
      display: flex;
      flex-direction: column;
    }

    /* TOPBAR */
    .admin-topbar {
      position: sticky;
      inset-block-start: 0;
      z-index: 50;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 0.85rem clamp(1rem, 3vw, 2rem);
      background: rgba(11, 17, 32, 0.88);
      border-block-end: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.08));
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
    }

    .topbar-left,
    .topbar-right {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .admin-logo-badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--primary, #06b6d4);
      font-weight: 800;
      font-size: 1.05rem;

      mat-icon {
        font-size: 1.4rem;
        inline-size: 1.4rem;
        block-size: 1.4rem;
      }
    }

    .db-status-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      padding: 0.25rem 0.65rem;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 600;
      background: rgba(234, 179, 8, 0.12);
      border: 1px solid rgba(234, 179, 8, 0.3);
      color: #facc15;

      .status-dot {
        inline-size: 0.5rem;
        block-size: 0.5rem;
        border-radius: 999px;
        background: #facc15;
      }

      &.connected {
        background: rgba(16, 185, 129, 0.12);
        border-color: rgba(16, 185, 129, 0.3);
        color: #34d399;

        .status-dot {
          background: #10b981;
          box-shadow: 0 0 8px #10b981;
        }
      }
    }

    .preview-site-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.45rem 0.85rem;
      border-radius: 999px;
      border: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.15));
      background: rgba(255, 255, 255, 0.04);
      color: var(--text-secondary, #9ca3af);
      font-size: 0.825rem;
      font-weight: 600;
      transition: all 180ms ease;

      &:hover {
        background: rgba(255, 255, 255, 0.08);
        color: #ffffff;
      }

      mat-icon {
        font-size: 0.95rem;
        inline-size: 0.95rem;
        block-size: 0.95rem;
      }
    }

    .user-profile-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      font-size: 0.85rem;
      color: var(--text-secondary, #9ca3af);

      mat-icon {
        font-size: 1.25rem;
        inline-size: 1.25rem;
        block-size: 1.25rem;
      }
    }

    .logout-btn {
      color: #ef4444 !important;
    }

    /* MAIN CONTAINER */
    .admin-main {
      flex: 1;
      padding: clamp(1rem, 2.5vw, 2rem);
      max-inline-size: 88rem;
      margin-inline: auto;
      inline-size: 100%;
    }

    /* TABS */
    .tabs-nav-bar {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      border-block-end: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.08));
      margin-block-end: 1.75rem;
      overflow-x: auto;
      scrollbar-width: none;
    }

    .tab-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.85rem 1.25rem;
      background: none;
      border: none;
      border-block-end: 2px solid transparent;
      color: var(--text-secondary, #9ca3af);
      font-size: 0.925rem;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
      transition: all 180ms ease;

      &:hover {
        color: #ffffff;
      }

      &.active {
        color: var(--primary, #06b6d4);
        border-block-end-color: var(--primary, #06b6d4);
      }

      mat-icon {
        font-size: 1.2rem;
        inline-size: 1.2rem;
        block-size: 1.2rem;
      }

      .badge-count {
        background: #ef4444;
        color: #ffffff;
        font-size: 0.72rem;
        font-weight: 700;
        padding: 0.15rem 0.45rem;
        border-radius: 999px;

        &.count-cyan {
          background: #0284c7;
        }
      }
    }

    /* KPI GRID */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
      gap: 1.25rem;
      margin-block-end: 1.75rem;
    }

    .kpi-card {
      padding: 1.35rem 1.5rem;
      border-radius: 1.25rem;
      background: var(--bg-card, rgba(17, 24, 39, 0.7));
      border: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.08));
      box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.25);

      .kpi-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-block-end: 0.75rem;
      }

      .kpi-label {
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--text-secondary, #9ca3af);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .kpi-icon-wrap {
        inline-size: 2.25rem;
        block-size: 2.25rem;
        border-radius: 0.65rem;
        display: grid;
        place-items: center;

        mat-icon {
          font-size: 1.2rem;
          inline-size: 1.2rem;
          block-size: 1.2rem;
        }
      }

      .kpi-value {
        font-size: 2.1rem;
        font-weight: 800;
        letter-spacing: -0.02em;
        line-height: 1.1;
        margin-block-end: 0.5rem;

        .kpi-unit {
          font-size: 1.1rem;
          color: var(--text-secondary, #9ca3af);
          font-weight: 600;
        }
      }

      .kpi-meta {
        font-size: 0.8rem;
        color: var(--text-secondary, #9ca3af);

        .meta-highlight {
          color: #10b981;
          font-weight: 700;
        }
      }

      &.card-cyan .kpi-icon-wrap {
        background: rgba(6, 182, 212, 0.15);
        color: #06b6d4;
      }
      &.card-purple .kpi-icon-wrap {
        background: rgba(168, 85, 247, 0.15);
        color: #a855f7;
      }
      &.card-emerald .kpi-icon-wrap {
        background: rgba(16, 185, 129, 0.15);
        color: #10b981;
      }
      &.card-blue .kpi-icon-wrap {
        background: rgba(59, 130, 246, 0.15);
        color: #3b82f6;
      }
    }

    /* OVERVIEW ANALYTICS GRID */
    .overview-analytics-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;

      @media (min-width: 56rem) {
        grid-template-columns: 1fr 1fr;
      }
    }

    .dash-card {
      padding: 1.5rem;
      border-radius: 1.25rem;
      background: var(--bg-card, rgba(17, 24, 39, 0.7));
      border: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.08));

      .dash-card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-block-end: 1.25rem;
        padding-block-end: 0.75rem;
        border-block-end: 1px solid rgba(255, 255, 255, 0.06);

        .card-title-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #ffffff;

          h3 {
            margin: 0;
            font-size: 1.05rem;
            font-weight: 700;
          }

          mat-icon {
            color: var(--primary, #06b6d4);
            font-size: 1.25rem;
            inline-size: 1.25rem;
            block-size: 1.25rem;
          }
        }

        .card-meta {
          font-size: 0.78rem;
          color: var(--text-secondary, #9ca3af);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 600;
        }
      }
    }

    .country-list {
      display: grid;
      gap: 1rem;

      .country-row {
        display: grid;
        gap: 0.35rem;

        .country-info {
          display: flex;
          justify-content: space-between;
          font-size: 0.88rem;

          .country-name {
            font-weight: 600;
            color: #ffffff;
          }

          .country-count {
            color: var(--text-secondary, #9ca3af);
            font-weight: 500;
          }
        }

        .progress-track {
          inline-size: 100%;
          block-size: 0.4rem;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.08);
          overflow: hidden;

          .progress-fill {
            block-size: 100%;
            border-radius: 999px;
            background: linear-gradient(90deg, #06b6d4, #3b82f6);
          }
        }
      }
    }

    .activity-feed {
      display: grid;
      gap: 0.85rem;

      .activity-item {
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
        padding: 0.65rem 0.85rem;
        border-radius: 0.75rem;
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(255, 255, 255, 0.04);

        .act-icon-wrap {
          inline-size: 2rem;
          block-size: 2rem;
          border-radius: 0.5rem;
          display: grid;
          place-items: center;
          flex-shrink: 0;

          mat-icon {
            font-size: 1rem;
            inline-size: 1rem;
            block-size: 1rem;
          }

          &.enquiry {
            background: rgba(168, 85, 247, 0.2);
            color: #c084fc;
          }
          &.download {
            background: rgba(16, 185, 129, 0.2);
            color: #34d399;
          }
          &.visitor {
            background: rgba(6, 182, 212, 0.2);
            color: #38bdf8;
          }
        }

        .act-content {
          flex: 1;

          .act-title {
            display: block;
            font-size: 0.85rem;
            color: #ffffff;
          }

          .act-subtitle {
            margin: 0.15rem 0 0.25rem;
            font-size: 0.78rem;
            color: var(--text-secondary, #9ca3af);
            line-height: 1.3;
          }

          .act-meta {
            font-size: 0.72rem;
            color: #6b7280;
          }
        }
      }
    }

    /* PANE CONTROLS */
    .pane-controls {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      margin-block-end: 1.25rem;
    }

    .search-wrap {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.55rem 0.9rem;
      border-radius: 0.75rem;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.1);
      flex: 1;
      max-inline-size: 26rem;

      mat-icon {
        color: var(--text-secondary, #9ca3af);
        font-size: 1.15rem;
        inline-size: 1.15rem;
        block-size: 1.15rem;
      }

      input {
        background: transparent;
        border: none;
        outline: none;
        color: #ffffff;
        font-size: 0.88rem;
        inline-size: 100%;

        &::placeholder {
          color: #6b7280;
        }
      }
    }

    .filter-pills {
      display: flex;
      gap: 0.4rem;
      flex-wrap: wrap;

      .filter-pill {
        padding: 0.4rem 0.8rem;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: var(--text-secondary, #9ca3af);
        font-size: 0.78rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 160ms ease;

        &:hover {
          background: rgba(255, 255, 255, 0.08);
          color: #ffffff;
        }

        &.active {
          background: rgba(6, 182, 212, 0.15);
          border-color: var(--primary, #06b6d4);
          color: var(--primary, #06b6d4);
        }
      }
    }

    /* DATA TABLE */
    .data-table-wrap {
      border-radius: 1rem;
      background: var(--bg-card, rgba(17, 24, 39, 0.7));
      border: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.08));
      overflow-x: auto;
    }

    .data-table {
      inline-size: 100%;
      border-collapse: collapse;
      text-align: start;

      th {
        padding: 0.85rem 1rem;
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: var(--text-secondary, #9ca3af);
        border-block-end: 1px solid rgba(255, 255, 255, 0.08);
        background: rgba(255, 255, 255, 0.02);
      }

      td {
        padding: 0.85rem 1rem;
        font-size: 0.85rem;
        border-block-end: 1px solid rgba(255, 255, 255, 0.04);
        vertical-align: middle;
      }

      tr.unread td {
        background: rgba(6, 182, 212, 0.03);
      }
    }

    .sender-cell {
      display: grid;
      gap: 0.15rem;

      .sender-name {
        color: #ffffff;
        font-weight: 700;
      }

      .sender-email {
        color: var(--text-secondary, #9ca3af);
        font-size: 0.78rem;
      }
    }

    .subject-cell {
      max-inline-size: 22rem;

      .subject-text {
        display: block;
        font-weight: 600;
        color: #ffffff;
      }

      .msg-snippet {
        margin: 0.2rem 0 0;
        font-size: 0.78rem;
        color: var(--text-secondary, #9ca3af);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .location-cell {
      display: grid;
      gap: 0.15rem;

      .loc-geo {
        color: #ffffff;
        font-weight: 600;
        font-size: 0.82rem;
      }

      .loc-ip {
        color: #6b7280;
        font-size: 0.75rem;
      }
    }

    .source-tag {
      display: inline-block;
      padding: 0.2rem 0.55rem;
      border-radius: 0.4rem;
      font-size: 0.72rem;
      font-weight: 700;
      background: rgba(59, 130, 246, 0.15);
      color: #60a5fa;

      &.apk {
        background: rgba(16, 185, 129, 0.15);
        color: #34d399;
      }
    }

    .status-select {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 0.5rem;
      color: #ffffff;
      padding: 0.3rem 0.5rem;
      font-size: 0.78rem;
      font-weight: 600;
      outline: none;
      cursor: pointer;
    }

    .time-cell {
      color: var(--text-secondary, #9ca3af);
      font-size: 0.78rem;
      white-space: nowrap;
    }

    .row-actions {
      display: flex;
      align-items: center;
      gap: 0.35rem;

      .action-btn {
        inline-size: 2rem;
        block-size: 2rem;
        border-radius: 0.5rem;
        border: none;
        display: grid;
        place-items: center;
        background: rgba(255, 255, 255, 0.04);
        cursor: pointer;
        transition: all 160ms ease;

        mat-icon {
          font-size: 1.1rem;
          inline-size: 1.1rem;
          block-size: 1.1rem;
        }

        &.email-btn {
          color: #38bdf8;
          &:hover {
            background: rgba(56, 189, 248, 0.2);
          }
        }

        &.delete-btn {
          color: #ef4444;
          &:hover {
            background: rgba(239, 68, 68, 0.2);
          }
        }
      }
    }

    .path-badge {
      display: inline-block;
      padding: 0.15rem 0.45rem;
      border-radius: 0.4rem;
      background: rgba(255, 255, 255, 0.05);
      color: #93c5fd;
      font-family: monospace;
      font-size: 0.78rem;
    }

    .referrer-text {
      color: var(--text-secondary, #9ca3af);
      font-size: 0.78rem;
    }

    .count-pill {
      display: inline-block;
      padding: 0.15rem 0.5rem;
      border-radius: 999px;
      background: rgba(6, 182, 212, 0.12);
      color: var(--primary, #06b6d4);
      font-weight: 700;
      font-size: 0.75rem;
    }

    .ua-snippet {
      display: inline-block;
      max-inline-size: 16rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: #9ca3af;
      font-size: 0.75rem;
    }

    .version-tag {
      display: inline-block;
      padding: 0.15rem 0.45rem;
      border-radius: 0.35rem;
      background: rgba(16, 185, 129, 0.1);
      color: #34d399;
      font-weight: 700;
      font-size: 0.72rem;
    }

    /* APK CALLOUT */
    .apk-download-hero-card {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 1.25rem;
      padding: 1.5rem;
      border-radius: 1.25rem;
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(6, 182, 212, 0.05));
      border: 1px solid rgba(16, 185, 129, 0.25);
      margin-block-end: 1.5rem;

      .hero-apk-left {
        display: flex;
        align-items: center;
        gap: 1rem;

        .apk-icon-circle {
          inline-size: 3.25rem;
          block-size: 3.25rem;
          border-radius: 999px;
          background: rgba(16, 185, 129, 0.2);
          display: grid;
          place-items: center;
          color: #10b981;

          mat-icon {
            font-size: 1.8rem;
            inline-size: 1.8rem;
            block-size: 1.8rem;
          }
        }

        .hero-apk-details {
          h3 {
            margin: 0 0 0.25rem;
            font-size: 1.2rem;
            color: #ffffff;
            font-weight: 800;
          }

          p {
            margin: 0;
            color: var(--text-secondary, #9ca3af);
            font-size: 0.88rem;

            strong {
              color: #ffffff;
            }
          }
        }
      }

      .apk-test-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.65rem 1.25rem;
        border-radius: 999px;
        background: #10b981;
        color: #ffffff;
        font-weight: 700;
        font-size: 0.88rem;
        box-shadow: 0 8px 20px -4px rgba(16, 185, 129, 0.4);
        transition: all 180ms ease;

        &:hover {
          background: #059669;
          transform: translateY(-2px);
        }

        mat-icon {
          font-size: 1.15rem;
          inline-size: 1.15rem;
          block-size: 1.15rem;
        }
      }
    }

    .empty-state,
    .empty-cell {
      padding: 2.5rem 1rem;
      text-align: center;
      color: #6b7280;

      mat-icon {
        font-size: 2.5rem;
        inline-size: 2.5rem;
        block-size: 2.5rem;
        margin-block-end: 0.5rem;
        opacity: 0.5;
      }

      p {
        margin: 0;
        font-size: 0.9rem;
      }
    }

    .loading-state {
      padding: 4rem 1rem;
      text-align: center;
      display: grid;
      place-items: center;
      gap: 1rem;
      color: var(--text-secondary, #9ca3af);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminDashboardComponent implements OnInit {
  private readonly adminApi = inject(AdminApiService);
  private readonly auth = inject(AdminAuthService);

  readonly isLoading = signal(true);
  readonly activeTab = signal<'overview' | 'enquiries' | 'visitors' | 'downloads'>('overview');

  readonly stats = signal<DashboardStats | null>(null);
  readonly allEnquiries = signal<EnquiryItem[]>([]);
  readonly filteredEnquiries = signal<EnquiryItem[]>([]);
  readonly allVisitors = signal<VisitorItem[]>([]);
  readonly filteredVisitors = signal<VisitorItem[]>([]);
  readonly downloads = signal<DownloadItem[]>([]);

  enquirySearch = '';
  enquiryStatusFilter = 'all';
  visitorSearch = '';
  visitorSourceFilter = 'all';

  ngOnInit() {
    this.refreshAllData();
  }

  refreshAllData() {
    this.isLoading.set(true);

    this.adminApi.getStats().subscribe({
      next: (s) => this.stats.set(s),
      error: () => {}
    });

    this.adminApi.getEnquiries({ limit: 150 }).subscribe({
      next: (res) => {
        this.allEnquiries.set(res.items);
        this.filterEnquiries();
      },
      error: () => {}
    });

    this.adminApi.getVisitors({ limit: 150 }).subscribe({
      next: (res) => {
        this.allVisitors.set(res.items);
        this.filterVisitors();
      },
      error: () => {}
    });

    this.adminApi.getDownloads({ limit: 150 }).subscribe({
      next: (res) => {
        this.downloads.set(res.items);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  setTab(tab: 'overview' | 'enquiries' | 'visitors' | 'downloads') {
    this.activeTab.set(tab);
  }

  currentEmail(): string {
    return this.auth.currentUser()?.email || 'shubh-tech96@gmail.com';
  }

  dbStatus(): string {
    return this.stats()?.databaseStatus || 'Connecting...';
  }

  isMongoOnline(): boolean {
    return (this.stats()?.databaseStatus || '').includes('MongoDB');
  }

  calcPercentage(part: number, total: number | undefined): number {
    if (!total || total <= 0) return 100;
    return Math.min(100, Math.round((part / total) * 100));
  }

  formatTime(isoString: string): string {
    if (!isoString) return 'Just now';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoString;
    }
  }

  // Enquiries filtering
  setEnquiryFilter(status: string) {
    this.enquiryStatusFilter = status;
    this.filterEnquiries();
  }

  countByStatus(status: string): number {
    return this.allEnquiries().filter((e) => e.status === status).length;
  }

  filterEnquiries() {
    let list = this.allEnquiries();
    if (this.enquiryStatusFilter !== 'all') {
      list = list.filter((e) => e.status === this.enquiryStatusFilter);
    }
    if (this.enquirySearch.trim()) {
      const q = this.enquirySearch.toLowerCase();
      list = list.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.email.toLowerCase().includes(q) ||
          e.subject.toLowerCase().includes(q) ||
          e.message.toLowerCase().includes(q)
      );
    }
    this.filteredEnquiries.set(list);
  }

  onStatusChange(item: EnquiryItem, event: Event) {
    const newStatus = (event.target as HTMLSelectElement).value;
    this.adminApi.updateEnquiryStatus(item._id, newStatus).subscribe({
      next: () => {
        item.status = newStatus as any;
        this.filterEnquiries();
      }
    });
  }

  deleteEnquiry(id: string) {
    if (!confirm('Are you sure you want to remove this enquiry?')) return;
    this.adminApi.deleteEnquiry(id).subscribe({
      next: () => {
        this.allEnquiries.update((list) => list.filter((e) => e._id !== id));
        this.filterEnquiries();
      }
    });
  }

  // Visitors filtering
  setVisitorSourceFilter(source: string) {
    this.visitorSourceFilter = source;
    this.filterVisitors();
  }

  filterVisitors() {
    let list = this.allVisitors();
    if (this.visitorSourceFilter !== 'all') {
      list = list.filter((v) => v.source === this.visitorSourceFilter);
    }
    if (this.visitorSearch.trim()) {
      const q = this.visitorSearch.toLowerCase();
      list = list.filter(
        (v) =>
          v.ipAddress.toLowerCase().includes(q) ||
          v.country.toLowerCase().includes(q) ||
          v.city.toLowerCase().includes(q) ||
          v.browser.toLowerCase().includes(q) ||
          v.os.toLowerCase().includes(q)
      );
    }
    this.filteredVisitors.set(list);
  }

  logout() {
    this.auth.logout();
  }
}
