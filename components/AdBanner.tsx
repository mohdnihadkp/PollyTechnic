import React, { useEffect, useRef, useState } from 'react';
import { ADSENSE_CONFIG } from '../constants';

interface AdBannerProps {
  slot?: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  className?: string;
}

const AdBanner: React.FC<AdBannerProps> = ({ slot = ADSENSE_CONFIG.SLOT_ID, format = 'auto', className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isPushed = useRef(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isActive = true;

    // Recursive function to check for width before pushing the ad
    const pushAd = () => {
      if (!isActive) return;

      try {
        if (isPushed.current) return;

        // Ensure window.adsbygoogle is available and container has width
        if (window.adsbygoogle && containerRef.current && containerRef.current.offsetWidth > 0) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          isPushed.current = true;
        } else {
          // If width is 0 or script not ready, retry in 300ms
          setTimeout(pushAd, 300);
        }
      } catch (e) {
        console.error('AdSense Error:', e);
        setHasError(true);
      }
    };

    // Initial delay to allow layout to paint
    const timer = setTimeout(pushAd, 100);

    return () => {
      isActive = false;
      clearTimeout(timer);
    };
  }, []);

  if (hasError) return null;

  return (
    <div className={`my-8 flex justify-center ${className} animate-fade-in`}>
      <div className="relative w-full max-w-4xl group">
        {/* Floating Label for better UX/Transparency */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-slate-200 dark:bg-slate-800 rounded-full border border-white/20 shadow-sm z-10">
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            Sponsored
          </span>
        </div>

        <div className="glass-panel p-1 rounded-2xl overflow-hidden bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-white/5">
          <div
            ref={containerRef}
            className="min-h-[120px] bg-white/50 dark:bg-white/5 flex items-center justify-center rounded-xl overflow-hidden w-full backdrop-blur-sm"
          >
            <ins className="adsbygoogle"
              style={{ display: 'block', width: '100%' }}
              data-ad-client={ADSENSE_CONFIG.CLIENT_ID}
              data-ad-slot={slot}
              data-ad-format={format}
              data-full-width-responsive="true"></ins>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdBanner;