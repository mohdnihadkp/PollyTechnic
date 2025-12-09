import React, { useEffect } from 'react';
import { ADSENSE_CONFIG } from '../constants';

const AdSenseScript: React.FC = () => {
    useEffect(() => {
        if (!ADSENSE_CONFIG.ENABLED || !ADSENSE_CONFIG.CLIENT_ID) return;

        // Check if script is already present
        const existingScript = document.querySelector(`script[src*="client=${ADSENSE_CONFIG.CLIENT_ID}"]`);
        if (existingScript) return;

        const script = document.createElement('script');
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CONFIG.CLIENT_ID}`;
        script.async = true;
        script.crossOrigin = "anonymous";

        document.head.appendChild(script);

        return () => {
            // Optional: Cleanup if needed, but usually AdSense scripts persist
        };
    }, []);

    return null; // This component doesn't render anything visible
};

export default AdSenseScript;
