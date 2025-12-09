import React from 'react';
import { X } from 'lucide-react';

interface PrivacyPolicyProps {
    onClose: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-slate-900 w-full max-w-2xl max-h-[80vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-scale-in border border-white/20">

                {/* Header */}
                <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50 backdrop-blur-md">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Privacy Policy</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-500 dark:text-slate-400"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto custom-scrollbar text-slate-600 dark:text-slate-300 space-y-6 leading-relaxed">
                    <p>Last updated: {new Date().toLocaleDateString()}</p>

                    <section>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">1. Introduction</h3>
                        <p>Welcome to POLLYTECHNIC. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.</p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">2. Advertising</h3>
                        <p>We use Google AdSense to display advertisements on our website. Google uses cookies to serve ads based on your prior visits to our website or other websites.</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Google's use of advertising cookies enables it and its partners to serve ads to you based on your visit to our sites and/or other sites on the Internet.</li>
                            <li>You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noreferrer" className="text-poly-600 hover:underline">Google Ads Settings</a>.</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">3. Cookies</h3>
                        <p>We use cookies to enhance your experience. By using our website, you agree to our use of cookies. You can control and/or delete cookies as you wish.</p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">4. Contact Us</h3>
                        <p>If you have any questions about this Privacy Policy, please contact us.</p>
                    </section>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:opacity-90 transition-opacity"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
