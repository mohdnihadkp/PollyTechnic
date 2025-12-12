import React, { useState } from 'react';
import { X, ExternalLink, FolderOpen, Maximize2, Minimize2, Share2, Check, RotateCw, Loader2, FileText } from 'lucide-react';

interface DriveFolderModalProps {
  url: string;
  title: string;
  onClose: () => void;
}

const DriveFolderModal: React.FC<DriveFolderModalProps> = ({ url, title, onClose }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [key, setKey] = useState(0); // Used to force refresh iframe

  // Helper to convert standard Drive URLs to Embeddable versions
  const getEmbedUrl = (originalUrl: string) => {
    try {
      // Handle Folder: "drive.google.com/drive/folders/ID"
      if (originalUrl.includes('/folders/')) {
        const folderId = originalUrl.split('/folders/')[1]?.split('?')[0]?.split('/')[0];
        if (folderId) {
          return `https://drive.google.com/embeddedfolderview?id=${folderId}#list`;
        }
      }
      // Handle ID param: "drive.google.com/open?id=ID"
      if (originalUrl.includes('id=')) {
        const urlParams = new URLSearchParams(new URL(originalUrl).search);
        const id = urlParams.get('id');
        if (id) {
           return `https://drive.google.com/embeddedfolderview?id=${id}#list`;
        }
      }
      // Handle File View (PDFs, Docs, etc): "drive.google.com/file/d/ID/view" -> Convert to preview
      if (originalUrl.includes('/file/d/')) {
          const fileId = originalUrl.split('/file/d/')[1]?.split('/')[0];
          if (fileId) {
              return `https://drive.google.com/file/d/${fileId}/preview`;
          }
      }
      
      return originalUrl;
    } catch (e) {
      return originalUrl;
    }
  };

  const embedUrl = getEmbedUrl(url);
  const isFile = embedUrl.includes('/preview');

  const handleShare = async () => {
     if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: url
        });
      } catch (err) { console.debug(err); }
    } else {
      navigator.clipboard.writeText(url);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const toggleFullscreen = () => {
      setIsFullscreen(!isFullscreen);
  };

  const refreshIframe = () => {
      setIsLoading(true);
      setKey(prev => prev + 1);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in" onClick={onClose}>
      <div 
        className={`glass-panel flex flex-col overflow-hidden relative shadow-2xl bg-white dark:bg-black border border-black dark:border-white transition-all duration-300 ${isFullscreen ? 'w-full h-full rounded-none' : 'w-full max-w-6xl h-[85vh] rounded-[2rem]'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 md:p-5 border-b border-black/10 dark:border-white/10 bg-white/80 dark:bg-black/80 backdrop-blur-xl z-20">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className={`p-2 rounded-lg flex-shrink-0 ${isFile ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400'}`}>
                {isFile ? <FileText className="w-5 h-5" /> : <FolderOpen className="w-5 h-5" />}
            </div>
            <div className="min-w-0">
                <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white truncate pr-2">
                    {title}
                </h3>
                <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                    {isFile ? 'File Preview' : 'Google Drive Folder'}
                </p>
            </div>
          </div>
          
          <div className="flex items-center gap-1 md:gap-2">
            <button 
                onClick={refreshIframe}
                className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 transition-colors hidden sm:block"
                title="Refresh Content"
            >
                <RotateCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
             <button 
                onClick={handleShare}
                className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 transition-colors"
                title="Share Link"
            >
                {isCopied ? <Check className="w-5 h-5 text-green-500" /> : <Share2 className="w-5 h-5" />}
            </button>
             <button 
                onClick={toggleFullscreen}
                className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 transition-colors hidden sm:block"
                title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            >
                {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
            
            <div className="h-6 w-px bg-black/10 dark:bg-white/10 mx-1"></div>

            <button 
                onClick={() => window.open(url, '_blank')}
                className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 transition-colors sm:hidden"
                title="Open External"
            >
                <ExternalLink className="w-5 h-5" />
            </button>

            <button 
                onClick={() => window.open(url, '_blank')}
                className="hidden sm:flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-neutral-800 text-xs font-bold text-slate-600 dark:text-neutral-300 hover:bg-sky-500 hover:text-white dark:hover:bg-sky-500 transition-colors"
            >
                <ExternalLink className="w-3 h-3" />
                <span>Open in Drive</span>
            </button>
            <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-red-500/10 hover:text-red-500 dark:text-slate-400 transition-colors"
            >
                <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-slate-50 dark:bg-[#151515] relative w-full h-full group">
             
             {isLoading && (
                 <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-50 dark:bg-[#151515]">
                     <div className="flex flex-col items-center">
                         <Loader2 className="w-10 h-10 text-sky-500 animate-spin mb-3" />
                         <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Loading contents...</p>
                     </div>
                 </div>
             )}

             <iframe 
                key={key}
                src={embedUrl} 
                className={`w-full h-full border-0 transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                title="Google Drive Browser"
                allow="autoplay; fullscreen"
                onLoad={() => setIsLoading(false)}
             >
             </iframe>
             
             {/* Fallback info shown if iframe takes too long or fails (z-index -1) */}
             <div className="absolute inset-0 -z-10 flex flex-col items-center justify-center text-center p-8">
                 <div className="bg-slate-200 dark:bg-neutral-800 p-4 rounded-full mb-4 opacity-50">
                    <FolderOpen className="w-8 h-8 text-slate-400" />
                 </div>
                 <p className="text-slate-500 dark:text-slate-400 font-medium">Connecting to Google Drive...</p>
                 <button 
                    onClick={() => window.open(url, '_blank')}
                    className="mt-4 px-4 py-2 bg-sky-500 text-white rounded-lg text-sm font-bold"
                 >
                    Open Externally
                 </button>
             </div>
        </div>
      </div>
    </div>
  );
};

export default DriveFolderModal;