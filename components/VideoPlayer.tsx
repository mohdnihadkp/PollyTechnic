import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ExternalLink, 
  ArrowLeft, 
  Maximize2, 
  Minimize2, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Settings,
  SkipBack,
  SkipForward,
  Loader2,
  X
} from 'lucide-react';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface VideoPlayerProps {
  youtubeId: string;
  title: string;
  onClose: () => void;
}

const formatTime = (seconds: number) => {
  if (isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({ youtubeId, title, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressInterval = useRef<number | null>(null);

  // Load YouTube API
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      
      window.onYouTubeIframeAPIReady = initializePlayer;
    } else {
      initializePlayer();
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
      if (progressInterval.current) {
        window.clearInterval(progressInterval.current);
      }
    };
  }, [youtubeId]);

  const initializePlayer = () => {
    playerRef.current = new window.YT.Player('youtube-player', {
      height: '100%',
      width: '100%',
      videoId: youtubeId,
      playerVars: {
        autoplay: 1,
        controls: 0, // Hide default controls
        modestbranding: 1,
        rel: 0,
      },
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange,
      },
    });
  };

  const onPlayerReady = (event: any) => {
    setIsLoading(false);
    setDuration(event.target.getDuration());
    event.target.playVideo();
  };

  const onPlayerStateChange = (event: any) => {
    if (event.data === window.YT.PlayerState.PLAYING) {
      setIsPlaying(true);
      startProgressTracking();
    } else {
      setIsPlaying(false);
      stopProgressTracking();
    }
  };

  const startProgressTracking = () => {
    if (progressInterval.current) clearInterval(progressInterval.current);
    progressInterval.current = window.setInterval(() => {
      if (playerRef.current && playerRef.current.getCurrentTime) {
        const current = playerRef.current.getCurrentTime();
        const total = playerRef.current.getDuration();
        setCurrentTime(current);
        setDuration(total);
        setProgress((current / total) * 100);
      }
    }, 1000);
  };

  const stopProgressTracking = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseFloat(e.target.value);
    const newTime = (newProgress / 100) * duration;
    playerRef.current.seekTo(newTime, true);
    setProgress(newProgress);
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    playerRef.current.setVolume(newVolume);
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
      playerRef.current.unMute();
    }
    if (newVolume === 0) {
      setIsMuted(true);
      playerRef.current.mute();
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      playerRef.current.unMute();
      playerRef.current.setVolume(volume || 100);
      setIsMuted(false);
    } else {
      playerRef.current.mute();
      setIsMuted(true);
    }
  };

  const changePlaybackRate = (rate: number) => {
    playerRef.current.setPlaybackRate(rate);
    setPlaybackRate(rate);
    setShowSpeedMenu(false);
  };

  const skip = (seconds: number) => {
    const newTime = currentTime + seconds;
    playerRef.current.seekTo(newTime, true);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-xl flex items-center justify-center animate-fade-in p-4 sm:p-8">
      
      {/* Main Container */}
      <div 
        ref={containerRef}
        className={`relative w-full max-w-6xl aspect-video glass-panel rounded-[2rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/10 group bg-black transition-all duration-500 ${isFullscreen ? 'rounded-none border-none' : ''}`}
      >
        
        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-slate-900">
            <Loader2 className="w-12 h-12 text-poly-500 animate-spin" />
          </div>
        )}

        {/* YouTube Iframe Container */}
        <div id="youtube-player" className="w-full h-full pointer-events-none" />

        {/* Overlay Interaction Layer (Click to Play/Pause) */}
        <div 
            className="absolute inset-0 z-0" 
            onClick={togglePlay}
        ></div>

        {/* --- CUSTOM CONTROLS OVERLAY --- */}
        <div className={`absolute inset-0 flex flex-col justify-between transition-opacity duration-300 pointer-events-none ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
          
          {/* Top Bar */}
          <div className="p-6 flex justify-between items-start bg-gradient-to-b from-black/80 to-transparent pointer-events-auto">
            <div className="flex flex-col">
                <h3 className="text-white font-bold text-lg drop-shadow-md line-clamp-1">{title}</h3>
                <span className="text-white/60 text-xs font-medium">YouTube Integration</span>
            </div>
            <button 
              onClick={onClose}
              className="glass-button p-2 rounded-full text-white hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/50 transition-all transform hover:rotate-90"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Center Play Button (Visible only when paused/hovering) */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
             {!isPlaying && !isLoading && (
                 <div className="glass-panel p-6 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl animate-pulse-slow">
                     <Play className="w-10 h-10 text-white fill-current ml-1" />
                 </div>
             )}
          </div>

          {/* Bottom Controls Bar */}
          <div className="p-4 sm:p-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent pointer-events-auto">
            
            {/* Progress Bar */}
            <div className="relative group/progress h-2 w-full bg-white/20 rounded-full mb-4 cursor-pointer">
                <div 
                    className="absolute top-0 left-0 h-full bg-poly-500 rounded-full shadow-[0_0_15px_rgba(14,165,233,0.8)]" 
                    style={{ width: `${progress}%` }}
                >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg scale-0 group-hover/progress:scale-100 transition-transform"></div>
                </div>
                <input
                    type="range"
                    min="0"
                    max="100"
                    step="0.1"
                    value={progress}
                    onChange={handleSeek}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
            </div>

            <div className="flex items-center justify-between">
              
              {/* Left Controls */}
              <div className="flex items-center space-x-4">
                <button onClick={togglePlay} className="text-white hover:text-poly-400 transition-colors">
                  {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current" />}
                </button>

                <div className="flex items-center space-x-2 text-white/80">
                    <button onClick={() => skip(-10)} className="hover:text-white transition-colors p-1"><SkipBack className="w-5 h-5" /></button>
                    <button onClick={() => skip(10)} className="hover:text-white transition-colors p-1"><SkipForward className="w-5 h-5" /></button>
                </div>

                {/* Volume */}
                <div 
                    className="relative flex items-center group/vol"
                    onMouseEnter={() => setShowVolumeSlider(true)}
                    onMouseLeave={() => setShowVolumeSlider(false)}
                >
                    <button onClick={toggleMute} className="text-white hover:text-poly-400 mr-2">
                        {isMuted || volume === 0 ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ${showVolumeSlider ? 'w-24 opacity-100' : 'w-0 opacity-0'}`}>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={isMuted ? 0 : volume}
                            onChange={handleVolumeChange}
                            className="w-20 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-poly-500"
                        />
                    </div>
                </div>

                <span className="text-xs font-mono font-bold text-white/70 bg-black/40 px-2 py-1 rounded-md border border-white/10">
                    {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              {/* Right Controls */}
              <div className="flex items-center space-x-3">
                
                {/* Speed Control */}
                <div className="relative">
                    <button 
                        onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                        className="flex items-center space-x-1 text-white hover:text-poly-400 transition-colors px-2 py-1 rounded-lg hover:bg-white/10"
                    >
                        <Settings className="w-5 h-5" />
                        <span className="text-xs font-bold">{playbackRate}x</span>
                    </button>
                    
                    {showSpeedMenu && (
                        <div className="absolute bottom-full right-0 mb-3 glass-panel !bg-black/80 !backdrop-blur-xl rounded-xl overflow-hidden flex flex-col min-w-[100px] shadow-2xl border-white/10 animate-fade-in-up">
                            {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                                <button
                                    key={rate}
                                    onClick={() => changePlaybackRate(rate)}
                                    className={`px-4 py-2 text-sm text-left hover:bg-white/20 transition-colors ${playbackRate === rate ? 'text-poly-400 font-bold bg-white/10' : 'text-white'}`}
                                >
                                    {rate}x
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <button 
                    onClick={toggleFullscreen}
                    className="text-white hover:text-poly-400 transition-colors p-2 hover:bg-white/10 rounded-lg"
                >
                    {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                </button>
                
                <button 
                  onClick={() => window.open(`https://www.youtube.com/watch?v=${youtubeId}`, '_blank')}
                  className="text-white hover:text-poly-400 transition-colors p-2 hover:bg-white/10 rounded-lg"
                  title="Watch on YouTube"
                >
                  <ExternalLink className="w-5 h-5" />
                </button>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default VideoPlayer;