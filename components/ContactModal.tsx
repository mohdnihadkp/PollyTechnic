import React, { useState } from 'react';
import { X, Send, Mail, User, MessageSquare } from 'lucide-react';

interface ContactModalProps {
  onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Contact from PollyTechnic User: ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    window.location.href = `mailto:mohdnihadkp@gmail.com?subject=${subject}&body=${body}`;
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/40 dark:bg-black/60 backdrop-blur-md p-4 animate-fade-in" onClick={onClose}>
      <div 
        className="glass-panel w-full max-w-lg rounded-[2.5rem] p-8 relative shadow-2xl border border-white/40 dark:border-white/10 overflow-hidden" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background Decorative Blob */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-poly-500/10 rounded-full blur-[60px] pointer-events-none -mr-16 -mt-16"></div>

        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="mb-8 relative z-10">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Get in Touch</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Have questions or suggestions? Send me a message directly.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Your Name</label>
                <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <User className="w-5 h-5" />
                    </div>
                    <input 
                        type="text" 
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 glass-input rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-poly-500/50 font-medium"
                        placeholder="Your Name"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
                 <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <Mail className="w-5 h-5" />
                    </div>
                    <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 glass-input rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-poly-500/50 font-medium"
                        placeholder="Your E-mail"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Message</label>
                 <div className="relative">
                    <div className="absolute left-4 top-5 text-slate-400">
                        <MessageSquare className="w-5 h-5" />
                    </div>
                    <textarea 
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 glass-input rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-poly-500/50 min-h-[120px] resize-none font-medium"
                        placeholder="How can I help you?"
                    />
                </div>
            </div>

            <button 
                type="submit"
                className="w-full glass-action-primary py-4 rounded-2xl font-bold text-lg text-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center"
            >
                <Send className="w-5 h-5 mr-2" />
                Send Message
            </button>
        </form>
      </div>
    </div>
  );
};

export default ContactModal;