// Article Templates
export type ArticleTemplate =
  | 'STANDARD'
  | 'GALLERY'
  | 'VIDEO'
  | 'QUOTE'
  | 'LINK'
  | 'INTERVIEW'
  | 'REVIEW'
  | 'TUTORIAL'
  | 'CASE_STUDY'
  | 'NEWS';

export const ARTICLE_TEMPLATES: Array<{ value: ArticleTemplate; label: string; description: string }> = [
  { value: 'STANDARD', label: 'Standard', description: 'Article classique avec texte et images' },
  { value: 'GALLERY', label: 'Galerie', description: 'Galerie d\'images avec captions' },
  { value: 'VIDEO', label: 'Vidéo', description: 'Article avec vidéo intégrée' },
  { value: 'QUOTE', label: 'Citation', description: 'Citation mise en avant avec auteur' },
  { value: 'LINK', label: 'Lien', description: 'Partage de lien externe' },
  { value: 'INTERVIEW', label: 'Interview', description: 'Format questions/réponses' },
  { value: 'REVIEW', label: 'Critique', description: 'Revue avec notation' },
  { value: 'TUTORIAL', label: 'Tutoriel', description: 'Guide étape par étape' },
  { value: 'CASE_STUDY', label: 'Étude de cas', description: 'Analyse de cas client' },
  { value: 'NEWS', label: 'Actualité', description: 'Article d\'actualité' },
];

// Event Templates
export type EventTemplate =
  | 'CONFERENCE'
  | 'WORKSHOP'
  | 'WEBINAR'
  | 'NETWORKING'
  | 'CONCERT'
  | 'EXHIBITION'
  | 'FESTIVAL'
  | 'CEREMONY'
  | 'COMPETITION'
  | 'MEETUP';

export const EVENT_TEMPLATES: Array<{ value: EventTemplate; label: string; description: string }> = [
  { value: 'CONFERENCE', label: 'Conférence', description: 'Conférence avec speakers' },
  { value: 'WORKSHOP', label: 'Atelier', description: 'Atelier pratique' },
  { value: 'WEBINAR', label: 'Webinaire', description: 'Séminaire en ligne' },
  { value: 'NETWORKING', label: 'Networking', description: 'Événement de réseautage' },
  { value: 'CONCERT', label: 'Concert', description: 'Concert ou spectacle' },
  { value: 'EXHIBITION', label: 'Exposition', description: 'Exposition artistique' },
  { value: 'FESTIVAL', label: 'Festival', description: 'Festival multi-activités' },
  { value: 'CEREMONY', label: 'Cérémonie', description: 'Cérémonie officielle' },
  { value: 'COMPETITION', label: 'Compétition', description: 'Compétition ou concours' },
  { value: 'MEETUP', label: 'Meetup', description: 'Rencontre communautaire' },
];

// Template Data Interfaces
export interface GalleryData {
  images: Array<{ url: string; caption: string }>;
}

export interface VideoData {
  videoUrl: string;
  embedCode?: string;
  provider?: 'youtube' | 'vimeo' | 'other';
}

export interface QuoteData {
  quote: string;
  author: string;
  source?: string;
  authorTitle?: string;
}

export interface LinkData {
  linkUrl: string;
  linkTitle: string;
  description: string;
}

export interface InterviewData {
  interviewee: string;
  intervieweeTitle: string;
  questions: Array<{ question: string; answer: string }>;
}

export interface ReviewData {
  rating: number;
  maxRating: number;
  pros: string[];
  cons: string[];
  verdict: string;
}

export interface TutorialData {
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  requirements: string[];
  steps: Array<{ title: string; content: string; image?: string }>;
}

export interface CaseStudyData {
  client: string;
  industry: string;
  problem: string;
  solution: string;
  results: string[];
  metrics: Array<{ label: string; value: string }>;
}

export interface NewsData {
  source: string;
  eventDate: string;
  location?: string;
}

export interface ConferenceData {
  speakers: Array<{ name: string; title: string; bio: string; photo?: string }>;
  agenda: Array<{ time: string; title: string; speaker: string }>;
  tracks?: string[];
}

export interface WorkshopData {
  instructor: string;
  instructorBio: string;
  materials: string[];
  maxParticipants?: number;
}

export interface WebinarData {
  platform: string;
  meetingLink: string;
  replayAvailable: boolean;
  replayLink?: string;
}

export interface NetworkingData {
  format: string;
  targetAudience: string;
  industries: string[];
}

export interface ConcertData {
  artists: Array<{ name: string; genre: string; performanceTime: string }>;
  venue: string;
  lineup: string;
}

export interface ExhibitionData {
  artists: string[];
  artworks: Array<{ title: string; artist: string; description: string }>;
  curator?: string;
}

export interface FestivalData {
  days: number;
  program: Array<{ day: string; activities: string[] }>;
  partners: string[];
}

export interface CeremonyData {
  protocol: string;
  dressCode: string;
  guestOfHonor?: string;
}

export interface CompetitionData {
  rules: string;
  prizes: Array<{ rank: string; prize: string }>;
  jury: string[];
  registrationDeadline: string;
}

export interface MeetupData {
  theme: string;
  sponsors: string[];
  targetSize: number;
}
