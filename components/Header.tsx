import React, { useState } from 'react';
import { Search, Sun, Moon, X, Menu, Home, RefreshCw, Bookmark, Hexagon, LayoutGrid, Award, School, BookOpen, ChevronRight, GraduationCap } from 'lucide-react';

interface HeaderProps {
  onHomeClick: () => void;
  isHome: boolean;
  isDarkMode: boolean;
  toggleTheme: () => void;
  onSearch: (query: string) => void;
  onSyncClick: () => void;
  onBookmarksClick: () => void;
  onScholarshipsClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  onHomeClick, 
  isHome, 
  isDarkMode, 
  toggleTheme, 
  onSearch, 
  onSyncClick,
  onBookmarksClick,
  onScholarshipsClick
}) => {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const clearSearch = () => {
    setSearchQuery('');
    onSearch('');
    setIsMobileSearchOpen(false);
  };

  const MenuItem = ({ icon: Icon, label, subLabel, onClick, disabled = false, badge }: any) => (
    <button 
        onClick={disabled ? undefined : onClick}
        className={`w-full flex items-center p-3 rounded-2xl transition-all text-left group border border-transparent ${disabled ? 'opacity-60 cursor-not-allowed' : 'hover:bg-slate-100 dark:hover:bg-white/5 hover:border-slate-200 dark:hover:border-white/10'}`}
    >
        <div className={`p-2.5 rounded-xl mr-4 transition-transform flex-shrink-0 ${disabled ? 'bg-slate-100 dark:bg-neutral-800 text-slate-400' : 'bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 group-hover:scale-110 group-hover:bg-sky-500 group-hover:text-white'}`}>
            <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
                <span className={`text-base font-bold truncate pr-2 ${disabled ? 'text-slate-400' : 'text-slate-700 dark:text-slate-200 group-hover:text-sky-600 dark:group-hover:text-sky-400'}`}>
                    {label}
                </span>
                {badge && (
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-200 dark:bg-neutral-700 text-slate-500 dark:text-slate-300 px-2 py-0.5 rounded-full flex-shrink-0">
                        {badge}
                    </span>
                )}
            </div>
            {subLabel && <p className="text-xs text-slate-400 dark:text-neutral-500 font-medium mt-0.5 truncate">{subLabel}</p>}
        </div>
        {!disabled && <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-sky-500 transition-colors ml-2 flex-shrink-0" />}
    </button>
  );

  return (
    <header className="sticky top-2 md:top-4 z-50 px-2 sm:px-8 lg:px-12 transition-all duration-300">
      <div className="glass-panel rounded-full px-3 sm:px-6 py-2.5 max-w-[1600px] mx-auto flex justify-between items-center shadow-lg shadow-black/5 dark:shadow-black/50 relative bg-white/70 dark:bg-black/70">
        
        {/* Logo Area */}
        <div 
          className={`flex items-center cursor-pointer group ${isMobileSearchOpen ? 'hidden md:flex' : 'flex'}`} 
          onClick={onHomeClick}
        >
          <div className="mr-2 md:mr-3 flex items-center justify-center">
             <div className="bg-gradient-to-br from-sky-500 to-blue-600 text-white p-2 md:p-2.5 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-500/30">
                <Hexagon className="w-5 h-5 md:w-6 md:h-6 fill-current" />
             </div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg md:text-xl font-bold tracking-tight leading-none text-slate-900 dark:text-white">
              POLLY<span className="font-light text-slate-500 dark:text-neutral-500">TECHNIC</span>
            </h1>
          </div>
        </div>
        
        {/* Desktop Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-slate-400" />
                </div>
                <input 
                    type="text" 
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full bg-slate-100 dark:bg-neutral-800/80 border border-slate-200 dark:border-neutral-700 rounded-full py-2.5 pl-10 pr-10 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all"
                    placeholder="Search subjects, videos..."
                />
                {searchQuery && (
                    <button 
                        onClick={() => { setSearchQuery(''); onSearch(''); }}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>
        </div>

        {/* Mobile Search Input */}
        {isMobileSearchOpen && (
            <div className="flex md:hidden flex-1 items-center animate-fade-in absolute inset-0 bg-white dark:bg-black rounded-full px-4 z-10 m-0 glass-panel border-none shadow-none">
                 <Search className="h-4 w-4 text-slate-400 mr-2 flex-shrink-0" />
                 <input 
                    type="text" 
                    value={searchQuery}
                    onChange={handleSearchChange}
                    autoFocus
                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-slate-900 dark:text-white placeholder-slate-400"
                    placeholder="Search..."
                 />
                 <button 
                    onClick={clearSearch}
                    className="p-2 ml-1 text-slate-400 hover:text-slate-600 dark:hover:text-white flex-shrink-0"
                 >
                    <X className="h-5 w-5" />
                 </button>
            </div>
        )}
        
        {/* Controls */}
        <div className={`flex items-center space-x-2 md:space-x-3 ${isMobileSearchOpen ? 'hidden md:flex' : 'flex'}`}>
            <button 
                onClick={() => setIsMobileSearchOpen(true)}
                className="md:hidden glass-button p-2.5 md:p-3 rounded-full hover:text-sky-500 dark:hover:text-sky-400"
                title="Search"
            >
                <Search className="w-5 h-5" />
            </button>

            <button 
              onClick={toggleTheme}
              className="glass-button p-2.5 md:p-3 rounded-full hover:text-sky-500 dark:hover:text-sky-400"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button 
              onClick={() => setIsMenuOpen(true)}
              className="glass-button p-2.5 md:p-3 rounded-full hover:text-sky-500 dark:hover:text-sky-400"
              title="Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
        </div>
      </div>

      {/* Slide-out Menu */}
      {isMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] animate-fade-in" 
            onClick={() => setIsMenuOpen(false)} 
          />
          <div className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white/95 dark:bg-black/95 backdrop-blur-2xl z-[70] shadow-2xl p-6 border-l border-white/20 flex flex-col animate-in slide-in-from-right duration-300">
             <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-2">
                    <div className="bg-sky-500 text-white p-1.5 rounded-lg">
                        <Menu className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-neutral-400">Menu</h2>
                </div>
                <button 
                  onClick={() => setIsMenuOpen(false)} 
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors text-slate-500 dark:text-neutral-400"
                >
                  <X className="w-6 h-6" />
                </button>
             </div>
             
             <nav className="flex-grow overflow-y-auto custom-scrollbar pr-2 space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 ml-2 mt-2">Study Tools</p>
                <MenuItem 
                    icon={Home} 
                    label="Home" 
                    subLabel="Main Dashboard"
                    onClick={() => { onHomeClick(); setIsMenuOpen(false); }} 
                />
                <MenuItem 
                    icon={Bookmark} 
                    label="Bookmarks" 
                    subLabel="Saved Content"
                    onClick={() => { onBookmarksClick(); setIsMenuOpen(false); }} 
                />
                <MenuItem 
                    icon={RefreshCw} 
                    label="Sync Progress" 
                    subLabel="Backup or restore data"
                    onClick={() => { onSyncClick(); setIsMenuOpen(false); }} 
                />

                <div className="h-px bg-slate-100 dark:bg-white/5 my-5 mx-2"></div>

                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 ml-2">Extras</p>
                <MenuItem 
                    icon={LayoutGrid} 
                    label="More Facilities" 
                    subLabel="Campus amenities & services" 
                    onClick={() => { /* Placeholder */ }} 
                />
                <MenuItem 
                    icon={Award} 
                    label="Scholarships" 
                    subLabel="Financial aid & grants" 
                    onClick={() => { onScholarshipsClick(); setIsMenuOpen(false); }} 
                />

                <div className="h-px bg-slate-100 dark:bg-white/5 my-5 mx-2"></div>

                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 ml-2">Future Updates</p>
                <MenuItem 
                    icon={School} 
                    label="SSLC" 
                    disabled 
                    badge="Soon" 
                    subLabel="Secondary School Leaving" 
                />
                <MenuItem 
                    icon={BookOpen} 
                    label="+1 & +2" 
                    disabled 
                    badge="Soon" 
                    subLabel="Higher Secondary Education" 
                />
             </nav>
             
             <div className="pt-6 border-t border-slate-100 dark:border-white/5 mt-auto">
                <div className="flex items-center justify-center space-x-2 text-slate-400 dark:text-neutral-500">
                    <Hexagon className="w-4 h-4" />
                    <p className="text-xs font-semibold">
                        © 2025 POLLYTECHNIC
                    </p>
                </div>
             </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;