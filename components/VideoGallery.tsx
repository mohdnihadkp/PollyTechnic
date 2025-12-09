import React from 'react';
import { VideoLecture } from '../types';
import { Play, Clock, User } from 'lucide-react';

interface VideoGalleryProps {
  videos: VideoLecture[];
  onPlay: (video: VideoLecture) => void;
}

const VideoGallery: React.FC<VideoGalleryProps> = ({ videos, onPlay }) => {
  if (videos.length === 0) {
    return (
      <div className="text-center py-12 glass-panel rounded-2xl border-dashed">
        <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full glass-button mb-4">
          <Play className="h-6 w-6 text-slate-400 dark:text-slate-500" />
        </div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">No videos yet</h3>
        <p className="mt-1 text-sm text-slate-500">Video lectures will appear here soon.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {videos.map((video) => (
        <div 
          key={video.id} 
          className="glass-panel rounded-[2rem] overflow-hidden hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group p-2 cursor-pointer flex flex-col h-full bg-opacity-40 dark:bg-opacity-40"
          onClick={() => onPlay(video)}
        >
          <div className="relative aspect-video bg-black overflow-hidden rounded-[1.5rem] shadow-lg">
            <img 
              src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`} 
              alt={video.title}
              className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
               <div className="bg-white/20 backdrop-blur-md p-4 rounded-full text-white shadow-xl transform scale-75 group-hover:scale-100 transition-all duration-300 border border-white/40 ring-1 ring-white/20">
                 <Play className="w-8 h-8 fill-current ml-1" />
               </div>
            </div>
            <div className="absolute bottom-3 right-3 glass-panel px-2.5 py-1 rounded-lg flex items-center !bg-black/60 !border-white/10">
              <Clock className="w-3 h-3 mr-1.5 text-white" />
              <span className="text-xs font-bold text-white">{video.duration}</span>
            </div>
          </div>
          
          <div className="p-4 flex flex-col flex-grow justify-between">
            <div>
              <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-2 line-clamp-2 leading-snug">
                {video.title}
              </h4>
              <div className="flex items-center text-xs font-bold text-slate-500 dark:text-slate-400 mb-4 bg-slate-100/50 dark:bg-slate-800/50 self-start px-3 py-1.5 rounded-lg inline-block border border-black/5 dark:border-white/5">
                <User className="w-3 h-3 mr-1.5 inline" />
                {video.instructor}
              </div>
            </div>
            
            <div className="mt-auto pt-3">
               <button className="glass-button w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200 group-hover:text-white group-hover:bg-poly-600 dark:group-hover:bg-poly-600 transition-colors flex items-center justify-center">
                 <Play className="w-3 h-3 mr-2" /> Watch Now
               </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VideoGallery;