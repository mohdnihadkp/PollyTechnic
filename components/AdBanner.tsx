import React, { useEffect, useRef } from 'react';
import { ADSENSE_CONFIG } from '../constants';

interface AdBannerProps {
  slot?: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  className?: string;
}

const AdBanner: React.FC<AdBannerProps> = ({ slot, format = 'auto', className = '' }) => {
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    if (!ADSENSE_CONFIG.ENABLED) return;

    // Only attempt to push the ad if window exists (client-side)
    // and AdSense script is loaded.
    try {
      if (window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      console.error('AdSense Error:', e);
    }
  }, []);

  if (!ADSENSE_CONFIG.ENABLED) return null;

  return (
    <div className={`my-8 flex justify-center ${className}`}>
      <div className="glass-panel w-full max-w-4xl p-1 rounded-2xl overflow-hidden bg-white/20 dark:bg-black/20 text-center">
        <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Advertisement</p>
        <div className="min-h-[100px] bg-white/5 flex items-center justify-center rounded-xl overflow-hidden">
          {/* Actual Google Ad Unit */}
          <ins className="adsbygoogle"
            style={{ display: 'block', width: '100%' }}
            data-ad-client={ADSENSE_CONFIG.CLIENT_ID}
            data-ad-slot={slot || ADSENSE_CONFIG.SLOT_ID}
            data-ad-format={format}
            data-full-width-responsive="true"></ins>
        </div>
      </div>
    </div>
  );
};

export default AdBanner;