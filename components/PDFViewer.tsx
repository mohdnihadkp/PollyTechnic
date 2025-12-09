import React from 'react';
import { X } from 'lucide-react';

interface PDFViewerProps {
  url: string;
  title: string;
  onClose: () => void;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ url, title, onClose }) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-5xl h-[85vh] rounded-2xl border border-white/20 dark:border-slate-700 shadow-2xl flex flex-col overflow-hidden relative glass-panel">
        <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate pr-4">{title}</h3>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-1 bg-slate-100 dark:bg-slate-800 relative">
             <iframe 
                src={url} 
                className="w-full h-full" 
                title={title}
             >
                <p className="text-slate-900 dark:text-white p-4">Your browser does not support PDFs. <a href={url} className="text-poly-600 dark:text-poly-400 underline">Download the PDF</a>.</p>
             </iframe>
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;