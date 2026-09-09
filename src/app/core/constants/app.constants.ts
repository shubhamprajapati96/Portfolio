import { NavigationItem, SocialLink } from '../interfaces/portfolio.interfaces';
import { ROUTE_PATHS } from './route.constants';

export const APP_CONFIG = {
  name: 'Shubham Prajapati',
  title: 'Full Stack Software Developer',
  email: 'prajapatishubham644@gmail.com',
  phone: '',
  location: 'Lucknow, India',
  canonicalUrl: 'https://shubhamprajapati.dev'
} as const;

export const NAVIGATION_ITEMS: NavigationItem[] = [
  { label: 'Home', path: `/${ROUTE_PATHS.home}`, icon: 'home' },
  { label: 'About', path: `/${ROUTE_PATHS.about}`, icon: 'person' },
  { label: 'Skills', path: `/${ROUTE_PATHS.skills}`, icon: 'psychology' },
  { label: 'Experience', path: `/${ROUTE_PATHS.experience}`, icon: 'timeline' },
  { label: 'Projects', path: `/${ROUTE_PATHS.projects}`, icon: 'work' },
  { label: 'Contact', path: `/${ROUTE_PATHS.contact}`, icon: 'mail' }
];

export const SOCIAL_LINKS: SocialLink[] = [
  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/shubham-prajapati-3a51a9160', icon: 'business_center' },
  { label: 'GitHub', url: 'https://github.com/shubham-prajapati', icon: 'code' },
  { label: 'Email', url: `mailto:${APP_CONFIG.email}`, icon: 'alternate_email' }
];

