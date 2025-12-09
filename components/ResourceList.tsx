import React from 'react';
import { Resource } from '../types';
import { FileText, Link as LinkIcon, ExternalLink, Eye } from 'lucide-react';

interface ResourceListProps {
  resources: Resource[];
  onView: (resource: Resource) => void;
}

const ResourceList: React.FC<ResourceListProps> = ({ resources, onView }) => {
  if (resources.length === 0) {
    return (
      <div className="text-center py-12 glass-panel rounded-2xl border-dashed">
        <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full glass-button mb-4">
          <FileText className="h-6 w-6 text-slate-400 dark:text-slate-500" />
        </div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">No resources available</h3>
        <p className="mt-1 text-sm text-slate-500">Check back later.</p>
      </div>
    );
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="w-5 h-5" />;
      case 'link': return <LinkIcon className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-4">
      {resources.map((resource) => (
        <div 
          key={resource.id} 
          onClick={() => resource.type === 'pdf' ? onView(resource) : window.open(resource.url, '_blank')}
          className="glass-button rounded-2xl p-4 flex items-center justify-between group cursor-pointer text-left w-full hover:bg-white/80 dark:hover:bg-white/10"
        >
          <div className="flex items-center space-x-5">
            <div className={`p-3.5 rounded-xl shadow-lg border border-white/20 ${
              resource.type === 'pdf' 
                ? 'bg-red-500/20 text-red-600 dark:text-red-400' 
                : 'bg-blue-500/20 text-blue-600 dark:text-blue-400'
            }`}>
              {getIcon(resource.type)}
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 group-hover:text-poly-600 dark:group-hover:text-poly-400 transition-colors">{resource.title}</h4>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5 uppercase tracking-wide opacity-80">
                 {resource.type === 'pdf' ? 'PDF Document' : 'External Link'}
              </p>
            </div>
          </div>
          
          <div className="bg-white/20 dark:bg-white/5 p-2 rounded-lg text-slate-400 group-hover:text-poly-600 dark:group-hover:text-white transition-colors">
            {resource.type === 'pdf' ? <Eye className="w-5 h-5" /> : <ExternalLink className="w-5 h-5" />}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResourceList;