import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PortfolioService } from '@core/services/portfolio.service';
import { SeoService } from '@core/services/seo.service';
import { staggerCards } from '@shared/animations/page.animations';
import { CertificateCardComponent } from '@shared/components/certificate-card/certificate-card.component';
import { SectionHeaderComponent } from '@shared/components/section-header/section-header.component';

@Component({
  selector: 'app-certifications',
  imports: [CertificateCardComponent, SectionHeaderComponent],
  template: `
    <section class="section certifications-page">
      <div class="container">
        <app-section-header
          eyebrow="Verified Credentials"
          title="Credentials that support practical engineering excellence."
          description="Full-stack engineering, microservices architecture, and enterprise application development credentials."
        />
        <div class="grid-auto certifications-grid" @staggerCards>
          @for (certification of certifications(); track certification.title) {
            <app-certificate-card class="stagger-item" [certification]="certification" />
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    .certifications-page {
      position: relative;
    }

    .certifications-grid {
      align-items: stretch;
    }
  `,
  animations: [staggerCards],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CertificationsComponent {
  private readonly portfolio = inject(PortfolioService);
  private readonly seo = inject(SeoService);
  readonly certifications = this.portfolio.certifications;

  constructor() {
    this.seo.update({
      title: 'Certifications | Shubham Prajapati',
      description: 'PHP, Laravel, Microservices, and Full Stack Engineering certifications.'
    });
  }
}

