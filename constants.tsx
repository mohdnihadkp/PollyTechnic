import React from 'react';
import {
  Cpu,
  Zap,
  Wrench,
  HardHat,
  Beaker,
  Code,
  Activity,
  Radio,
  Car
} from 'lucide-react';
import { Department, Semester, Subject, VideoLecture, ScholarshipPost } from './types';

export const ADSENSE_CONFIG = {
  CLIENT_ID: 'ca-pub-1906693882573415',
  SLOT_ID: '8643247461'
};

export const SEMESTERS: Semester[] = [
  'Semester 1',
  'Semester 2',
  '3rd Semester',
  '4th Semester',
  '5th Semester',
  '6th Semester'
];

/**
 * --- INSTRUCTIONS FOR ADDING RESOURCES ---
 * 
 * 1. ADDING STUDY MATERIALS (Google Drive Links):
 *    - In the 'subjects' list for each department, paste your Google Drive folder link as the 5th argument.
 *    - Example: createSubject('id', 'Title', 'Semester', 'Description', 'PASTE_DRIVE_LINK_HERE')
 *    - If left as '', it will default to the main Google Drive homepage.
 * 
 * 2. ADDING VIDEO LECTURES:
 *    - In the 'videos' list for each department, add a new object.
 *    - Paste the YouTube Video ID (the part after v= in the URL) into the 'youtubeId' field.
 *    - Example: { id: 'v_1', title: 'Topic Name', youtubeId: 'dQw4w9WgXcQ', ... }
 */

// Helper to create consistent subject structure
const createSubject = (id: string, title: string, semester: Semester, description: string, driveLink: string = ''): Subject => {
  return {
    id,
    title,
    semester,
    description,
    // Use the provided link or default to generic Drive if empty
    driveLink: driveLink || 'https://drive.google.com/',
    categories: [] // Categories are empty as we link directly to Drive
  };
};

// --- SCHOLARSHIPS DATA (BLOGGING WINDOW CONTENT) ---
export const SCHOLARSHIPS: ScholarshipPost[] = [
  {
    id: 's_1',
    title: 'Pragati Scholarship Scheme',
    provider: 'AICTE',
    amount: '₹50,000 / year',
    deadline: '2025-10-31',
    description: 'A scholarship scheme implemented by AICTE aimed at providing assistance for advancement of Girls pursuing technical education.',
    eligibility: [
      'Maximum two girl children per family.',
      'Family income should be less than Rs. 8 Lakhs per annum.',
      'Admitted to 1st year of Diploma/Degree program.',
    ],
    applicationLink: 'https://scholarships.gov.in/',
    tags: ['Girls Only', 'Central Govt', 'Merit'],
    isNew: true,
  },
  {
    id: 's_2',
    title: 'Post Metric Scholarship (e-Grantz)',
    provider: 'Govt. of Kerala',
    amount: 'Full Fee Waiver + Stipend',
    deadline: 'Open Year Round',
    description: 'Financial assistance to students belonging to reserved categories (SC/ST/OBC/OEC) pursuing post-matriculation studies.',
    eligibility: [
      'Student must belong to SC/ST/OBC/OEC/SEBC categories.',
      'Attendance percentage constraints apply.',
      'Income limits apply for OBC/OEC categories.',
    ],
    applicationLink: 'https://www.egrantz.kerala.gov.in/',
    tags: ['State Govt', 'Reservation', 'Fee Waiver'],
  },
  {
    id: 's_3',
    title: 'Saksham Scholarship Scheme',
    provider: 'AICTE',
    amount: '₹50,000 / year',
    deadline: '2025-10-31',
    description: 'Scholarship for differently-abled students pursuing technical education.',
    eligibility: [
      'Student should have disability of not less than 40%.',
      'Family income should be less than Rs. 8 Lakhs per annum.',
      'Admitted to Diploma/Degree level institutions.',
    ],
    applicationLink: 'https://scholarships.gov.in/',
    tags: ['Differently Abled', 'Central Govt'],
  },
  {
    id: 's_4',
    title: 'Fisheries Scholarship',
    provider: 'Fisheries Department',
    amount: 'Variable Benefits',
    deadline: '2025-08-15',
    description: 'Educational concessions for children of registered fishermen.',
    eligibility: [
      'Parent must be a registered fisherman.',
      'Student must be pursuing recognized courses.',
    ],
    applicationLink: 'http://www.fisheries.kerala.gov.in/',
    tags: ['State Govt', 'Specific Sector'],
  }
];

// --- CLEARED VIDEO LISTS ---
// Add your specific videos in the Department objects below.
const SEM1_VIDEOS: VideoLecture[] = [];

// --- DEPARTMENTS ---

export const DEPARTMENTS: Department[] = [
  {
    id: 'ce',
    name: 'Computer Engineering',
    description: 'Software engineering, algorithms, system architecture, and programming.',
    icon: <Code className="w-8 h-8" />,
    color: 'bg-blue-500',
    subjects: [
      // --- SEMESTER 1 ---
      createSubject('ce_1001', 'Communication Skills in English', 'Semester 1', 'Theory - Code 1001', 'https://drive.google.com/drive/folders/1VkUjrZz3SiM_qQy3CxIelMnEGte0NE7R?usp=sharing'),
      createSubject('ce_1002', 'Mathematics I', 'Semester 1', 'Theory - Code 1002', ''),
      createSubject('ce_1003', 'Applied Physics I', 'Semester 1', 'Theory - Code 1003', ''),
      createSubject('ce_1004', 'Applied Chemistry', 'Semester 1', 'Theory - Code 1004', ''),
      createSubject('ce_1005', 'Engineering Graphics', 'Semester 1', 'Theory - Code 1005', ''),
      createSubject('ce_2006_s1', 'Applied Physics Lab', 'Semester 1', 'Practical - Code 2006', ''),
      createSubject('ce_1007', 'Applied Chemistry Lab', 'Semester 1', 'Practical - Code 1007', ''),
      createSubject('ce_1008', 'Introduction to IT systems Lab', 'Semester 1', 'Practical - Code 1008', ''),
      createSubject('ce_2009_s1', 'Engineering Workshop Practice', 'Semester 1', 'Practical - Code 2009', ''),
      createSubject('ce_1009', 'Sports and Yoga', 'Semester 1', 'Practical - Code 1009', ''),

      // --- SEMESTER 2 ---
      createSubject('ce_2002', 'Mathematics II', 'Semester 2', 'Theory - Code 2002', ''),
      createSubject('ce_2003', 'Applied Physics II', 'Semester 2', 'Theory - Code 2003', ''),
      createSubject('ce_2001', 'Environmental Science', 'Semester 2', 'Theory - Code 2001', ''),
      createSubject('ce_2031', 'Fundamentals of Electrical & Electronics Engineering', 'Semester 2', 'Theory - Code 2031', ''), // Placeholder exists
      createSubject('ce_2131', 'Problem Solving and Programming', 'Semester 2', 'Theory - Code 2131', ''),
      createSubject('ce_2008', 'Communication Skills in English Lab', 'Semester 2', 'Practical - Code 2008', ''),
      createSubject('ce_2006_s2', 'Applied Physics Lab', 'Semester 2', 'Practical - Code 2006', ''),
      createSubject('ce_2039', 'Fundamentals of Electrical & Electronics Engineering Lab', 'Semester 2', 'Practical - Code 2039', ''),
      createSubject('ce_2139', 'Problem Solving and Programming Lab', 'Semester 2', 'Practical - Code 2139', ''),
      createSubject('ce_2009_s2', 'Engineering Workshop Practice', 'Semester 2', 'Practical - Code 2009', ''),
      createSubject('ce_3009', 'Internship I', 'Semester 2', 'Practical - Code 3009', ''),

      // --- SEMESTER 3 ---
      createSubject('ce_3131', 'Computer Organisation', '3rd Semester', 'Theory - Code 3131', ''),
      createSubject('ce_3132', 'Programming in C', '3rd Semester', 'Theory - Code 3132', ''),
      createSubject('ce_3133', 'Database Management Systems', '3rd Semester', 'Theory - Code 3133', ''),
      createSubject('ce_3134', 'Digital Computer Fundamentals', '3rd Semester', 'Theory - Code 3134', ''),
      createSubject('ce_3135', 'Programming in C Lab', '3rd Semester', 'Practical - Code 3135', ''),
      createSubject('ce_3136', 'Database Management System Lab', '3rd Semester', 'Practical - Code 3136', ''),
      createSubject('ce_3137', 'Digital Computer Fundamentals Lab', '3rd Semester', 'Practical - Code 3137', ''),
      createSubject('ce_3138', 'Web Technology Lab', '3rd Semester', 'Practical - Code 3138', ''),
      createSubject('ce_3139', 'Computer System Hardware Lab', '3rd Semester', 'Practical - Code 3139', ''),

      // --- SEMESTER 4 ---
      createSubject('ce_4131', 'Object Oriented Programming', '4th Semester', 'Theory - Code 4131', ''),
      createSubject('ce_4132', 'Computer Communication and Networks', '4th Semester', 'Theory - Code 4132', ''),
      createSubject('ce_4133', 'Data Structures', '4th Semester', 'Theory - Code 4133', ''),
      createSubject('ce_4001', 'Community Skills in Indian knowledge system', '4th Semester', 'Theory - Code 4001', ''),
      createSubject('ce_4136', 'Object Oriented Programming Lab', '4th Semester', 'Practical - Code 4136', ''),
      createSubject('ce_4137', 'Web Programming Lab', '4th Semester', 'Practical - Code 4137', ''),
      createSubject('ce_4138', 'Data Structures Lab', '4th Semester', 'Practical - Code 4138', ''),
      createSubject('ce_4139', 'Application Development Lab', '4th Semester', 'Practical - Code 4139', ''),
      createSubject('ce_4006', 'Minor Project', '4th Semester', 'Practical - Code 4006', ''),
      createSubject('ce_5009_intern', 'Internship II', '4th Semester', 'Practical - Code 5009', ''),

      // --- SEMESTER 5 ---
      createSubject('ce_5002', 'Project Management and Software Engineering', '5th Semester', 'Theory - Code 5002', ''),
      createSubject('ce_5131', 'Embedded System and Real time Operating System', '5th Semester', 'Theory - Code 5131', ''),
      createSubject('ce_5132', 'Operating System', '5th Semester', 'Theory - Code 5132', ''),
      createSubject('ce_5133A', 'Virtualisation Technology and Cloud Computing', '5th Semester', 'Theory - Code 5133A', ''),
      createSubject('ce_5133B', 'Ethical Hacking', '5th Semester', 'Theory - Code 5133B', ''),
      createSubject('ce_5133C', 'Fundamentals of Artificial Intelligence and Machine Learning', '5th Semester', 'Theory - Code 5133C', ''),
      createSubject('ce_5137', 'Embedded Systems and Real Time Operating System Lab', '5th Semester', 'Practical - Code 5137', ''),
      createSubject('ce_5138', 'System Administration Lab', '5th Semester', 'Practical - Code 5138', ''),
      createSubject('ce_5139A', 'Virtualisation Technology and cloud computing Lab', '5th Semester', 'Practical - Code 5139A', ''),
      createSubject('ce_5133B_lab', 'Ethical Hacking Lab', '5th Semester', 'Practical - Code 5133B', ''),
      createSubject('ce_5139C', 'Fundamentals of Artificial Intelligence and Machine Learning Lab', '5th Semester', 'Practical - Code 5139C', ''),
      createSubject('ce_5008', 'Seminar', '5th Semester', 'Practical - Code 5008', ''),
      createSubject('ce_6009_s5', 'Major Project', '5th Semester', 'Practical - Code 6009', ''),

      // --- SEMESTER 6 ---
      createSubject('ce_6001', 'Entrepreneurship and Startup', '6th Semester', 'Theory - Code 6001', ''),
      createSubject('ce_6131A', 'Internet of Things', '6th Semester', 'Theory - Code 6131A', ''),
      createSubject('ce_6131B', 'Server Administration', '6th Semester', 'Theory - Code 6131B', ''),
      createSubject('ce_6131C', 'Software Testing', '6th Semester', 'Theory - Code 6131C', ''),
      createSubject('ce_6131D', 'Introduction to 5G', '6th Semester', 'Theory - Code 6131D', ''),
      createSubject('ce_6132A', 'Introduction to IoT', '6th Semester', 'Theory - Code 6132A', ''),
      createSubject('ce_6132B', 'Fundamentals of Web Technology', '6th Semester', 'Theory - Code 6132B', ''),
      createSubject('ce_6132C', 'Multimedia', '6th Semester', 'Theory - Code 6132C', ''),
      createSubject('ce_6132D', 'Cloud Computing', '6th Semester', 'Theory - Code 6132D', ''),
      createSubject('ce_6002', 'Indian Constitution', '6th Semester', 'Theory - Code 6002', ''),
      createSubject('ce_6137', 'Computer Network Engineering Lab', '6th Semester', 'Practical - Code 6137', ''),
      createSubject('ce_6138', 'Smart Device Programming Lab', '6th Semester', 'Practical - Code 6138', ''),
      createSubject('ce_6139A', 'Internet of Things Lab', '6th Semester', 'Practical - Code 6139A', ''),
      createSubject('ce_6139B', 'Server Administration Lab', '6th Semester', 'Practical - Code 6139B', ''),
      createSubject('ce_6139C', 'Software Testing Lab', '6th Semester', 'Practical - Code 6139C', ''),
      createSubject('ce_6009_s6', 'Major Project', '6th Semester', 'Practical - Code 6009', ''),
      createSubject('ce_6007', 'Internship', '6th Semester', 'Practical - Code 6007', ''),
    ],
    videos: [
      ...SEM1_VIDEOS,
      { id: 'v_ce_math1_pl', title: 'Mathematics I (Playlist)', youtubeId: 'PL_lLjt3U0IrogQSJOuRaaf0wxGXJJGqJj', instructor: 'Various', duration: 'Playlist', semester: 'Semester 1', subjectId: 'ce_1002' },
      // PASTE VIDEO OBJECTS BELOW
      { id: 'v_ce1', title: 'Introduction to Computer Organization', youtubeId: 'CDqg67L4980', instructor: 'Neso Academy', duration: '15:00', semester: '3rd Semester', subjectId: 'ce_3131' },
      { id: 'v_ce2', title: 'React JS Crash Course', youtubeId: 'w7ejDZ8SWv8', instructor: 'Traversy Media', duration: '1:54:00', semester: '6th Semester', subjectId: 'ce_6132B' },
      { id: 'v_ce3', title: 'OS Concepts: Deadlocks', youtubeId: 'rN6gZM3rP6I', instructor: 'Gate Smashers', duration: '20:00', semester: '5th Semester', subjectId: 'ce_5132' },
    ]
  },
  {
    id: 'che',
    name: 'Computer Hardware Eng.',
    description: 'Design, development, and testing of computer systems and components.',
    icon: <Cpu className="w-8 h-8" />,
    color: 'bg-indigo-500',
    subjects: [
      createSubject('che_1001', 'Communication Skills in English', 'Semester 1', 'Theory - Code 1001', ''),
      createSubject('che_1002', 'Mathematics I', 'Semester 1', 'Theory - Code 1002'),
      createSubject('che_1003', 'Applied Physics I', 'Semester 1', 'Theory - Code 1003'),
      createSubject('che_1004', 'Applied Chemistry', 'Semester 1', 'Theory - Code 1004'),
      createSubject('che_1005', 'Engineering Graphics', 'Semester 1', 'Theory - Code 1005'),
      createSubject('che_2006_s1', 'Applied Physics Lab', 'Semester 1', 'Practical - Code 2006'),
      createSubject('che_1007', 'Applied Chemistry Lab', 'Semester 1', 'Practical - Code 1007'),
      createSubject('che_1008', 'Introduction to IT systems Lab', 'Semester 1', 'Practical - Code 1008'),
      createSubject('che_2009_s1', 'Engineering Workshop Practice', 'Semester 1', 'Practical - Code 2009'),
      createSubject('che_1009', 'Sports and Yoga', 'Semester 1', 'Practical - Code 1009'),
      createSubject('che_2002', 'Mathematics II', 'Semester 2', 'Theory - Code 2002'),
      createSubject('che_5151', 'Internet of Things', '5th Semester', 'Theory - Code 5151'),
      createSubject('che_6001', 'Entrepreneurship and Startup', '6th Semester', 'Theory - Code 6001'),
    ],
    videos: [
      ...SEM1_VIDEOS,
      { id: 'v_che1', title: 'How a CPU is made', youtubeId: 'qm67wbB5GmI', instructor: 'GlobalFoundries', duration: '12:00', semester: '3rd Semester', subjectId: 'che_3151' },
      { id: 'v_che2', title: 'Computer Architecture Basics', youtubeId: '4TzMyXmzL8M', instructor: 'Carnegie Mellon', duration: '1:15:00', semester: '4th Semester', subjectId: 'che_4152' },
    ]
  },
  {
    id: 'bme',
    name: 'Biomedical Eng.',
    description: 'Intersection of engineering principles and medical sciences.',
    icon: <Activity className="w-8 h-8" />,
    color: 'bg-rose-500',
    subjects: [
      createSubject('bme_1001', 'Communication Skills in English', 'Semester 1', 'Theory - Code 1001'),
      createSubject('bme_5241', 'Medical Imaging Techniques', '5th Semester', 'Theory - Code 5241'),
    ],
    videos: [
      ...SEM1_VIDEOS,
      { id: 'v_bme1', title: 'What is Biomedical Engineering?', youtubeId: '08b7eK1aN1o', instructor: 'U of T', duration: '8:45', semester: '3rd Semester', subjectId: 'bme_3242' },
      { id: 'v_bme2', title: 'MRI Physics Explained', youtubeId: '1qFjN-Wk1KE', instructor: 'Real Engineering', duration: '15:30', semester: '5th Semester', subjectId: 'bme_5241' },
    ]
  },
  {
    id: 'eee',
    name: 'Electrical & Electronics',
    description: 'Power generation, electrical systems, and machinery control.',
    icon: <Zap className="w-8 h-8" />,
    color: 'bg-yellow-500',
    subjects: [
      // --- SEMESTER 1 ---
      createSubject('eee_1001', 'Communication Skills in English', 'Semester 1', 'Theory - Code 1001'),

      // --- SEMESTER 2 ---
      // Placeholders added as requested
      createSubject('eee_2001', 'Communication Skills in English Lab', 'Semester 2', 'Practical', ''),
      createSubject('eee_2002', 'Applied Physics Lab', 'Semester 2', 'Practical', ''),
      createSubject('eee_2003', 'Fundamentals of Electrical & Electronics Engineering Lab', 'Semester 2', 'Practical', ''),
      createSubject('eee_2004', 'Engineering Graphics using CAD software', 'Semester 2', 'Practical', ''),
      createSubject('eee_2005', 'Engineering Workshop Practice', 'Semester 2', 'Practical', ''),

      createSubject('eee_3033', 'Fundamentals of Electric Circuits', '3rd Semester', 'Theory - Code 3033'),
    ],
    videos: [
      ...SEM1_VIDEOS,
      { id: 'v_eee1', title: 'Kirchhoff\'s Laws', youtubeId: '8jB4u8j-yJE', instructor: 'Organic Chem Tutor', duration: '15:30', semester: '3rd Semester', subjectId: 'eee_3033' },
      { id: 'v_eee2', title: 'How Electric Motors Work', youtubeId: 'CWulQ1ZSE3c', instructor: 'Jared Owen', duration: '10:00', semester: '4th Semester', subjectId: 'eee_4033' },
    ]
  },
  {
    id: 'ece',
    name: 'Electronics Eng.',
    description: 'Electronic circuits, devices, telecommunications, and signal processing.',
    icon: <Radio className="w-8 h-8" />,
    color: 'bg-fuchsia-500',
    subjects: [
      createSubject('ece_1001', 'Communication Skills in English', 'Semester 1', 'Theory - Code 1001'),
      createSubject('ece_2041', 'Basic Electronics', 'Semester 2', 'Theory - Code 2041'),
    ],
    videos: [
      ...SEM1_VIDEOS,
      { id: 'v_ece1', title: 'Transistors Explained', youtubeId: '7ukDKVHnac4', instructor: 'Real Engineering', duration: '12:00', semester: '3rd Semester', subjectId: 'ece_3043' },
      { id: 'v_ece2', title: 'Basic Electronics', youtubeId: 'uOfc24j0260', instructor: 'Neso Academy', duration: '20:00', semester: 'Semester 2', subjectId: 'ece_2041' },
    ]
  },
  {
    id: 'civil',
    name: 'Civil Engineering',
    description: 'Design, construction, and maintenance of the physical and built environment.',
    icon: <HardHat className="w-8 h-8" />,
    color: 'bg-stone-500',
    subjects: [
      createSubject('civ_1001', 'Communication Skills in English', 'Semester 1', 'Theory - Code 1001'),
      createSubject('civ_3012', 'Concrete Technology', '3rd Semester', 'Theory - Code 3012'),
    ],
    videos: [
      ...SEM1_VIDEOS,
      { id: 'v_civ1', title: 'How bridges are built', youtubeId: 'n5X2p6m4N40', instructor: 'Practical Engineering', duration: '10:00', semester: '4th Semester', subjectId: 'civ_2' },
    ]
  },
  {
    id: 'mech',
    name: 'Mechanical Eng.',
    description: 'Mechanics, dynamics, thermodynamics, and manufacturing systems.',
    icon: <Wrench className="w-8 h-8" />,
    color: 'bg-orange-500',
    subjects: [
      createSubject('mech_1001', 'Communication Skills in English', 'Semester 1', 'Theory - Code 1001'),
      createSubject('mech_4021', 'Thermal Engineering', '4th Semester', 'Theory - Code 4021'),
    ],
    videos: [
      ...SEM1_VIDEOS,
      { id: 'v_mech1', title: 'Fluid Mechanics Introduction', youtubeId: 'clVwTr4lE4Q', instructor: 'Efficient Engineer', duration: '12:00', semester: '4th Semester' },
      { id: 'v_mech2', title: 'Mechanical Gears Explained', youtubeId: 'odW78dqFwY4', instructor: 'Learn Engineering', duration: '8:20', semester: '3rd Semester' },
    ]
  },
  {
    id: 'auto',
    name: 'Automobile Eng.',
    description: 'Vehicle engineering, including mechanical, electrical, and safety aspects.',
    icon: <Car className="w-8 h-8" />,
    color: 'bg-red-500',
    subjects: [
      createSubject('auto_1001', 'Communication Skills in English', 'Semester 1', 'Theory - Code 1001'),
      createSubject('auto_3054', 'Internal Combustion Engines', '3rd Semester', 'Theory - Code 3054'),
    ],
    videos: [
      ...SEM1_VIDEOS,
      { id: 'v_auto1', title: 'How a Car Engine Works', youtubeId: 'DKF5dKo_r_0', instructor: 'Animagraffs', duration: '14:00', semester: '3rd Semester', subjectId: 'auto_3054' },
      { id: 'v_auto2', title: 'Electric Vehicle Basics', youtubeId: '3SAxXUIre28', instructor: 'Engineering Explained', duration: '16:00', semester: '6th Semester', subjectId: 'auto_6051A' },
    ]
  }
];