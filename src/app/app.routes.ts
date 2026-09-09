import { Routes } from '@angular/router';
import { ROUTE_PATHS } from './core/constants/route.constants';
import { MainLayoutComponent } from './core/layouts/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: ROUTE_PATHS.home,
        title: 'Shubham Prajapati | Software Developer',
        loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent)
      },
      {
        path: ROUTE_PATHS.about,
        title: 'About | Shubham Prajapati',
        loadComponent: () => import('./features/about/about.component').then((m) => m.AboutComponent)
      },
      {
        path: ROUTE_PATHS.skills,
        title: 'Skills | Shubham Prajapati',
        loadComponent: () => import('./features/skills/skills.component').then((m) => m.SkillsComponent)
      },
      {
        path: ROUTE_PATHS.experience,
        title: 'Experience | Shubham Prajapati',
        loadComponent: () =>
          import('./features/experience/experience.component').then((m) => m.ExperienceComponent)
      },
      {
        path: `${ROUTE_PATHS.projects}/:id`,
        title: 'Project Details | Shubham Prajapati',
        loadComponent: () =>
          import('./features/projects/project-detail/project-detail.component').then(
            (m) => m.ProjectDetailComponent
          )
      },
      {
        path: ROUTE_PATHS.projects,
        title: 'Projects | Shubham Prajapati',
        loadComponent: () =>
          import('./features/projects/projects.component').then((m) => m.ProjectsComponent)
      },
      {
        path: ROUTE_PATHS.certifications,
        title: 'Certifications | Shubham Prajapati',
        loadComponent: () =>
          import('./features/certifications/certifications.component').then(
            (m) => m.CertificationsComponent
          )
      },
      {
        path: ROUTE_PATHS.achievements,
        title: 'Achievements | Shubham Prajapati',
        loadComponent: () =>
          import('./features/achievements/achievements.component').then(
            (m) => m.AchievementsComponent
          )
      },
      {
        path: ROUTE_PATHS.services,
        title: 'Services | Shubham Prajapati',
        loadComponent: () =>
          import('./features/services/services.component').then((m) => m.ServicesComponent)
      },
      {
        path: ROUTE_PATHS.testimonials,
        title: 'Testimonials | Shubham Prajapati',
        loadComponent: () =>
          import('./features/testimonials/testimonials.component').then(
            (m) => m.TestimonialsComponent
          )
      },
      {
        path: ROUTE_PATHS.contact,
        title: 'Contact | Shubham Prajapati',
        loadComponent: () =>
          import('./features/contact/contact.component').then((m) => m.ContactComponent)
      },
      {
        path: ROUTE_PATHS.notFound,
        title: '404 Not Found | Shubham Prajapati',
        loadComponent: () =>
          import('./features/not-found/not-found.component').then((m) => m.NotFoundComponent)
      }
    ]
  }
];
