import React, { useState } from 'react';
import { Search, Sun, Moon, X, Menu, Home, Mail, Hexagon, Zap } from 'lucide-react';

interface HeaderProps {
  onHomeClick: () => void;
  isHome: boolean;
  isDarkMode: boolean;
  toggleTheme: () => void;
  onSearch: (query: string) => void;
  onContactClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onHomeClick, isHome, isDarkMode, toggleTheme, onSearch, onContactClick }) => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
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
    setIsSearchExpanded(false);
  };

  return (
    <header className="sticky top-6 z-50 mx-4 sm:mx-8 lg:mx-12 transition-all duration-300">
      <div className="glass-panel rounded-full px-4 sm:px-6 py-3 max-w-[1600px] mx-auto flex justify-between items-center">
        
        {/* Logo Area */}
        <div 
          className="flex items-center cursor-pointer group" 
          onClick={onHomeClick}
        >
          <div className="relative mr-3 flex items-center justify-center">
             <div className="absolute inset-0 bg-poly-500 blur-lg opacity-40 group-hover:opacity-60 transition-opacity"></div>
             <div className="relative bg-gradient-to-tr from-slate-900 to-slate-800 dark:from-white dark:to-slate-200 text-white dark:text-black p-2 rounded-xl group-hover:rotate-12 transition-transform duration-500">
                <Hexagon className="w-6 h-6 fill-current" />
                <Zap className="w-3 h-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-poly-500 dark:text-blue-600" />
             </div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter leading-none group-hover:tracking-wide transition-all duration-300">
              POLLY<span className="text-poly-600 dark:text-poly-400 font-light">TECHNIC</span>
            </h1>
          </div>
        </div>
        
        {/* Controls */}
        <div className="flex items-center space-x-3">
            {/* Search Bar */}
            <div className={`relative flex items-center transition-all duration-500 ease-in-out ${isSearchExpanded ? 'w-full absolute right-0 left-0 px-4 sm:static sm:w-80' : 'w-auto'}`}>
              {isSearchExpanded ? (
                <div className="flex items-center w-full glass-panel rounded-full px-4 py-2 shadow-2xl">
                    <Search className="w-4 h-4 text-slate-500 dark:text-slate-400 mr-2" />
                    <input 
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      placeholder="Search..."
                      autoFocus
                      className="w-full bg-transparent border-none focus:ring-0 text-sm text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                    />
                    <button 
                      onClick={clearSearch}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 ml-2 p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                </div>
              ) : (
                <button 
                  onClick={() => setIsSearchExpanded(true)}
                  className="glass-button p-3 rounded-full text-slate-600 dark:text-slate-300 hover:text-poly-600 dark:hover:text-white"
                  title="Search"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Theme Toggle */}
            {!isSearchExpanded && (
              <button 
              onClick={toggleTheme}
              className="glass-button p-3 rounded-full text-slate-600 dark:text-slate-300 hover:text-amber-500 dark:hover:text-yellow-300"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            )}

            {/* Menu Toggle for Slider */}
            {!isSearchExpanded && (
                <button 
                  onClick={() => setIsMenuOpen(true)}
                  className="glass-button p-3 rounded-full text-slate-600 dark:text-slate-300 hover:text-poly-600 dark:hover:text-white"
                  title="Menu"
                >
                  <Menu className="w-5 h-5" />
                </button>
            )}
        </div>
      </div>

      {/* Slide-out Menu (Slider) */}
      {isMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] animate-fade-in" 
            onClick={() => setIsMenuOpen(false)} 
          />
          <div className="fixed top-0 right-0 h-full w-80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl z-[70] shadow-2xl p-6 border-l border-white/20 flex flex-col animate-in slide-in-from-right duration-300">
             <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">Menu</h2>
                <button 
                  onClick={() => setIsMenuOpen(false)} 
                  className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400"
                >
                  <X className="w-6 h-6" />
                </button>
             </div>
             
             <nav className="space-y-6 flex-grow">
                <button 
                  onClick={() => { onHomeClick(); setIsMenuOpen(false); }}
                  className="w-full flex items-center p-4 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-left group"
                >
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl mr-4 group-hover:scale-110 transition-transform">
                        <Home className="w-6 h-6" />
                    </div>
                    <span className="text-lg font-bold text-slate-800 dark:text-slate-200 group-hover:text-poly-600 dark:group-hover:text-white transition-colors">Home</span>
                </button>

                <button 
                  onClick={() => { onContactClick(); setIsMenuOpen(false); }}
                  className="w-full flex items-center p-4 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-left group"
                >
                    <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl mr-4 group-hover:scale-110 transition-transform">
                        <Mail className="w-6 h-6" />
                    </div>
                    <span className="text-lg font-bold text-slate-800 dark:text-slate-200 group-hover:text-poly-600 dark:group-hover:text-white transition-colors">Contact Me</span>
                </button>
             </nav>
             
             <div className="pt-6 border-t border-slate-200 dark:border-slate-700/50">
                <p className="text-xs font-semibold text-center text-slate-400 dark:text-slate-500">
                    © 2025 POLLYTECHNIC
                </p>
             </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;