import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import DepartmentCard from './components/DepartmentCard';
import ResourceList from './components/ResourceList';
import VideoGallery from './components/VideoGallery';
import AITutor from './components/AITutor';
import PDFViewer from './components/PDFViewer';
import VideoPlayer from './components/VideoPlayer';
import SearchResults from './components/SearchResults';
import ContactModal from './components/ContactModal';
import AdBanner from './components/AdBanner';
import AdSenseScript from './components/AdSenseScript';
import PrivacyPolicy from './components/PrivacyPolicy';
import { DEPARTMENTS, SEMESTERS } from './constants';
import { Department, Semester, Subject, ResourceCategory, Resource, VideoLecture } from './types';
import { Book, Video, Bot, GraduationCap, ArrowLeft, Layers, Calendar, FolderOpen, ChevronRight, FileText, ArrowRight, Wrench, Zap, Mail, Hexagon, ExternalLink } from 'lucide-react';

// Search interface helper
interface SearchResultItem {
  type: 'dept' | 'subject' | 'video';
  item: Department | Subject | VideoLecture;
  dept?: Department;
  sem?: string;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

function App() {
  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(true);

  // App State
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<Semester | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory | null>(null);

  const [activeTab, setActiveTab] = useState<'materials' | 'videos' | 'ai'>('materials');
  const [viewingResource, setViewingResource] = useState<Resource | null>(null);
  const [playingVideo, setPlayingVideo] = useState<VideoLecture | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);

  // Theme Toggle Effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Search Logic
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const results: SearchResultItem[] = [];

    DEPARTMENTS.forEach(dept => {
      // 1. Search Departments
      if (dept.name.toLowerCase().includes(lowerQuery)) {
        results.push({ type: 'dept', item: dept });
      }

      // 2. Search Subjects
      dept.subjects.forEach(sub => {
        if (sub.title.toLowerCase().includes(lowerQuery) || sub.description?.toLowerCase().includes(lowerQuery)) {
          results.push({ type: 'subject', item: sub, dept, sem: sub.semester });
        }
      });

      // 3. Search Videos
      dept.videos.forEach(vid => {
        if (vid.title.toLowerCase().includes(lowerQuery)) {
          results.push({ type: 'video', item: vid, dept, sem: vid.semester });
        }
      });
    });

    setSearchResults(results);
  };

  const handleSelectSearchResult = (result: SearchResultItem) => {
    setSearchQuery(''); // Close search
    setSearchResults([]);

    if (result.type === 'dept') {
      handleDeptSelect(result.item as Department);
    } else if (result.type === 'subject') {
      const subject = result.item as Subject;
      const dept = result.dept!;

      // If subject has a direct link, open it
      if (subject.driveLink) {
        window.open(subject.driveLink, '_blank');
        return;
      }

      setSelectedDept(dept);
      setSelectedSemester(subject.semester);
      setSelectedSubject(subject);
      setSelectedCategory(null);
      setActiveTab('materials');
    } else if (result.type === 'video') {
      const video = result.item as VideoLecture;
      const dept = result.dept!;
      setSelectedDept(dept);
      setSelectedSemester(video.semester);
      setSelectedSubject(null);
      setSelectedCategory(null);
      setActiveTab('videos');
      // Auto play the selected video from search
      setPlayingVideo(video);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeptSelect = (dept: Department) => {
    setSelectedDept(dept);
    setSelectedSemester(null);
    setSelectedSubject(null);
    setSelectedCategory(null);
    setActiveTab('materials');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSemesterSelect = (sem: Semester) => {
    setSelectedSemester(sem);
    setSelectedSubject(null);
    setSelectedCategory(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubjectSelect = (subject: Subject) => {
    if (subject.driveLink) {
      window.open(subject.driveLink, '_blank');
      return;
    }
    setSelectedSubject(subject);
    setSelectedCategory(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategorySelect = (category: ResourceCategory) => {
    if (category.type === 'direct_link' && category.url) {
      window.open(category.url, '_blank');
      return;
    }
    setSelectedCategory(category);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHomeClick = () => {
    setSelectedDept(null);
    setSelectedSemester(null);
    setSelectedSubject(null);
    setSelectedCategory(null);
    setPlayingVideo(null);
  };

  // Navigation handlers
  const goBackToSemesters = () => {
    setSelectedSemester(null);
    setSelectedSubject(null);
    setSelectedCategory(null);
  };

  const goBackToSubjects = () => {
    setSelectedSubject(null);
    setSelectedCategory(null);
  };

  const goBackToCategories = () => {
    setSelectedCategory(null);
  };

  const handleViewResource = (resource: Resource) => {
    setViewingResource(resource);
  };

  const handleCloseViewer = () => {
    setViewingResource(null);
  };

  const handlePlayVideo = (video: VideoLecture) => {
    setPlayingVideo(video);
  };

  const handleCloseVideo = () => {
    setPlayingVideo(null);
  };

  // Helper to identify Lab/Practical subjects
  const isPracticalSubject = (title: string) => {
    const lowerTitle = title.toLowerCase();
    return lowerTitle.includes('lab') ||
      lowerTitle.includes('practical') ||
      lowerTitle.includes('workshop') ||
      lowerTitle.includes('practice');
  };

  // Filter content
  const filteredSubjects = selectedDept?.subjects.filter(s => s.semester === selectedSemester) || [];
  const filteredVideos = selectedDept?.videos.filter(v => v.semester === selectedSemester) || [];

  // Group videos by subject
  const videosBySubject = filteredVideos.reduce((acc, video) => {
    const subjectId = video.subjectId || 'other';
    if (!acc[subjectId]) acc[subjectId] = [];
    acc[subjectId].push(video);
    return acc;
  }, {} as Record<string, VideoLecture[]>);

  // Split subjects into Theory and Practical
  const theorySubjects = filteredSubjects.filter(sub => !isPracticalSubject(sub.title));
  const practicalSubjects = filteredSubjects.filter(sub => isPracticalSubject(sub.title));

  // Find practical subjects that actually have videos (to avoid cluttering if empty)
  const practicalsWithVideos = practicalSubjects.filter(sub => videosBySubject[sub.id]?.length > 0);

  const otherVideos = videosBySubject['other'] || [];

  return (
    <div className="relative min-h-screen flex flex-col font-sans selection:bg-pink-500/30">
      <AdSenseScript />

      {/* VIBRANT MESH BACKGROUND FOR GLASS EFFECT */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#f8fafc] dark:bg-[#000000]">
        {/* We need highly saturated blobs for the glass blur to look good */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-400/30 dark:bg-blue-600/20 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-[120px] animate-blob"></div>
        <div className="absolute top-[10%] right-[-10%] w-[60%] h-[60%] bg-purple-400/30 dark:bg-indigo-600/20 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-[120px] animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[60%] bg-pink-400/30 dark:bg-fuchsia-800/20 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-[120px] animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[50%] h-[50%] bg-cyan-300/30 dark:bg-cyan-700/10 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-[100px] animate-blob animation-delay-3000"></div>
      </div>

      <Header
        onHomeClick={handleHomeClick}
        isHome={!selectedDept}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        onSearch={handleSearch}
        onContactClick={() => setIsContactModalOpen(true)}
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

      {playingVideo && (
        <VideoPlayer
          youtubeId={playingVideo.youtubeId}
          title={playingVideo.title}
          onClose={handleCloseVideo}
        />
      )}

      {isContactModalOpen && (
        <ContactModal onClose={() => setIsContactModalOpen(false)} />
      )}

      {isPrivacyOpen && (
        <PrivacyPolicy onClose={() => setIsPrivacyOpen(false)} />
      )}

      <main className="relative z-10 flex-grow max-w-[1600px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {!selectedDept ? (
          // 1. Department Selection View
          <div className="space-y-12 animate-fade-in">
            <div className="text-center max-w-2xl mx-auto mb-16 pt-8">
              <div className="inline-flex items-center justify-center p-5 glass-panel rounded-full mb-8 shadow-[0_0_50px_rgba(56,189,248,0.3)] animate-float">
                <div className="bg-gradient-to-tr from-blue-500 to-indigo-600 p-3 rounded-full shadow-lg">
                  <GraduationCap className="w-10 h-10 text-white" />
                </div>
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-200 dark:to-slate-400 mb-6 tracking-tight drop-shadow-sm pb-2">
                Select Department
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 font-medium max-w-lg mx-auto leading-relaxed">
                Dive into a premium learning experience crafted for polytechnic excellence.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 px-4">
              {DEPARTMENTS.map((dept) => (
                <DepartmentCard
                  key={dept.id}
                  department={dept}
                  onClick={handleDeptSelect}
                />
              ))}
            </div>

            <AdBanner />

            <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 text-center max-w-6xl mx-auto">
              <div className="p-10 glass-panel rounded-[2.5rem] hover:-translate-y-3 transition-transform duration-500 glow-on-hover">
                <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-[1.5rem] bg-blue-500/10 text-blue-600 dark:text-blue-400 mb-6 backdrop-blur-md shadow-inner ring-1 ring-white/20">
                  <Layers className="h-10 w-10" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Curated Materials</h3>
                <p className="mt-4 text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium">Hand-picked notes tailored to your exact syllabus needs.</p>
              </div>
              <div className="p-10 glass-panel rounded-[2.5rem] hover:-translate-y-3 transition-transform duration-500 glow-on-hover">
                <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-[1.5rem] bg-red-500/10 text-red-600 dark:text-red-400 mb-6 backdrop-blur-md shadow-inner ring-1 ring-white/20">
                  <Video className="h-10 w-10" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">HD Video Lectures</h3>
                <p className="mt-4 text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium">Crystal clear explanations from top-tier professors.</p>
              </div>
              <div className="p-10 glass-panel rounded-[2.5rem] hover:-translate-y-3 transition-transform duration-500 glow-on-hover">
                <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-[1.5rem] bg-purple-500/10 text-purple-600 dark:text-purple-400 mb-6 backdrop-blur-md shadow-inner ring-1 ring-white/20">
                  <Bot className="h-10 w-10" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">AI Assistant</h3>
                <p className="mt-4 text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium">24/7 doubts solving powered by Gemini 2.5.</p>
              </div>
            </div>
          </div>
        ) : !selectedSemester ? (
          // 2. Semester Selection View
          <div className="animate-fade-in space-y-8 pt-6">
            <button
              onClick={handleHomeClick}
              className="glass-button px-6 py-3 rounded-full flex items-center space-x-2 text-sm font-bold text-slate-700 dark:text-slate-200 mb-8 hover:text-poly-600 dark:hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <div className="text-center max-w-4xl mx-auto mb-16">
              <div className={`inline-flex items-center justify-center p-10 rounded-[3rem] ${selectedDept.color} bg-opacity-20 backdrop-blur-2xl mb-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] animate-float ring-1 ring-white/30`}>
                <div className="text-slate-900 dark:text-white transform scale-[2.0] drop-shadow-md">
                  {selectedDept.icon}
                </div>
              </div>
              <h2 className="text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
                {selectedDept.name}
              </h2>
              <p className="text-2xl text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto font-medium opacity-80">Select your current semester</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {SEMESTERS.map((sem, index) => (
                  <button
                    key={index}
                    onClick={() => handleSemesterSelect(sem)}
                    className="group relative flex items-center p-6 glass-button rounded-[2rem] hover:scale-[1.03] text-left !bg-opacity-60 dark:!bg-opacity-30"
                  >
                    <div className="mr-5 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 p-4 rounded-2xl group-hover:shadow-lg transition-all ring-1 ring-white/10 group-hover:scale-110 duration-300">
                      <Calendar className="w-6 h-6 text-slate-500 dark:text-slate-300 group-hover:text-poly-600 dark:group-hover:text-poly-400" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">{sem}</h3>
                      <p className="text-sm text-slate-500 font-medium mt-1">View Resources</p>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-6 text-slate-400">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </button>
                ))}
              </div>

              <AdBanner />
            </div>
          </div>
        ) : (
          // 3. Main Content View
          <div className="animate-fade-in-up pt-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-8">
              <div className="flex-1 min-w-0">
                <nav className="flex items-center text-sm font-bold text-slate-500 mb-4 overflow-x-auto whitespace-nowrap pb-2 no-scrollbar">
                  <button onClick={handleHomeClick} className="hover:text-poly-600 dark:hover:text-poly-400 transition-colors">Home</button>
                  <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0 opacity-40" />
                  <button onClick={handleHomeClick} className="hover:text-poly-600 dark:hover:text-poly-400 transition-colors">{selectedDept.name}</button>
                  <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0 opacity-40" />
                  <button onClick={goBackToSemesters} className="hover:text-poly-600 dark:hover:text-poly-400 transition-colors">{selectedSemester}</button>
                  {selectedSubject && (
                    <>
                      <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0 opacity-40" />
                      <button onClick={goBackToSubjects} className="text-slate-800 dark:text-slate-200 hover:text-poly-600 dark:hover:text-poly-400 transition-colors truncate max-w-[200px]">{selectedSubject.title}</button>
                    </>
                  )}
                  {selectedCategory && (
                    <>
                      <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0 opacity-40" />
                      <span className="text-slate-900 dark:text-white truncate max-w-[200px] font-bold text-poly-600 dark:text-poly-400">{selectedCategory.title}</span>
                    </>
                  )}
                </nav>

                <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight drop-shadow-sm">
                  {selectedCategory ? selectedCategory.title : selectedSubject ? selectedSubject.title : selectedDept.name}
                </h2>
              </div>

              <div className="flex p-2 glass-panel rounded-2xl flex-shrink-0 self-start lg:self-center gap-3 shadow-xl">
                {[
                  { id: 'materials', label: 'Materials', icon: Book },
                  { id: 'videos', label: 'Videos', icon: Video },
                  { id: 'ai', label: 'AI Tutor', icon: Bot },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-8 py-3 text-sm font-bold rounded-xl transition-all flex items-center glass-button border-none ${activeTab === tab.id
                      ? 'glass-button-active'
                      : 'bg-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                  >
                    <tab.icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="min-h-[500px]">
              {activeTab === 'materials' && (
                <div className="animate-fade-in">

                  {/* LEVEL 1: SUBJECT LIST */}
                  {!selectedSubject && (
                    <>
                      <div className="flex justify-between items-center mb-8">
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Select Subject</h3>
                        <span className="text-xs font-bold bg-white/60 dark:bg-slate-800/60 backdrop-blur-md text-slate-700 dark:text-slate-300 px-4 py-2 rounded-full border border-white/30 dark:border-slate-600 shadow-sm">
                          {filteredSubjects.length} subjects available
                        </span>
                      </div>

                      {filteredSubjects.length === 0 ? (
                        <div className="text-center py-24 glass-panel rounded-[2.5rem] border-dashed border-2 border-slate-300 dark:border-slate-700">
                          <p className="text-slate-500 text-lg">No subjects found for this semester.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                          {filteredSubjects.map(subject => (
                            <div
                              key={subject.id}
                              onClick={() => handleSubjectSelect(subject)}
                              className="glass-button p-8 rounded-[2.5rem] hover:scale-[1.02] text-left group relative overflow-hidden h-full flex flex-col justify-between"
                            >
                              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-poly-500/10 to-transparent rounded-bl-[100%] -mr-8 -mt-8 transition-transform group-hover:scale-150 pointer-events-none"></div>

                              <div className="relative z-10">
                                <div className="flex justify-between items-start mb-8">
                                  <div className="p-4 bg-white/80 dark:bg-slate-800/80 rounded-2xl group-hover:bg-poly-500 group-hover:text-white transition-colors duration-300 shadow-lg ring-1 ring-black/5">
                                    <Book className="w-7 h-7" />
                                  </div>
                                  <div className="p-3 rounded-full text-slate-300 group-hover:text-poly-500 transition-colors bg-white/40 dark:bg-black/20">
                                    {subject.driveLink ? <ExternalLink className="w-6 h-6" /> : <ArrowRight className="w-6 h-6" />}
                                  </div>
                                </div>

                                <h4 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 leading-tight tracking-tight">{subject.title}</h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 font-medium leading-relaxed opacity-90">{subject.description || 'Access comprehensive study resources including notes, syllabus, and question papers.'}</p>
                                {subject.driveLink && <p className="text-xs font-bold text-poly-600 dark:text-poly-400 mt-2 uppercase tracking-wide">Google Drive</p>}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  {/* LEVEL 2: CATEGORY LIST */}
                  {selectedSubject && !selectedCategory && (
                    <>
                      <div className="flex items-center mb-10">
                        <button onClick={goBackToSubjects} className="glass-button p-4 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mr-6 transition-transform hover:scale-110">
                          <ArrowLeft className="w-6 h-6" />
                        </button>
                        <div>
                          <p className="text-xs text-poly-600 dark:text-poly-400 uppercase tracking-widest font-extrabold mb-1">Step 2</p>
                          <h3 className="text-3xl font-black text-slate-900 dark:text-white">Choose Resource</h3>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {selectedSubject.categories.map(category => (
                          <div
                            key={category.id}
                            onClick={() => handleCategorySelect(category)}
                            className="glass-button p-8 rounded-[2.5rem] hover:scale-[1.02] flex flex-col h-full text-left"
                          >
                            <div className="flex items-center justify-between mb-6">
                              <div className={`p-5 rounded-2xl shadow-xl border border-white/20 ${category.title === 'Just Pass Notes'
                                ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                                : category.type === 'collection'
                                  ? 'bg-purple-500/20 text-purple-600 dark:text-purple-400'
                                  : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                                }`}>
                                {category.title === 'Just Pass Notes' ? <Zap className="w-8 h-8" /> : (category.type === 'collection' ? <FolderOpen className="w-8 h-8" /> : <FileText className="w-8 h-8" />)}
                              </div>
                            </div>

                            <div className="mt-auto">
                              <h4 className="font-bold text-2xl text-slate-900 dark:text-white mb-3">{category.title}</h4>
                              <p className="text-base text-slate-500 dark:text-slate-400 font-medium leading-relaxed opacity-90">
                                {category.description || (category.type === 'direct_link' ? 'Open in Google Drive' : 'View collection')}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {/* LEVEL 3: RESOURCE LIST (Only for Collection Types) */}
                  {selectedCategory && (
                    <>
                      <div className="flex items-center mb-10">
                        <button onClick={goBackToCategories} className="glass-button p-4 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mr-6 transition-transform hover:scale-110">
                          <ArrowLeft className="w-6 h-6" />
                        </button>
                        <div>
                          <p className="text-xs text-poly-600 dark:text-poly-400 uppercase tracking-widest font-extrabold mb-1">Step 3</p>
                          <h3 className="text-3xl font-black text-slate-900 dark:text-white">Files</h3>
                        </div>
                      </div>

                      {selectedCategory.items && (
                        <ResourceList resources={selectedCategory.items} onView={handleViewResource} />
                      )}
                    </>
                  )}
                </div>
              )}

              {activeTab === 'videos' && (
                <div className="animate-fade-in space-y-16">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-black text-slate-800 dark:text-slate-200">Video Library</h3>
                    <span className="text-xs font-bold bg-white/60 dark:bg-slate-800/60 backdrop-blur-md text-slate-700 dark:text-slate-300 px-4 py-2 rounded-full border border-white/30 dark:border-slate-600 shadow-sm">
                      {filteredVideos.length} videos
                    </span>
                  </div>

                  {/* Theory Section: List all theory subjects */}
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-8 flex items-center">
                      <span className="bg-poly-500/20 text-poly-600 dark:text-poly-400 p-3 rounded-xl mr-4 border border-poly-500/20">
                        <Book className="w-5 h-5" />
                      </span>
                      Subject Lectures
                    </h3>

                    {theorySubjects.length > 0 ? (
                      <div className="space-y-12">
                        {theorySubjects.map(subject => (
                          <div key={subject.id} className="glass-panel p-8 rounded-[3rem]">
                            <h4 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-8 pl-6 border-l-4 border-poly-500">
                              {subject.title}
                            </h4>
                            <VideoGallery
                              videos={videosBySubject[subject.id] || []}
                              onPlay={handlePlayVideo}
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-24 glass-panel rounded-[2.5rem] border-dashed">
                        <p className="text-slate-500 italic font-medium">No theory subjects found for this semester.</p>
                      </div>
                    )}
                  </div>

                  {/* Practical Section */}
                  {practicalsWithVideos.length > 0 && (
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-8 flex items-center mt-12">
                        <span className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-3 rounded-xl mr-4 border border-emerald-500/20">
                          <Wrench className="w-5 h-5" />
                        </span>
                        Practical Demonstrations
                      </h3>
                      <div className="space-y-12">
                        {practicalsWithVideos.map(subject => (
                          <div key={subject.id} className="glass-panel p-8 rounded-[3rem]">
                            <h4 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-8 pl-6 border-l-4 border-emerald-500">
                              {subject.title}
                            </h4>
                            <VideoGallery
                              videos={videosBySubject[subject.id] || []}
                              onPlay={handlePlayVideo}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* General / Other Videos */}
                  {otherVideos.length > 0 && (
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-8 flex items-center mt-12">
                        <span className="bg-slate-500/20 text-slate-600 dark:text-slate-400 p-3 rounded-xl mr-4 border border-slate-500/20">
                          <Video className="w-5 h-5" />
                        </span>
                        General Resources
                      </h3>
                      <div className="glass-panel p-8 rounded-[3rem]">
                        <VideoGallery
                          videos={otherVideos}
                          onPlay={handlePlayVideo}
                        />
                      </div>
                    </div>
                  )}

                  {theorySubjects.length === 0 && practicalsWithVideos.length === 0 && otherVideos.length === 0 && (
                    <div className="text-center py-32 glass-panel rounded-[2.5rem] border-dashed">
                      <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full glass-button">
                        <Video className="h-10 w-10 text-slate-400 dark:text-slate-500" />
                      </div>
                      <h3 className="mt-6 text-xl font-bold text-slate-900 dark:text-slate-300">No videos available</h3>
                      <p className="mt-2 text-slate-500">Check back later for video updates.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'ai' && (
                <div className="animate-fade-in h-full">
                  <div className="mb-8">
                    <h3 className="text-2xl font-black text-slate-800 dark:text-slate-200 mb-2">Smart Study Assistant</h3>
                    <p className="text-base text-slate-500 font-medium">Ask questions about {selectedDept.name} - {selectedSemester} topics.</p>
                  </div>
                  <AITutor departmentName={selectedDept.name} semesterName={selectedSemester} />
                </div>
              )}

              <AdBanner className="mt-12" />
            </div>
          </div>
        )}
      </main>

      <footer className="glass-panel border-t-0 mt-24 py-12 transition-colors duration-300 mb-8 mx-6 sm:mx-10 rounded-[3rem] shadow-xl relative overflow-hidden group">
        <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-poly-500/10 rounded-full blur-[80px] group-hover:bg-poly-500/20 transition-colors duration-700"></div>

        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">

          {/* Left Side: Copyright & Credits */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start mb-2 group cursor-default">
              <div className="mr-3 bg-gradient-to-tr from-slate-800 to-slate-700 dark:from-white dark:to-slate-300 p-2 rounded-lg text-white dark:text-black shadow-lg">
                <Hexagon className="w-5 h-5 fill-current" />
              </div>
              <span className="font-black text-lg text-slate-900 dark:text-white tracking-tighter">
                POLLY<span className="font-light text-poly-600 dark:text-poly-400">TECHNIC</span>
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              © 2025 POLLYTECHNIC. Designed By <a href="https://mohdnihadkp.vercel.app/" target="_blank" rel="noreferrer" className="text-slate-800 dark:text-slate-200 hover:text-poly-600 dark:hover:text-poly-400 transition-colors underline decoration-dotted underline-offset-4">mohdnihadkp</a>.
            </p>
            <button
              onClick={() => setIsPrivacyOpen(true)}
              className="mt-2 text-xs text-slate-400 hover:text-poly-600 transition-colors"
            >
              Privacy Policy
            </button>
          </div>

          {/* Right Side: Navigation Links */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            {/* Contact Button */}
            <button
              onClick={() => setIsContactModalOpen(true)}
              className="glass-action-primary px-6 py-2.5 rounded-full text-sm font-bold text-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center cursor-pointer"
            >
              Contact Me
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;