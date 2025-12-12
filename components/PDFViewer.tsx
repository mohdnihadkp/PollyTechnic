import React, { useState } from 'react';
import { X, Share2, Check } from 'lucide-react';

interface PDFViewerProps {
  url: string;
  title: string;
  onClose: () => void;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ url, title, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Check out this study material: ${title}`,
          url: url
        });
      } catch (err) {
        console.debug('Share cancelled or failed:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 dark:bg-black/90 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-white dark:bg-black w-full max-w-5xl h-[85vh] rounded-2xl border border-black dark:border-white shadow-2xl flex flex-col overflow-hidden relative glass-panel">
        <div className="flex justify-between items-center p-4 border-b border-black/10 dark:border-white/10 bg-white dark:bg-black backdrop-blur-xl">
          <h3 className="text-lg font-bold text-black dark:text-white truncate pr-4">{title}</h3>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors relative"
              title="Share Link"
              aria-label="Share Link"
            >
              {copied ? <Check className="w-6 h-6 text-green-500" /> : <Share2 className="w-6 h-6" />}
            </button>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
              title="Close"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        <div className="flex-1 bg-gray-100 dark:bg-black relative">
             <iframe 
                src={url} 
                className="w-full h-full" 
                title={title}
             >
                <p className="text-black dark:text-white p-4">Your browser does not support PDFs. <a href={url} className="text-blue-600 dark:text-blue-400 underline">Download the PDF</a>.</p>
             </iframe>
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;