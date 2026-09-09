export const ROUTE_PATHS = {
  home: '',
  about: 'about',
  skills: 'skills',
  experience: 'experience',
  projects: 'projects',
  certifications: 'certifications',
  achievements: 'achievements',
  services: 'services',
  testimonials: 'testimonials',
  contact: 'contact',
  notFound: '**'
} as const;

export type AppRoutePath = (typeof ROUTE_PATHS)[keyof typeof ROUTE_PATHS];
