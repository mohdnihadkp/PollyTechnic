import { ReactNode } from 'react';

export type ResourceType = 'pdf' | 'link';

export type Semester = 
  | 'Semester 1'
  | 'Semester 2'
  | '3rd Semester'
  | '4th Semester'
  | '5th Semester'
  | '6th Semester';

export interface Resource {
  id: string;
  title: string;
  type: ResourceType;
  url: string;
}

export interface ResourceCategory {
  id: string;
  title: string;
  type: 'collection' | 'direct_link';
  items?: Resource[];
  url?: string;
  description?: string;
}

export interface Subject {
  id: string;
  title: string;
  semester: Semester;
  description?: string;
  categories: ResourceCategory[];
  driveLink?: string;
  prerequisites?: string[]; // Optional array of Subject IDs
}

export interface VideoLecture {
  id: string;
  title: string;
  youtubeId: string;
  instructor: string;
  duration: string;
  semester: Semester;
  subjectId?: string;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  icon: ReactNode; 
  color: string;
  subjects: Subject[];
  videos: VideoLecture[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}

// Bookmark Interface
export interface BookmarkItem {
  id: string;
  type: 'subject' | 'video';
  title: string;
  subtitle: string; // Semester or Author
  data: Subject | VideoLecture; // Store full object for easy restoration
  deptId?: string; // Context for navigation
}

// Quiz Interfaces
export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number; // Index 0-3
  explanation?: string;
}

export interface Quiz {
  title: string;
  questions: QuizQuestion[];
}

// Scholarship Interface
export interface ScholarshipPost {
  id: string;
  title: string;
  provider: string;
  amount: string;
  deadline: string; // ISO format or text
  description: string;
  eligibility: string[];
  applicationLink: string;
  tags: string[]; // e.g., "Merit", "State Govt", "Girls Only"
  isNew?: boolean;
}