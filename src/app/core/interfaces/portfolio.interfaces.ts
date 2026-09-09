export interface NavigationItem {
  readonly label: string;
  readonly path: string;
  readonly icon: string;
}

export interface SocialLink {
  readonly label: string;
  readonly url: string;
  readonly icon: string;
}

export interface PersonProfile {
  readonly name: string;
  readonly title: string;
  readonly intro: string;
  readonly summary: string;
  readonly email: string;
  readonly phone?: string;
  readonly location: string;
  readonly availability: string;
  readonly resumeUrl: string;
  readonly imageUrl: string;
}

export interface Metric {
  readonly label: string;
  readonly value: string;
}

export interface Skill {
  readonly name: string;
  readonly icon: string;
  readonly level: number;
}

export interface SkillCategory {
  readonly name: string;
  readonly icon: string;
  readonly skills: Skill[];
}

export interface Experience {
  readonly company: string;
  readonly position: string;
  readonly duration: string;
  readonly location: string;
  readonly responsibilities: readonly string[];
  readonly technologies: readonly string[];
}

export interface Education {
  readonly school: string;
  readonly degree: string;
  readonly duration: string;
  readonly summary: string;
}

export interface Project {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly imageUrl: string;
  readonly technologies: readonly string[];
  readonly githubUrl: string;
  readonly liveUrl: string;
  readonly detailsUrl: string;
}

export interface Certification {
  readonly title: string;
  readonly issuer: string;
  readonly date: string;
  readonly credentialUrl: string;
}

export interface Achievement {
  readonly title: string;
  readonly date: string;
  readonly description: string;
}

export interface ServiceOffering {
  readonly title: string;
  readonly icon: string;
  readonly description: string;
}

export interface Testimonial {
  readonly name: string;
  readonly role: string;
  readonly quote: string;
  readonly avatarUrl: string;
}

export interface ContactRequest {
  readonly name: string;
  readonly email: string;
  readonly subject: string;
  readonly message: string;
}

export interface PortfolioData {
  readonly profile: PersonProfile;
  readonly metrics: readonly Metric[];
  readonly skills: readonly SkillCategory[];
  readonly experiences: readonly Experience[];
  readonly education: readonly Education[];
  readonly projects: readonly Project[];
  readonly certifications: readonly Certification[];
  readonly achievements: readonly Achievement[];
  readonly services: readonly ServiceOffering[];
  readonly testimonials: readonly Testimonial[];
}
