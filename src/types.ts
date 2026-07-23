export interface Place {
  id: string;
  name: string;
  category: string;
  time: string;
  description: string;
  image: string;
  address: string;
  link?: string;
}

export interface TravelCourse {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  thumbnail: string;
  region: string;
  duration: string;
  theme: string;
  likes: number;
  views: number;
  author: string;
  createdAt: string;
  layout: 'timeline' | 'gallery';
  places: Place[];
  seoTitle: string;
  seoDesc: string;
  seoKeywords: string;
}

export interface CourseProposal {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  region: string;
  duration: string;
  theme: string;
  author: string;
  contact: string;
  places: Place[];
  createdAt: string;
  status: 'pending' | 'reviewed' | 'approved' | 'rejected';
}

export interface WebsiteSettings {
  themeColor: 'navy' | 'gold' | 'charcoal' | 'forest' | 'wine';
  fontStyle: 'serif' | 'sans' | 'mono';
  logoText: string;
  heroTitle: string;
  heroSubtitle: string;
  heroBanner: string;
  aboutCircleImage: string;
  approachImage1?: string;
  approachImage2?: string;
  approachImage3?: string;
}
