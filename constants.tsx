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
import { Department, Semester, Subject, VideoLecture } from './types';

export const SEMESTERS: Semester[] = [
  'Semester 1',
  'Semester 2',
  '3rd Semester',
  '4th Semester',
  '5th Semester',
  '6th Semester'
];

// Helper to create consistent subject structure
const createSubject = (id: string, title: string, semester: Semester, description: string, driveLink: string = 'https://drive.google.com/'): Subject => {
  return {
    id,
    title,
    semester,
    description,
    driveLink,
    categories: [] // Categories are empty as we link directly to Drive
  };
};

// --- SEMESTER 1 DATA (Common for all) ---
const SEM1_SUBJECTS: Subject[] = [
  createSubject('sem1_eng', 'Communication Skills in English', 'Semester 1', 'Grammar, Vocabulary, and Speaking Skills.'),
  createSubject('sem1_math', 'Mathematics I', 'Semester 1', 'Algebra, Determinants, and Matrices.'),
  createSubject('sem1_phy', 'Applied Physics I', 'Semester 1', 'Units, Mechanics, and Properties of Matter.'),
  createSubject('sem1_chem', 'Applied Chemistry I', 'Semester 1', 'Atomic Structure, Chemical Bonding, and Water Technology.'),
  createSubject('sem1_it', 'Introduction to IT System Lab', 'Semester 1', 'Basics of Hardware, OS, and Networking.'),
];

// --- SEMESTER 2 SUBJECT DEFINITIONS ---

// Common Subjects
const SEM2_MATH = createSubject('sem2_math', 'Mathematics II', 'Semester 2', 'Calculus, Vectors, and Complex Numbers.');
const SEM2_PHY = createSubject('sem2_phy', 'Applied Physics II', 'Semester 2', 'Wave Motion, Optics, and Modern Physics.');
const SEM2_ENV = createSubject('sem2_env', 'Environmental Science', 'Semester 2', 'Ecosystems, Biodiversity, and Pollution.');

// Specific Subjects
const SEM2_FEEE = createSubject('sem2_feee', 'Fundamental of Electrical and Electronics Engineering', 'Semester 2', 'AC Circuits, Transformers, and Semiconductors.');
const SEM2_BASIC_ELEC = createSubject('sem2_basic_elec', 'Basics Electronics', 'Semester 2', 'Diodes, Transistors, and Logic Gates.');
const SEM2_ENG_MECH = createSubject('sem2_eng_mech', 'Engineering Mechanics', 'Semester 2', 'Forces, Friction, and Kinematics.');
const SEM2_SURVEY = createSubject('sem2_survey', 'Basic Surveying', 'Semester 2', 'Measurement of land and elevations.');
const SEM2_MFG = createSubject('sem2_mfg', 'Manufacturing Technology', 'Semester 2', 'Casting, Welding, and Machining.');
const SEM2_AUTO_BASIC = createSubject('sem2_auto_basic', 'Basic Automobile Engineering', 'Semester 2', 'Automobile components and systems.');

// --- DEPARTMENT SPECIFIC LISTS FOR SEM 2 ---

// Computer Engineering: Using general engineering group for now or same as EEE if not specified, 
// but sticking to previous prompt's structure for consistency where it was just updated.
const SEM2_COMP_GROUP = [SEM2_MATH, SEM2_PHY, SEM2_ENV, SEM2_FEEE];

// BME: Math II, Phy II, Env, Fund EEE, Basic Elec
const SEM2_BME = [SEM2_MATH, SEM2_PHY, SEM2_ENV, SEM2_FEEE, SEM2_BASIC_ELEC];

// EEE: Math II, Phy II, Env, Fund EEE
const SEM2_EEE = [SEM2_MATH, SEM2_PHY, SEM2_ENV, SEM2_FEEE];

// ECE: Math II, Phy II, Env, Fund EEE, Basic Elec
const SEM2_ECE = [SEM2_MATH, SEM2_PHY, SEM2_ENV, SEM2_FEEE, SEM2_BASIC_ELEC];

// Civil: Math II, Phy II, Env, Eng Mech, Surveying
const SEM2_CIVIL = [SEM2_MATH, SEM2_PHY, SEM2_ENV, SEM2_ENG_MECH, SEM2_SURVEY];

// Mech: Math II, Phy II, Env, Eng Mech, Mfg Tech
const SEM2_MECH_LIST = [SEM2_MATH, SEM2_PHY, SEM2_ENV, SEM2_ENG_MECH, SEM2_MFG];

// Auto: Math II, Phy II, Env, Eng Mech, Basic Auto
const SEM2_AUTO_LIST = [SEM2_MATH, SEM2_PHY, SEM2_ENV, SEM2_ENG_MECH, SEM2_AUTO_BASIC];


// Cleared videos for Sem 1 & 2
const SEM1_VIDEOS: VideoLecture[] = [];
// Sem 2 videos are also empty by default as none are added to the lists below.

// --- DEPARTMENTS ---

export const DEPARTMENTS: Department[] = [
  {
    id: 'ce',
    name: 'Computer Engineering',
    description: 'Software engineering, algorithms, system architecture, and programming.',
    icon: <Code className="w-8 h-8" />,
    color: 'bg-blue-500',
    subjects: [
      ...SEM1_SUBJECTS,
      ...SEM2_COMP_GROUP,
      createSubject('ce_1', 'Data Structures & Algorithms', '3rd Semester', 'Trees, Graphs, and Sorting.'),
      createSubject('ce_2', 'Web Development', '5th Semester', 'Full-stack mastery.'),
      createSubject('ce_3', 'Operating Systems', '4th Semester', 'Process management and scheduling.'),
      createSubject('ce_4', 'Computer Networks', '4th Semester', 'OSI Model and TCP/IP.'),
      createSubject('ce_5', 'Project Work', '6th Semester', 'Final year implementation.'),
    ],
    videos: [
      ...SEM1_VIDEOS,
      { id: 'v_ce1', title: 'Introduction to Computer Science', youtubeId: 'zOjov-2OZ0E', instructor: 'Prof. David', duration: '50:00', semester: '3rd Semester', subjectId: 'ce_1' },
      { id: 'v_ce2', title: 'React JS Crash Course', youtubeId: 'w7ejDZ8SWv8', instructor: 'Traversy Media', duration: '1:54:00', semester: '5th Semester', subjectId: 'ce_2' },
      { id: 'v_ce3', title: 'OS Concepts: Deadlocks', youtubeId: 'rN6gZM3rP6I', instructor: 'Gate Smashers', duration: '20:00', semester: '4th Semester', subjectId: 'ce_3' },
    ]
  },
  {
    id: 'che',
    name: 'Comp. Hardware Eng.',
    description: 'Design, development, and testing of computer systems and components.',
    icon: <Cpu className="w-8 h-8" />,
    color: 'bg-indigo-500',
    subjects: [
      ...SEM1_SUBJECTS,
      ...SEM2_COMP_GROUP,
      createSubject('che_1', 'Digital Logic Design', '3rd Semester', 'Gates and Boolean Algebra.'),
      createSubject('che_2', 'Microprocessor Architecture', '4th Semester', '8085/8086 Architecture.'),
      createSubject('che_3', 'Embedded Systems', '5th Semester', 'Microcontrollers and IoT.'),
    ],
    videos: [
      ...SEM1_VIDEOS,
      { id: 'v_che1', title: 'How a CPU is made', youtubeId: 'qm67wbB5GmI', instructor: 'GlobalFoundries', duration: '12:00', semester: '3rd Semester', subjectId: 'che_1' },
      { id: 'v_che2', title: 'Computer Architecture Basics', youtubeId: '4TzMyXmzL8M', instructor: 'Carnegie Mellon', duration: '1:15:00', semester: '4th Semester', subjectId: 'che_2' },
    ]
  },
  {
    id: 'bme',
    name: 'Biomedical Eng.',
    description: 'Intersection of engineering principles and medical sciences.',
    icon: <Activity className="w-8 h-8" />,
    color: 'bg-rose-500',
    subjects: [
      ...SEM1_SUBJECTS,
      ...SEM2_BME,
      createSubject('bme_1', 'Bio-instrumentation', '3rd Semester', 'Sensors and medical devices.'),
      createSubject('bme_2', 'Medical Imaging', '5th Semester', 'X-Ray, MRI, and CT.'),
    ],
    videos: [
      ...SEM1_VIDEOS,
      { id: 'v_bme1', title: 'What is Biomedical Engineering?', youtubeId: '08b7eK1aN1o', instructor: 'U of T', duration: '8:45', semester: '3rd Semester', subjectId: 'bme_1' },
      { id: 'v_bme2', title: 'MRI Physics Explained', youtubeId: '1qFjN-Wk1KE', instructor: 'Real Engineering', duration: '15:30', semester: '5th Semester', subjectId: 'bme_2' },
    ]
  },
  {
    id: 'eee',
    name: 'Electrical & Electronics',
    description: 'Power generation, electrical systems, and machinery control.',
    icon: <Zap className="w-8 h-8" />,
    color: 'bg-yellow-500',
    subjects: [
      ...SEM1_SUBJECTS,
      ...SEM2_EEE,
      createSubject('eee_1', 'Circuit Analysis', '3rd Semester', 'Network theorems.'),
      createSubject('eee_2', 'Power Systems', '5th Semester', 'Generation and Transmission.'),
    ],
    videos: [
      ...SEM1_VIDEOS,
      { id: 'v_eee1', title: 'Kirchhoff\'s Laws', youtubeId: '8jB4u8j-yJE', instructor: 'Organic Chem Tutor', duration: '15:30', semester: '3rd Semester', subjectId: 'eee_1' },
      { id: 'v_eee2', title: 'How Electric Motors Work', youtubeId: 'CWulQ1ZSE3c', instructor: 'Jared Owen', duration: '10:00', semester: '4th Semester', subjectId: 'eee_2' },
    ]
  },
  {
    id: 'ece',
    name: 'Electronics Eng.',
    description: 'Electronic circuits, devices, telecommunications, and signal processing.',
    icon: <Radio className="w-8 h-8" />,
    color: 'bg-violet-500',
    subjects: [
      ...SEM1_SUBJECTS,
      ...SEM2_ECE,
      createSubject('ece_1', 'Analog Electronics', '3rd Semester', 'Amplifiers and Oscillators.'),
      createSubject('ece_2', 'Signal Processing', '5th Semester', 'DSP Basics.'),
    ],
    videos: [
      ...SEM1_VIDEOS,
      { id: 'v_ece1', title: 'Transistors Explained', youtubeId: '7ukDKVHnac4', instructor: 'Real Engineering', duration: '12:00', semester: '3rd Semester', subjectId: 'ece_1' },
      { id: 'v_ece2', title: 'Basic Electronics', youtubeId: 'uOfc24j0260', instructor: 'Neso Academy', duration: '20:00', semester: '3rd Semester', subjectId: 'ece_1' },
    ]
  },
  {
    id: 'civil',
    name: 'Civil Engineering',
    description: 'Design, construction, and maintenance of the physical and built environment.',
    icon: <HardHat className="w-8 h-8" />,
    color: 'bg-stone-500',
    subjects: [
      ...SEM1_SUBJECTS,
      ...SEM2_CIVIL,
      createSubject('civ_1', 'Concrete Technology', '4th Semester', 'Cement, Aggregates, and Mix Design.'),
      createSubject('civ_2', 'Structural Analysis', '5th Semester', 'Beams and Trusses.'),
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
      ...SEM1_SUBJECTS,
      ...SEM2_MECH_LIST,
      createSubject('mech_1', 'Thermodynamics', '3rd Semester', 'Laws of thermodynamics.'),
      createSubject('mech_2', 'AutoCAD for Mech', '4th Semester', 'Drafting mechanical parts.'),
    ],
    videos: [
      ...SEM1_VIDEOS,
      { id: 'v_mech1', title: 'Fluid Mechanics Introduction', youtubeId: 'clVwTr4lE4Q', instructor: 'Efficient Engineer', duration: '12:00', semester: '4th Semester' }, // No subject ID
      { id: 'v_mech2', title: 'Mechanical Gears Explained', youtubeId: 'odW78dqFwY4', instructor: 'Learn Engineering', duration: '8:20', semester: '3rd Semester' }, // No subject ID
    ]
  },
  {
    id: 'auto',
    name: 'Automobile Eng.',
    description: 'Vehicle engineering, including mechanical, electrical, and safety aspects.',
    icon: <Car className="w-8 h-8" />,
    color: 'bg-red-500',
    subjects: [
      ...SEM1_SUBJECTS,
      ...SEM2_AUTO_LIST,
      createSubject('auto_1', 'Internal Combustion Engines', '3rd Semester', 'Petrol and Diesel Engines.'),
      createSubject('auto_2', 'Automotive Chassis', '4th Semester', 'Suspension, Steering, and Brakes.'),
    ],
    videos: [
      ...SEM1_VIDEOS,
      { id: 'v_auto1', title: 'How a Car Engine Works', youtubeId: 'DKF5dKo_r_0', instructor: 'Animagraffs', duration: '14:00', semester: '3rd Semester', subjectId: 'auto_1' },
      { id: 'v_auto2', title: 'Electric Vehicle Basics', youtubeId: '3SAxXUIre28', instructor: 'Engineering Explained', duration: '16:00', semester: '5th Semester' }, // No subject ID
    ]
  }
];

// --- ADVERTISEMENT CONFIGURATION ---
export const ADSENSE_CONFIG = {
  // REPLACE WITH YOUR ACTUAL CLIENT ID (e.g., 'ca-pub-1234567890123456')
  CLIENT_ID: 'ca-pub-1906693882573415',

  // REPLACE WITH YOUR ACTUAL SLOT ID (e.g., '1234567890')
  SLOT_ID: '8643247461',

  // Set to true to enable ads
  ENABLED: true
};