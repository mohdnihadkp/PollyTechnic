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