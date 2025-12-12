import React from 'react';
import { VideoLecture } from '../types';
import { Play, Clock, Bookmark } from 'lucide-react';

interface VideoGalleryProps {
  videos: VideoLecture[];
  onPlay: (video: VideoLecture) => void;
  onToggleBookmark: (video: VideoLecture) => void;
  isBookmarked: (id: string) => boolean;
}

const VideoGallery: React.FC<VideoGalleryProps> = ({ videos, onPlay, onToggleBookmark, isBookmarked }) => {
  if (videos.length === 0) {
    return (
      <div className="text-center py-12 glass-panel rounded-2xl border-dashed border-2 border-slate-200 dark:border-neutral-800">
        <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-slate-100 dark:bg-neutral-900 mb-4">
          <Play className="h-6 w-6 text-slate-400" />
        </div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">No videos yet</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-neutral-400">Video lectures will appear here soon.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {videos.map((video) => {
        const bookmarked = isBookmarked(video.id);
        
        return (
          <div 
            key={video.id} 
            className="glass-panel rounded-[2rem] overflow-hidden hover:shadow-2xl hover:shadow-sky-500/10 hover:-translate-y-2 transition-all duration-300 group p-2 cursor-pointer flex flex-col h-full bg-white dark:bg-[#0a0a0a] relative"
            onClick={() => onPlay(video)}
          >
            {/* Bookmark Button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onToggleBookmark(video);
                }}
                className={`absolute top-5 right-5 z-30 p-2.5 rounded-full backdrop-blur-md transition-all duration-300 ${
                    bookmarked 
                    ? 'bg-white text-sky-500 shadow-lg scale-110' 
                    : 'bg-black/60 text-white/70 hover:bg-black/80 hover:text-white hover:scale-110'
                }`}
                title={bookmarked ? "Remove Bookmark" : "Bookmark Video"}
            >
                <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-current' : ''}`} />
            </button>

            <div className="relative aspect-video bg-neutral-900 overflow-hidden rounded-[1.5rem] shadow-inner">
              <img 
                src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`} 
                alt={video.title}
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 backdrop-blur-[2px]">
                 <div className="bg-white/20 backdrop-blur-md border border-white/50 text-white p-4 rounded-full shadow-xl transform scale-75 group-hover:scale-100 transition-all duration-300">
                   <Play className="w-8 h-8 fill-current ml-1" />
                 </div>
              </div>
              <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg flex items-center border border-white/10">
                <Clock className="w-3 h-3 mr-1.5 text-white/80" />
                <span className="text-xs font-bold text-white">{video.duration}</span>
              </div>
            </div>
            
            <div className="p-4 flex flex-col flex-grow justify-between">
              <div>
                <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-2 line-clamp-2 leading-snug group-hover:text-sky-500 transition-colors">
                  {video.title}
                </h4>
                <div className="flex items-center text-xs font-bold text-slate-500 dark:text-neutral-400 mb-4 bg-slate-100 dark:bg-neutral-800 self-start px-3 py-1.5 rounded-lg">
                  <span className="mr-2">By {video.instructor}</span>
                </div>
              </div>
              
              <button className="w-full py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black font-bold text-sm hover:opacity-90 transition-opacity flex items-center justify-center group-hover:translate-y-0 translate-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg">
                <Play className="w-4 h-4 mr-2 fill-current" />
                Watch Lecture
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default VideoGallery;