import React, { useState } from 'react';
import { X, Send, Mail, User, MessageSquare, AlertCircle } from 'lucide-react';

interface ContactModalProps {
  onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Feedback from PollyTechnic User: ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nFeedback/Message:\n${message}`);
    window.location.href = `mailto:mohdnihadkp@gmail.com?subject=${subject}&body=${body}`;
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 dark:bg-white/10 backdrop-blur-md p-4 animate-fade-in" onClick={onClose}>
      <div 
        className="glass-panel w-full max-w-lg rounded-[2rem] p-6 md:p-8 relative shadow-2xl border border-black dark:border-white overflow-hidden bg-white dark:bg-black max-h-[90vh] overflow-y-auto" 
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 md:top-6 md:right-6 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 transition-colors z-50 cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="mb-6 md:mb-8 relative z-10">
            <h2 className="text-2xl md:text-3xl font-black text-black dark:text-white mb-2 tracking-tight">Feedback</h2>
            <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 font-medium">
              Found a bug, have a feature request, or just want to say hi? Your feedback improves the app!
            </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6 relative z-10">
            <div className="space-y-2">
                <label className="text-sm font-bold text-black dark:text-white ml-1">Your Name</label>
                <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <User className="w-5 h-5" />
                    </div>
                    <input 
                        type="text" 
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 md:py-4 glass-input rounded-2xl text-black dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white font-medium border border-black/10 dark:border-white/20 text-sm md:text-base"
                        placeholder="Your Name"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-bold text-black dark:text-white ml-1">Email Address</label>
                 <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <Mail className="w-5 h-5" />
                    </div>
                    <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 md:py-4 glass-input rounded-2xl text-black dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white font-medium border border-black/10 dark:border-white/20 text-sm md:text-base"
                        placeholder="your@email.com"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-bold text-black dark:text-white ml-1">Message</label>
                 <div className="relative">
                    <div className="absolute left-4 top-5 text-gray-400">
                        <MessageSquare className="w-5 h-5" />
                    </div>
                    <textarea 
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 md:py-4 glass-input rounded-2xl text-black dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white min-h-[120px] resize-none font-medium border border-black/10 dark:border-white/20 text-sm md:text-base"
                        placeholder="Tell me what you think..."
                    />
                </div>
            </div>

            <button 
                type="submit"
                className="w-full bg-black dark:bg-white text-white dark:text-black py-3.5 md:py-4 rounded-2xl font-bold text-base md:text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center"
            >
                <Send className="w-5 h-5 mr-2" />
                Send Feedback
            </button>
            
            <p className="text-center text-xs text-gray-400 dark:text-gray-500 font-medium mt-4">
               Direct email: mohdnihadkp@gmail.com
            </p>
        </form>
      </div>
    </div>
  );
};

export default ContactModal;