export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
}

export interface BoardMember {
  id: string;
  name: string;
  title: string;
  image: string;
  bio?: string;
  email?: string;
  /** Shows this member under "Leadership" on the Board page. When unset,
   *  falls back to matching a known set of leadership titles for
   *  backward compatibility with existing content. */
  isLeadership?: boolean;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  image: string;
  icon: string;
  features?: string[];
  tag?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
  date: string;
  author: string;
  readTime?: string;
  featured?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  image: string;
  rating: number;
}

export interface Stat {
  id: string;
  value: number;
  suffix: string;
  label: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface TimelineItem {
  id: string;
  year: string;
  title: string;
  description: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
  hours: string;
  instagram: string;
  facebook: string;
  google: string;
  address?: string;
}

export interface SiteContent {
  theme: ThemeColors;
  siteName: string;
  tagline: string;
  home: {
    heroHeadline: string;
    heroSubheadline: string;
    missionStatement: string;
    heroImage: string;
    lifeCoachName: string;
    lifeCoachTitle: string;
    lifeCoachBio: string;
    lifeCoachImage: string;
    heroBadge?: string;
  };
  about: {
    title: string;
    missionTitle: string;
    missionText: string;
    overviewTitle: string;
    overviewText: string;
    image: string;
    values?: { title: string; description: string; icon: string }[];
  };
  services: {
    title: string;
    subtitle: string;
    pricingNote: string;
    items: Service[];
  };
  specialOffers: {
    title: string;
    subtitle: string;
    description: string;
    formTitle: string;
    formDescription: string;
  };
  blog: {
    title: string;
    subtitle: string;
    posts: BlogPost[];
  };
  contact: ContactInfo;
  boardMembers: BoardMember[];
  testimonials: Testimonial[];
  stats: Stat[];
  faqs: FAQ[];
  timeline: TimelineItem[];
}
