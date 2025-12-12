import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import DepartmentCard from './components/DepartmentCard';
import ResourceList from './components/ResourceList';
import VideoGallery from './components/VideoGallery';
import AITutor from './components/AITutor';
import PDFViewer from './components/PDFViewer';
import VideoPlayer from './components/VideoPlayer';
import SearchResults from './components/SearchResults';
import AdBanner from './components/AdBanner'; 
import DriveFolderModal from './components/DriveFolderModal'; 
import SyncModal from './components/SyncModal'; 
import ScholarshipModal from './components/ScholarshipModal';
import ContactModal from './components/ContactModal';
import { DEPARTMENTS, SEMESTERS } from './constants';
import { Department, Semester, Subject, ResourceCategory, Resource, VideoLecture, BookmarkItem } from './types';
import { Book, Video, Bot, GraduationCap, ArrowLeft, Layers, Calendar, FolderOpen, ChevronRight, FileText, ArrowRight, Zap, Hexagon, ExternalLink, CheckCircle2, Bookmark, AlertTriangle, MessageSquare } from 'lucide-react';

interface SearchResultItem {
  type: 'dept' | 'subject' | 'video';
  item: Department | Subject | VideoLecture;
  dept?: Department;
  sem?: string;
  score: number;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  // App State
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<Semester | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory | null>(null);
  const [isBookmarksView, setIsBookmarksView] = useState(false);
  
  // Subject-level tab state
  const [subjectTab, setSubjectTab] = useState<'materials' | 'videos' | 'ai'>('materials');
  
  const [viewingResource, setViewingResource] = useState<Resource | null>(null);
  const [playingVideo, setPlayingVideo] = useState<VideoLecture | null>(null);
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isScholarshipModalOpen, setIsScholarshipModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);

  // Progress State
  const [progressData, setProgressData] = useState<Record<string, number>>({});
  
  // Bookmark State
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);

  // Parallax Refs
  const parallaxRef1 = useRef<HTMLDivElement>(null);
  const parallaxRef2 = useRef<HTMLDivElement>(null);
  const parallaxRef3 = useRef<HTMLDivElement>(null);

  // --- HISTORY MANAGEMENT ---
  useEffect(() => {
    // Initialize history state if null
    if (!window.history.state) {
      window.history.replaceState({ view: 'home' }, '');
    }

    const handlePopState = (event: PopStateEvent) => {
      const state = event.state;
      
      // Close all overlays by default on back
      setPlayingVideo(null);
      setViewingResource(null);
      setIsDriveModalOpen(false);
      setIsSyncModalOpen(false);
      setIsScholarshipModalOpen(false);
      setIsContactModalOpen(false);
      setSearchQuery('');
      setSearchResults([]);

      if (!state || state.view === 'home') {
        setSelectedDept(null);
        setSelectedSemester(null);
        setSelectedSubject(null);
        setSelectedCategory(null);
        setIsBookmarksView(false);
        return;
      }

      if (state.view === 'bookmarks') {
        setIsBookmarksView(true);
        setSelectedDept(null);
        setSelectedSemester(null);
        setSelectedSubject(null);
        setSelectedCategory(null);
      } 
      else if (state.view === 'dept') {
        const dept = DEPARTMENTS.find(d => d.id === state.deptId);
        if (dept) {
          setSelectedDept(dept);
          setSelectedSemester(null);
          setSelectedSubject(null);
          setSelectedCategory(null);
          setIsBookmarksView(false);
        }
      }
      else if (state.view === 'sem') {
        const dept = DEPARTMENTS.find(d => d.id === state.deptId);
        if (dept) {
          setSelectedDept(dept);
          setSelectedSemester(state.semId);
          setSelectedSubject(null);
          setSelectedCategory(null);
          setIsBookmarksView(false);
        }
      }
      else if (state.view === 'sub') {
        const dept = DEPARTMENTS.find(d => d.id === state.deptId);
        const sub = dept?.subjects.find(s => s.id === state.subId);
        if (dept && sub) {
          setSelectedDept(dept);
          setSelectedSemester(state.semId);
          setSelectedSubject(sub);
          setSelectedCategory(null);
          if (state.tab) setSubjectTab(state.tab);
          setIsBookmarksView(false);
        }
      }
      // Note: Overlays (Video/PDF/Modals) rely on the state *beneath* them being restored 
      // via the logic above if we popped from an overlay state to a view state.
      // If we popped *into* an overlay state (forward), we'd need more logic, 
      // but standard browser 'Back' flow is handled by resetting overlays.
      
      // Special case: Restore overlays if the popped state *is* an overlay state
      if (state.view === 'video' || state.view === 'pdf' || state.modal) {
          // This allows "Forward" navigation to restore the overlay
          // For simplicty in this version, we assume popping back closes overlays.
          // To support Forward, we'd re-open based on state params.
          if (state.modal === 'contact') setIsContactModalOpen(true);
          if (state.modal === 'scholarship') setIsScholarshipModalOpen(true);
          if (state.modal === 'sync') setIsSyncModalOpen(true);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Helper to push history
  const pushHistory = (state: any) => {
    window.history.pushState(state, '');
  };

  useEffect(() => {
    const savedProgress = localStorage.getItem('pollytechnic_progress');
    if (savedProgress) {
      try {
        setProgressData(JSON.parse(savedProgress));
      } catch (e) {
        console.error("Failed to parse progress data", e);
      }
    }

    const savedBookmarks = localStorage.getItem('pollytechnic_bookmarks');
    if (savedBookmarks) {
      try {
        setBookmarks(JSON.parse(savedBookmarks));
      } catch (e) {
        console.error("Failed to parse bookmarks", e);
      }
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'pollytechnic_progress' && e.newValue) {
        try {
          setProgressData(JSON.parse(e.newValue));
        } catch (err) {
          console.error("Failed to sync progress from other tab", err);
        }
      }
      if (e.key === 'pollytechnic_bookmarks' && e.newValue) {
        try {
          setBookmarks(JSON.parse(e.newValue));
        } catch (err) {
            console.error("Failed to sync bookmarks");
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const updateProgress = (subjectId: string, value: number) => {
    const newData = { ...progressData, [subjectId]: value };
    setProgressData(newData);
    localStorage.setItem('pollytechnic_progress', JSON.stringify(newData));
  };

  const handleImportProgress = (importedData: Record<string, number>) => {
    const merged = { ...progressData };
    Object.keys(importedData).forEach(key => {
        if (!merged[key] || importedData[key] > merged[key]) {
            merged[key] = importedData[key];
        }
    });
    setProgressData(merged);
    localStorage.setItem('pollytechnic_progress', JSON.stringify(merged));
  };

  const toggleBookmark = (item: BookmarkItem) => {
    let newBookmarks;
    if (bookmarks.some(b => b.id === item.id)) {
        newBookmarks = bookmarks.filter(b => b.id !== item.id);
    } else {
        newBookmarks = [...bookmarks, item];
    }
    setBookmarks(newBookmarks);
    localStorage.setItem('pollytechnic_bookmarks', JSON.stringify(newBookmarks));
  };

  const isBookmarked = (id: string) => bookmarks.some(b => b.id === id);

  const handleVideoBookmark = (video: VideoLecture) => {
    const isCurrentlyBookmarked = isBookmarked(video.id);

    if (isCurrentlyBookmarked) {
        toggleBookmark({
            id: video.id,
            type: 'video',
            title: video.title,
            subtitle: video.instructor,
            data: video,
        });
    } else {
        if (!selectedDept) return;
        toggleBookmark({
            id: video.id,
            type: 'video',
            title: video.title,
            subtitle: video.instructor,
            data: video,
            deptId: selectedDept.id
        });
    }
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth < 768) return; 

      const scrolled = window.scrollY;
      const rate = 0.35; 
      
      requestAnimationFrame(() => {
        if (parallaxRef1.current) {
           parallaxRef1.current.style.transform = `translateY(${scrolled * rate}px)`;
           parallaxRef1.current.style.opacity = `${1 - Math.min(scrolled / 600, 0.6)}`;
        }
        if (parallaxRef2.current) {
           parallaxRef2.current.style.transform = `translateY(${scrolled * rate}px)`;
           parallaxRef2.current.style.opacity = `${1 - Math.min(scrolled / 600, 0.6)}`;
        }
        if (parallaxRef3.current) {
           parallaxRef3.current.style.transform = `translateY(${scrolled * rate}px)`;
           parallaxRef3.current.style.opacity = `${1 - Math.min(scrolled / 600, 0.6)}`;
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const getProgressStyle = (progress: number) => {
      const activeColor = progress === 100 ? '#10b981' : '#0ea5e9'; 
      const trackColor = isDarkMode ? '#262626' : '#e2e8f0'; 
      
      return {
          background: `linear-gradient(to right, ${activeColor} 0%, ${activeColor} ${progress}%, ${trackColor} ${progress}%, ${trackColor} 100%)`
      };
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const results: SearchResultItem[] = [];

    const getScore = (text: string | undefined, term: string, weight: number) => {
        if (!text) return 0;
        const lowerText = text.toLowerCase();
        if (lowerText === term) return weight * 2; 
        if (lowerText.startsWith(term)) return weight * 1.5; 
        if (lowerText.includes(term)) return weight; 
        return 0;
    };

    DEPARTMENTS.forEach(dept => {
      const deptNameScore = getScore(dept.name, lowerQuery, 10);
      const deptDescScore = getScore(dept.description, lowerQuery, 5);
      
      if (deptNameScore > 0 || deptDescScore > 0) {
        results.push({ 
            type: 'dept', 
            item: dept, 
            score: Math.max(deptNameScore, deptDescScore) 
        });
      }

      dept.subjects.forEach(sub => {
        let score = 0;
        const subTitleScore = getScore(sub.title, lowerQuery, 30);
        const subDescScore = getScore(sub.description, lowerQuery, 8);
        
        const deptContextScore = getScore(dept.name, lowerQuery, 5);
        const semContextScore = getScore(sub.semester, lowerQuery, 15);

        if (subTitleScore > 0 || subDescScore > 0) {
             score = Math.max(subTitleScore, subDescScore) + deptContextScore + semContextScore;
             results.push({ 
                type: 'subject', 
                item: sub, 
                dept, 
                sem: sub.semester,
                score
            });
        } else if (deptContextScore > 0 && semContextScore > 0) {
             score = deptContextScore + semContextScore;
             results.push({ 
                type: 'subject', 
                item: sub, 
                dept, 
                sem: sub.semester,
                score
            });
        }
      });

      dept.videos.forEach(vid => {
        const vidScore = getScore(vid.title, lowerQuery, 15);
        if (vidScore > 0) {
          results.push({ 
            type: 'video', 
            item: vid, 
            dept, 
            sem: vid.semester,
            score: vidScore
          });
        }
      });
    });

    results.sort((a, b) => b.score - a.score);
    setSearchResults(results);
  };

  const handleSelectSearchResult = (result: SearchResultItem) => {
    setSearchQuery(''); 
    setSearchResults([]);
    setIsBookmarksView(false);

    if (result.type === 'dept') {
      handleDeptSelect(result.item as Department);
    } else if (result.type === 'subject') {
      const subject = result.item as Subject;
      const dept = result.dept!;
      // Push state to jump directly to subject
      pushHistory({ view: 'sub', deptId: dept.id, semId: subject.semester, subId: subject.id });
      
      setSelectedDept(dept);
      setSelectedSemester(subject.semester);
      setSelectedSubject(subject);
      setSelectedCategory(null);
      setSubjectTab('materials'); 
    } else if (result.type === 'video') {
      const video = result.item as VideoLecture;
      const dept = result.dept!;
      const relatedSubject = dept.subjects.find(s => s.id === video.subjectId);
      
      // Setup state for video playback
      if (relatedSubject) {
          pushHistory({ view: 'sub', deptId: dept.id, semId: video.semester, subId: relatedSubject.id });
          setSelectedSubject(relatedSubject);
          setSubjectTab('videos');
      } else {
          pushHistory({ view: 'sem', deptId: dept.id, semId: video.semester });
          setSelectedSubject(null);
      }
      setSelectedDept(dept);
      setSelectedSemester(video.semester);
      setSelectedCategory(null);
      
      // Open video immediately
      setTimeout(() => handlePlayVideo(video), 50);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeptSelect = (dept: Department) => {
    pushHistory({ view: 'dept', deptId: dept.id });
    setSelectedDept(dept);
    setSelectedSemester(null);
    setSelectedSubject(null);
    setSelectedCategory(null);
    setIsBookmarksView(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSemesterSelect = (sem: Semester) => {
    if (!selectedDept) return;
    pushHistory({ view: 'sem', deptId: selectedDept.id, semId: sem });
    setSelectedSemester(sem);
    setSelectedSubject(null);
    setSelectedCategory(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubjectSelect = (subject: Subject) => {
    if (!selectedDept || !selectedSemester) return;
    pushHistory({ view: 'sub', deptId: selectedDept.id, semId: selectedSemester, subId: subject.id });
    setSelectedSubject(subject);
    setSelectedCategory(null);
    setSubjectTab('materials');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategorySelect = (category: ResourceCategory) => {
    if (category.type === 'direct_link' && category.url) {
      window.open(category.url, '_blank');
      return;
    }
    // Categories act as local filters in this UI, but we could push state if we wanted
    setSelectedCategory(category);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHomeClick = () => {
    pushHistory({ view: 'home' });
    setSelectedDept(null);
    setSelectedSemester(null);
    setSelectedSubject(null);
    setSelectedCategory(null);
    setPlayingVideo(null);
    setIsBookmarksView(false);
  };
  
  const handleBookmarksClick = () => {
      pushHistory({ view: 'bookmarks' });
      setIsBookmarksView(true);
      setSelectedDept(null);
      setSelectedSemester(null);
      setSelectedSubject(null);
      setSelectedCategory(null);
  }

  // Navigation Back Button Handlers (Use history)
  const goBackToSemesters = () => window.history.back();
  const goBackToSubjects = () => window.history.back();
  const goBackToCategories = () => setSelectedCategory(null); // Local UI state

  const handleViewResource = (resource: Resource) => {
    pushHistory({ view: 'pdf', resourceId: resource.id });
    setViewingResource(resource);
  };

  // Close handlers using history back if appropriate, otherwise direct state
  const handleCloseViewer = () => window.history.back();

  const handlePlayVideo = (video: VideoLecture) => {
    pushHistory({ view: 'video', videoId: video.id });
    setPlayingVideo(video);
  };

  const handleCloseVideo = () => window.history.back();

  // Modals with History Support
  const openModal = (modalName: string, setter: (val: boolean) => void) => {
      pushHistory({ modal: modalName });
      setter(true);
  };
  
  const closeModal = () => window.history.back();

  const getPrerequisiteTitles = (prereqIds: string[] | undefined) => {
    if (!prereqIds || prereqIds.length === 0) return null;
    const titles: string[] = [];
    DEPARTMENTS.forEach(d => {
        d.subjects.forEach(s => {
            if (prereqIds.includes(s.id)) {
                titles.push(s.title);
            }
        })
    });
    return titles;
  };

  const filteredSubjects = selectedDept?.subjects.filter(s => s.semester === selectedSemester) || [];
  const filteredVideos = selectedDept?.videos.filter(v => v.semester === selectedSemester) || [];

  const videosBySubject = filteredVideos.reduce((acc, video) => {
    const subjectId = video.subjectId || 'other';
    if (!acc[subjectId]) acc[subjectId] = [];
    acc[subjectId].push(video);
    return acc;
  }, {} as Record<string, VideoLecture[]>);

  const subjectVideos = selectedSubject ? (videosBySubject[selectedSubject.id] || []) : [];

  return (
    <div className="relative min-h-screen flex flex-col font-sans">
      
      <Header 
        onHomeClick={handleHomeClick} 
        isHome={!selectedDept && !isBookmarksView} 
        isDarkMode={isDarkMode} 
        toggleTheme={toggleTheme}
        onSearch={handleSearch}
        onSyncClick={() => openModal('sync', setIsSyncModalOpen)}
        onBookmarksClick={handleBookmarksClick}
        onScholarshipsClick={() => openModal('scholarship', setIsScholarshipModalOpen)}
      />

      {searchQuery && (
        <SearchResults 
          results={searchResults} 
          onSelectResult={handleSelectSearchResult} 
          onClose={() => setSearchQuery('')} 
        />
      )}

      {viewingResource && (
        <PDFViewer 
          url={viewingResource.url} 
          title={viewingResource.title} 
          onClose={handleCloseViewer} 
        />
      )}

      {isDriveModalOpen && selectedSubject && selectedSubject.driveLink && (
        <DriveFolderModal
            url={selectedSubject.driveLink}
            title={`${selectedSubject.title} - Drive Folder`}
            onClose={closeModal}
        />
      )}
      
      {isSyncModalOpen && (
        <SyncModal 
            isOpen={isSyncModalOpen} 
            onClose={closeModal}
            progressData={progressData}
            onImport={handleImportProgress}
        />
      )}

      {isScholarshipModalOpen && (
        <ScholarshipModal 
            onClose={closeModal}
        />
      )}

      {isContactModalOpen && (
        <ContactModal 
            onClose={closeModal}
        />
      )}

      {playingVideo && (
        <VideoPlayer
          youtubeId={playingVideo.youtubeId}
          title={playingVideo.title}
          onClose={handleCloseVideo}
        />
      )}

      <main className="relative z-10 flex-grow max-w-[1600px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 transition-opacity duration-300">
        
        {isBookmarksView ? (
             <div className="animate-slide-up">
                 <div className="flex items-center mb-8">
                    <button onClick={handleHomeClick} className="glass-button p-3 rounded-full mr-4">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="flex flex-col">
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white">Your Bookmarks</h2>
                        <p className="text-slate-500 dark:text-neutral-400 font-medium">Saved subjects and videos for quick access.</p>
                    </div>
                 </div>

                 {bookmarks.length === 0 ? (
                     <div className="text-center py-20 glass-panel rounded-3xl border-dashed border-2 border-slate-200 dark:border-neutral-800">
                         <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-slate-100 dark:bg-neutral-900 mb-4">
                             <Bookmark className="h-8 w-8 text-slate-400" />
                         </div>
                         <h3 className="text-xl font-bold text-slate-900 dark:text-white">No bookmarks yet</h3>
                         <p className="mt-2 text-slate-500 dark:text-neutral-400">Save subjects or videos to access them here.</p>
                     </div>
                 ) : (
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                         {bookmarks.map(item => {
                             const dept = item.deptId ? DEPARTMENTS.find(d => d.id === item.deptId) : null;
                             
                             return (
                             <div 
                                key={item.id}
                                onClick={() => {
                                    if (item.type === 'subject') {
                                        const dept = DEPARTMENTS.find(d => d.id === item.deptId) || DEPARTMENTS[0];
                                        // Push state before navigating
                                        pushHistory({ view: 'sub', deptId: dept.id, semId: (item.data as Subject).semester, subId: item.id });
                                        
                                        setSelectedDept(dept);
                                        const sub = item.data as Subject;
                                        setSelectedSemester(sub.semester);
                                        handleSubjectSelect(sub);
                                    } else {
                                        handlePlayVideo(item.data as VideoLecture);
                                    }
                                    setIsBookmarksView(false);
                                }}
                                className="glass-panel p-5 rounded-3xl cursor-pointer hover:shadow-xl transition-all hover:scale-[1.02] relative group overflow-hidden"
                             >
                                 {/* Decorative side accent */}
                                 {dept && (
                                     <div className={`absolute top-0 bottom-0 left-0 w-1.5 ${dept.color || 'bg-slate-500'}`}></div>
                                 )}

                                 <div className="absolute top-4 right-4 z-20">
                                     <button 
                                        onClick={(e) => { e.stopPropagation(); toggleBookmark(item); }}
                                        className="p-2 bg-white dark:bg-black rounded-full shadow-md text-sky-500 hover:scale-110 transition-transform"
                                     >
                                         <Bookmark className="w-4 h-4 fill-current" />
                                     </button>
                                 </div>
                                 <div className="flex items-start mb-4 pl-3">
                                     <div className={`p-3 rounded-xl mr-4 flex-shrink-0 shadow-sm ${item.type === 'subject' ? 'bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400' : 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400'}`}>
                                         {item.type === 'subject' ? <Book className="w-6 h-6" /> : <Video className="w-6 h-6" />}
                                     </div>
                                     <div className="flex-1 pr-6 min-w-0">
                                         <h4 className="font-bold text-lg text-slate-900 dark:text-white line-clamp-2 leading-tight mb-1">{item.title}</h4>
                                         <p className="text-xs text-slate-500 dark:text-neutral-400 font-bold uppercase tracking-wider truncate">
                                             {dept ? dept.name.split(' ')[0] : 'General'} • {item.subtitle}
                                         </p>
                                     </div>
                                 </div>
                             </div>
                         )})}
                     </div>
                 )}
             </div>
        ) : !selectedDept ? (
          <div className="space-y-12 animate-slide-up">
            <div 
                ref={parallaxRef1}
                className="text-center max-w-2xl mx-auto mb-10 pt-4 will-change-transform"
            >
              <div className="inline-flex items-center justify-center p-4 glass-panel rounded-full mb-6 shadow-xl shadow-sky-500/10">
                 <div className="bg-gradient-to-br from-sky-500 to-blue-600 p-2.5 rounded-full shadow-md text-white">
                    <GraduationCap className="w-8 h-8 fill-current" />
                 </div>
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
                Select Department
              </h2>
              <p className="text-lg text-slate-600 dark:text-neutral-400 font-medium max-w-md mx-auto leading-relaxed">
                Premium study materials for polytechnic excellence.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 px-0 sm:px-4 relative z-10">
              {DEPARTMENTS.map((dept) => (
                <DepartmentCard 
                  key={dept.id} 
                  department={dept} 
                  onClick={handleDeptSelect} 
                />
              ))}
            </div>
            
            <AdBanner />

            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-center max-w-6xl mx-auto relative z-10">
                <div className="p-8 glass-panel rounded-3xl">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-2xl bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 mb-4 shadow-sm">
                        <Layers className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Curated Materials</h3>
                    <p className="mt-2 text-sm text-slate-600 dark:text-neutral-400 font-medium">Hand-picked notes tailored to your syllabus.</p>
                </div>
                <div className="p-8 glass-panel rounded-3xl">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-2xl bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 mb-4 shadow-sm">
                        <Video className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">HD Video Lectures</h3>
                    <p className="mt-2 text-sm text-slate-600 dark:text-neutral-400 font-medium">Crystal clear explanations from top professors.</p>
                </div>
                <div className="p-8 glass-panel rounded-3xl">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 mb-4 shadow-sm">
                        <Bot className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">AI Assistant</h3>
                    <p className="mt-2 text-sm text-slate-600 dark:text-neutral-400 font-medium">24/7 doubts solving powered by Gemini.</p>
                </div>
            </div>
          </div>
        ) : !selectedSemester ? (
           <div className="animate-slide-up space-y-6 pt-2">
             <button 
                onClick={handleHomeClick}
                className="glass-button px-5 py-2.5 rounded-full flex items-center space-x-2 text-sm font-bold relative z-20"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

             <div 
                ref={parallaxRef2}
                className="text-center max-w-4xl mx-auto mb-12 will-change-transform"
            >
               <div className={`inline-flex items-center justify-center p-8 rounded-3xl bg-white/50 dark:bg-white/5 backdrop-blur-md mb-8 ring-1 ring-slate-900/5 dark:ring-white/10 shadow-2xl`}>
                   <div className={`transform scale-150 ${selectedDept.color?.replace('bg-', 'text-') || 'text-slate-900 dark:text-white'}`}>
                      {selectedDept.icon}
                   </div>
               </div>
               <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
                 {selectedDept.name}
               </h2>
               <p className="text-lg text-slate-600 dark:text-neutral-400 mb-8 max-w-xl mx-auto font-medium opacity-90">Select your current semester</p>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 text-left">
                  {SEMESTERS.map((sem, index) => (
                    <button
                      key={index}
                      onClick={() => handleSemesterSelect(sem)}
                      className="group flex items-center p-5 glass-button rounded-3xl text-left hover:scale-[1.01] transition-transform"
                    >
                      <div className="mr-4 bg-slate-100 dark:bg-neutral-800 p-3 rounded-xl group-hover:bg-sky-500 group-hover:text-white transition-colors">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{sem}</h3>
                        <p className="text-xs text-slate-500 font-medium mt-0.5 group-hover:text-sky-600 dark:group-hover:text-sky-300">View Resources</p>
                      </div>
                      <div className="text-slate-300 dark:text-neutral-600 group-hover:text-sky-500 group-hover:translate-x-1 transition-all">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </button>
                  ))}
               </div>
               
               <AdBanner />
             </div>
           </div>
        ) : (
          <div className="animate-slide-up pt-4">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 lg:mb-10 gap-6 sticky top-20 lg:static z-40 bg-mesh/90 backdrop-blur-md lg:bg-transparent lg:backdrop-blur-none p-2 lg:p-0 rounded-2xl lg:rounded-none">
               <div className="flex-1 min-w-0" ref={parallaxRef3}>
                  <nav className="flex items-center text-xs md:text-sm font-bold text-slate-500 dark:text-neutral-400 mb-2 lg:mb-3 overflow-x-auto whitespace-nowrap pb-1 no-scrollbar">
                    <button onClick={handleHomeClick} className="hover:text-sky-500 transition-colors">Home</button>
                    <ChevronRight className="w-3 h-3 mx-2 flex-shrink-0 opacity-40" />
                    <button onClick={handleHomeClick} className="hover:text-sky-500 transition-colors">{selectedDept.name}</button>
                    <ChevronRight className="w-3 h-3 mx-2 flex-shrink-0 opacity-40" />
                    <button onClick={goBackToSemesters} className="hover:text-sky-500 transition-colors">{selectedSemester}</button>
                    {selectedSubject && (
                      <>
                        <ChevronRight className="w-3 h-3 mx-2 flex-shrink-0 opacity-40" />
                        <button onClick={goBackToSubjects} className="text-slate-900 dark:text-white hover:underline transition-colors truncate max-w-[150px]">{selectedSubject.title}</button>
                      </>
                    )}
                    {selectedCategory && (
                       <>
                        <ChevronRight className="w-3 h-3 mx-2 flex-shrink-0 opacity-40" />
                        <span className="text-slate-900 dark:text-white truncate max-w-[150px] font-bold">{selectedCategory.title}</span>
                      </>
                    )}
                  </nav>
                  
                  <h2 className="text-2xl md:text-3xl lg:text-5xl font-black text-slate-900 dark:text-white leading-tight truncate">
                    {selectedCategory ? selectedCategory.title : selectedSubject ? selectedSubject.title : selectedDept.name}
                  </h2>
               </div>
               
               {selectedSubject && (
                 <div className="flex p-1.5 glass-panel rounded-xl flex-shrink-0 self-start lg:self-center gap-2 overflow-x-auto max-w-full w-full lg:w-auto">
                    {[
                      { id: 'materials', label: 'Materials', icon: FolderOpen },
                      { id: 'videos', label: 'Videos', icon: Video },
                      { id: 'ai', label: 'AI Tutor', icon: Bot },
                    ].map((tab) => (
                      <button
                          key={tab.id}
                          onClick={() => setSubjectTab(tab.id as any)}
                          className={`flex-1 lg:flex-none px-4 md:px-5 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center whitespace-nowrap ${
                          subjectTab === tab.id
                              ? 'glass-button-active shadow-md' 
                              : 'text-slate-500 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-800'
                          }`}
                      >
                          <tab.icon className="w-4 h-4 mr-2" />
                          {tab.label}
                      </button>
                    ))}
                 </div>
               )}
            </div>

            <div className="min-h-[400px]">
              
              {!selectedSubject && (
                <div className="animate-fade-in">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Subjects</h3>
                    <span className="text-xs font-bold bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-full">
                      {filteredSubjects.length} items
                    </span>
                  </div>
                  
                  {filteredSubjects.length === 0 ? (
                    <div className="text-center py-20 glass-panel rounded-3xl border-dashed border-2 border-slate-200 dark:border-neutral-800">
                       <p className="text-slate-500 dark:text-neutral-400">No subjects found for this semester.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                      {filteredSubjects.map(subject => {
                        const bookmarked = isBookmarked(subject.id);
                        const progress = progressData[subject.id] || 0;
                        
                        return (
                        <div 
                          key={subject.id}
                          onClick={() => handleSubjectSelect(subject)}
                          className="glass-button p-5 md:p-6 rounded-3xl text-left group relative overflow-hidden h-full flex flex-col justify-between hover:shadow-xl hover:shadow-sky-500/20 dark:hover:shadow-sky-400/20 hover:border-sky-500 dark:hover:border-sky-400 hover:-translate-y-1 transition-all duration-300"
                        >
                           <div className="relative z-10 flex flex-col h-full">
                              <div className="flex justify-between items-start mb-4">
                                 <div className="p-3 bg-slate-100 dark:bg-neutral-800 rounded-xl shadow-sm text-slate-700 dark:text-white">
                                    <Book className="w-6 h-6" />
                                 </div>
                                 <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleBookmark({
                                            id: subject.id,
                                            type: 'subject',
                                            title: subject.title,
                                            subtitle: subject.semester,
                                            data: subject,
                                            deptId: selectedDept.id
                                        });
                                    }}
                                    className={`p-2 rounded-full transition-colors z-20 ${bookmarked ? 'text-sky-500' : 'text-slate-300 dark:text-neutral-600 hover:text-sky-500'}`}
                                 >
                                     <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-current' : ''}`} />
                                 </button>
                              </div>
                              
                              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2 leading-tight group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">{subject.title}</h4>
                              <p className="text-xs text-slate-500 dark:text-neutral-400 line-clamp-2 font-medium leading-relaxed mb-auto">{subject.description || 'Access comprehensive study resources.'}</p>
                              
                              <div className="mt-4 flex flex-wrap gap-2">
                                {subject.driveLink && <span className="inline-flex items-center text-[10px] font-bold bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 px-2 py-1 rounded-md">Materials</span>}
                                {(videosBySubject[subject.id]?.length > 0) && <span className="inline-flex items-center text-[10px] font-bold bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 px-2 py-1 rounded-md">Videos</span>}
                              </div>
                              
                              {/* Progress Bar Section */}
                              <div 
                                className="mt-5 pt-3 border-t border-slate-200/50 dark:border-white/5"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                        {progress === 100 ? (
                                            <>
                                                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                                <span className="text-emerald-500">Completed</span>
                                            </>
                                        ) : 'Study Progress'}
                                    </span>
                                    <span className={`text-xs font-bold ${progress === 100 ? 'text-emerald-500' : 'text-sky-600 dark:text-sky-400'}`}>
                                        {progress}%
                                    </span>
                                </div>
                                <input 
                                    type="range" 
                                    min="0" 
                                    max="100" 
                                    step="5"
                                    value={progress}
                                    onChange={(e) => updateProgress(subject.id, parseInt(e.target.value))}
                                    style={getProgressStyle(progress)}
                                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-sky-500"
                                />
                              </div>
                           </div>
                        </div>
                      )})}
                    </div>
                  )}
                </div>
              )}

              {/* ... (Selected Subject Resource view remains same) ... */}
              {selectedSubject && (
                <div className="animate-fade-in">
                    {/* ... (existing subject content) ... */}
                    {!selectedCategory && (
                         <div className="flex flex-col gap-6 mb-6">
                           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                               <div className="flex items-center">
                                    <button onClick={goBackToSubjects} className="glass-button p-3 rounded-full mr-4">
                                        <ArrowLeft className="w-5 h-5" />
                                    </button>
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-wider">Subject Resources</p>
                                    </div>
                               </div>
                               
                               {selectedSubject.prerequisites && selectedSubject.prerequisites.length > 0 && (
                                   <div className="flex items-center text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-xl border border-amber-200 dark:border-amber-800/30">
                                       <AlertTriangle className="w-4 h-4 mr-2" />
                                       <span>Prerequisites: {getPrerequisiteTitles(selectedSubject.prerequisites)?.join(', ') || 'None'}</span>
                                   </div>
                               )}
                           </div>

                           <div className="glass-panel p-4 rounded-2xl flex items-center gap-4 border border-slate-200/50 dark:border-white/10">
                                <div className="flex-shrink-0 p-2.5 bg-slate-100 dark:bg-neutral-800 rounded-xl text-slate-600 dark:text-slate-300">
                                    {(progressData[selectedSubject.id] || 0) === 100 ? (
                                        <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                                    ) : (
                                        <CheckCircle2 className="w-6 h-6" />
                                    )}
                                </div>
                                <div className="flex-grow">
                                     <div className="flex justify-between items-center mb-1.5">
                                        <span className="text-xs font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-wide">
                                            {(progressData[selectedSubject.id] || 0) === 100 ? 'Subject Completed' : 'Track Your Progress'}
                                        </span>
                                        <span className={`text-sm font-bold ${(progressData[selectedSubject.id] || 0) === 100 ? 'text-emerald-500' : 'text-sky-600 dark:text-sky-400'}`}>
                                            {progressData[selectedSubject.id] || 0}%
                                        </span>
                                    </div>
                                    <input 
                                        type="range" 
                                        min="0" 
                                        max="100" 
                                        step="5"
                                        value={progressData[selectedSubject.id] || 0}
                                        onChange={(e) => updateProgress(selectedSubject.id, parseInt(e.target.value))}
                                        style={getProgressStyle(progressData[selectedSubject.id] || 0)}
                                        className="w-full h-2.5 rounded-full appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-sky-500 [&::-webkit-slider-thumb]:transform [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110"
                                    />
                                </div>
                           </div>
                        </div>
                    )}

                    {subjectTab === 'materials' && !selectedCategory && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                           {selectedSubject.driveLink && (
                              <div
                                onClick={() => openModal('drive', setIsDriveModalOpen)}
                                className="glass-button p-6 rounded-3xl flex flex-col h-full text-left group hover:border-sky-500 hover:shadow-sky-500/20"
                              >
                                 <div className="flex items-center justify-between mb-5">
                                    <div className="p-4 rounded-xl shadow-sm border border-slate-100 dark:border-neutral-800 bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400">
                                       <FolderOpen className="w-6 h-6" />
                                    </div>
                                    <div className="p-2 rounded-full bg-slate-100 dark:bg-neutral-800 text-slate-400 group-hover:text-sky-500 transition-colors">
                                       <ExternalLink className="w-5 h-5" />
                                    </div>
                                 </div>
                                 
                                 <div className="mt-auto">
                                    <h4 className="font-bold text-xl text-slate-900 dark:text-white mb-2">Google Drive Folder</h4>
                                    <p className="text-sm text-slate-500 dark:text-neutral-400 font-medium">
                                        Browse study materials and select a file to view directly.
                                    </p>
                                 </div>
                              </div>
                           )}

                           {selectedSubject.categories.map(category => (
                              <div
                                key={category.id}
                                onClick={() => handleCategorySelect(category)}
                                className="glass-button p-6 rounded-3xl flex flex-col h-full text-left"
                              >
                                 <div className="flex items-center justify-between mb-5">
                                    <div className="p-4 rounded-xl shadow-sm border border-slate-100 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-800 text-slate-700 dark:text-white">
                                       {category.title === 'Just Pass Notes' ? <Zap className="w-6 h-6" /> : (category.type === 'collection' ? <FolderOpen className="w-6 h-6" /> : <FileText className="w-6 h-6" />)}
                                    </div>
                                 </div>
                                 
                                 <div className="mt-auto">
                                    <h4 className="font-bold text-xl text-slate-900 dark:text-white mb-2">{category.title}</h4>
                                    <p className="text-sm text-slate-500 dark:text-neutral-400 font-medium">
                                        {category.description || (category.type === 'direct_link' ? 'Open in Google Drive' : 'View collection')}
                                    </p>
                                 </div>
                              </div>
                           ))}
                        </div>
                    )}

                    {subjectTab === 'materials' && selectedCategory && (
                     <div className="animate-fade-in">
                        <div className="flex items-center mb-8">
                           <button onClick={goBackToCategories} className="glass-button p-3 rounded-full mr-4">
                              <ArrowLeft className="w-5 h-5" />
                           </button>
                           <h3 className="text-2xl font-black text-slate-900 dark:text-white">Files</h3>
                        </div>
                        
                        {selectedCategory.items && (
                           <ResourceList resources={selectedCategory.items} onView={handleViewResource} />
                        )}
                     </div>
                    )}

                    {subjectTab === 'videos' && (
                        <div className="animate-fade-in">
                            <div className="mb-6">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Video Lectures</h3>
                                <p className="text-sm text-slate-500 dark:text-neutral-400 font-medium">Watch curated tutorials for {selectedSubject.title}</p>
                            </div>
                            
                            <VideoGallery 
                                videos={subjectVideos} 
                                onPlay={handlePlayVideo}
                                onToggleBookmark={handleVideoBookmark}
                                isBookmarked={isBookmarked}
                            />
                        </div>
                    )}

                    {subjectTab === 'ai' && (
                        <div className="animate-fade-in h-full">
                           <div className="mb-6">
                              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1">Subject Expert AI</h3>
                              <p className="text-sm text-slate-500 dark:text-neutral-400 font-medium">Ask specific questions about {selectedSubject.title}.</p>
                           </div>
                           <AITutor 
                                departmentName={selectedDept.name} 
                                semesterName={selectedSemester} 
                                subjectName={selectedSubject.title}
                           />
                        </div>
                    )}
                </div>
              )}
              
              <AdBanner className="mt-10" />
            </div>
          </div>
        )}
      </main>

      {/* Cleaned Footer */}
      <footer className="glass-panel border-t border-slate-100/50 dark:border-white/5 mt-20 py-10 mb-6 mx-4 sm:mx-8 rounded-[2.5rem] shadow-lg relative overflow-hidden bg-white/50 dark:bg-neutral-900/50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            
            <div className="text-center md:text-left">
                 <div className="flex items-center justify-center md:justify-start mb-2 group">
                    <div className="mr-3 bg-gradient-to-br from-slate-900 to-slate-700 dark:from-white dark:to-neutral-400 p-1.5 rounded-lg text-white dark:text-black shadow-md">
                        <Hexagon className="w-5 h-5 fill-current" />
                    </div>
                    <span className="font-black text-lg text-slate-900 dark:text-white tracking-tighter">
                        POLLY<span className="font-light">TECHNIC</span>
                    </span>
                 </div>
                 <div className="text-xs font-semibold text-slate-500 dark:text-neutral-500">
                   <p>© 2025 POLLYTECHNIC. All rights reserved.</p>
                   <p className="mt-1">
                     Designed by <a href="https://mohdnihadkp.github.io/mohdnihadkp/" target="_blank" rel="noopener noreferrer" className="hover:text-sky-500 transition-colors">mohdnihadkp</a>
                   </p>
                 </div>
            </div>
            
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => openModal('contact', setIsContactModalOpen)}
                    className="flex items-center space-x-2 text-sm font-bold text-slate-500 dark:text-neutral-400 hover:text-sky-500 dark:hover:text-sky-400 transition-colors"
                >
                    <MessageSquare className="w-4 h-4" />
                    <span>Feedback</span>
                </button>
            </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
