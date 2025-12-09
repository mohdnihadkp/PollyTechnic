import React from 'react';
import { Department, Subject, VideoLecture } from '../types';
import { ArrowRight, Book, Video, GraduationCap } from 'lucide-react';

interface SearchResultItem {
  type: 'dept' | 'subject' | 'video';
  item: Department | Subject | VideoLecture;
  dept?: Department;
  sem?: string;
}

interface SearchResultsProps {
  results: SearchResultItem[];
  onSelectResult: (result: SearchResultItem) => void;
  onClose: () => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ results, onSelectResult, onClose }) => {
  return (
    <div className="fixed inset-0 z-40 bg-slate-900/20 dark:bg-black/40 backdrop-blur-sm flex justify-center pt-20 px-4 animate-fade-in" onClick={onClose}>
      <div 
        className="w-full max-w-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[70vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b border-slate-200 dark:border-slate-700/50 bg-white/50 dark:bg-slate-800/50 flex justify-between items-center">
          <h3 className="font-semibold text-slate-900 dark:text-white">Search Results ({results.length})</h3>
          <button onClick={onClose} className="text-xs bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">ESC</button>
        </div>
        
        <div className="overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {results.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              No results found. Try a different keyword.
            </div>
          ) : (
            results.map((result, idx) => (
              <div 
                key={idx}
                onClick={() => onSelectResult(result)}
                className="flex items-center p-3 rounded-xl hover:bg-poly-50 dark:hover:bg-slate-800 cursor-pointer transition-colors group border border-transparent hover:border-poly-200 dark:hover:border-slate-700"
              >
                <div className={`p-2 rounded-lg mr-4 ${
                  result.type === 'dept' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                  result.type === 'subject' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' :
                  'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {result.type === 'dept' ? <GraduationCap className="w-5 h-5" /> : 
                   result.type === 'subject' ? <Book className="w-5 h-5" /> : 
                   <Video className="w-5 h-5" />}
                </div>
                
                <div className="flex-grow">
                  <h4 className="font-semibold text-slate-800 dark:text-slate-100 group-hover:text-poly-600 dark:group-hover:text-poly-400">
                    {'name' in result.item ? result.item.name : result.item.title}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {result.type === 'dept' ? 'Department' : 
                     `${result.dept?.name} • ${result.sem}`}
                  </p>
                </div>
                
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-poly-500 transition-colors" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;