import { DOCUMENT } from '@angular/common';
import { inject, Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ScrollService {
  private readonly document = inject(DOCUMENT);
  readonly showScrollTop = signal(false);
  readonly activeSection = signal<string>('home');

  watch(): void {
    const rawScroll = this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;
    const scrollTop = Math.max(0, rawScroll);
    this.showScrollTop.set(scrollTop > 480);

    // Track active section for scrollspy
    const sections = ['contact', 'projects', 'skills', 'qualifications', 'experience', 'about', 'home'];
    const scrollPos = scrollTop + 160;

    for (const id of sections) {
      const el = this.document.getElementById(id);
      if (el) {
        const top = el.offsetTop;
        const height = el.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          this.activeSection.set(id);
          break;
        }
      }
    }
  }

  scrollToSection(sectionId: string): void {
    const element = this.document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      this.activeSection.set(sectionId);
      if (typeof window !== 'undefined' && window.history) {
        window.history.replaceState(null, '', `#${sectionId}`);
      }
    } else {
      this.scrollToTop();
    }
  }

  scrollToTop(): void {
    this.document.defaultView?.scrollTo({ top: 0, behavior: 'smooth' });
    this.activeSection.set('home');
  }
}

