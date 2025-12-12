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
    <div className="fixed inset-0 z-40 bg-black/50 dark:bg-white/10 backdrop-blur-sm flex justify-center pt-20 px-4 animate-fade-in" onClick={onClose}>
      <div 
        className="w-full max-w-3xl bg-white dark:bg-black border border-black dark:border-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[70vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b border-black/10 dark:border-white/10 bg-white dark:bg-black flex justify-between items-center">
          <h3 className="font-semibold text-black dark:text-white">Search Results ({results.length})</h3>
          <button onClick={onClose} className="text-xs bg-black/10 dark:bg-white/10 text-black dark:text-white px-2 py-1 rounded hover:bg-black/20 dark:hover:bg-white/20 transition-colors">ESC</button>
        </div>
        
        <div className="overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {results.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              No results found. Try a different keyword.
            </div>
          ) : (
            results.map((result, idx) => (
              <div 
                key={idx}
                onClick={() => onSelectResult(result)}
                className="flex items-center p-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer transition-colors group border border-transparent hover:border-black/10 dark:hover:border-white/10"
              >
                <div className="p-2 rounded-lg mr-4 bg-black/5 dark:bg-white/10 text-black dark:text-white">
                  {result.type === 'dept' ? <GraduationCap className="w-5 h-5" /> : 
                   result.type === 'subject' ? <Book className="w-5 h-5" /> : 
                   <Video className="w-5 h-5" />}
                </div>
                
                <div className="flex-grow">
                  <h4 className="font-semibold text-black dark:text-white">
                    {'name' in result.item ? result.item.name : result.item.title}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {result.type === 'dept' ? 'Department' : 
                     `${result.dept?.name} • ${result.sem}`}
                  </p>
                </div>
                
                <ArrowRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-black dark:group-hover:text-white transition-colors" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;