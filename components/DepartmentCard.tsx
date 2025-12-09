import React from 'react';
import { Department } from '../types';
import { ArrowRight } from 'lucide-react';

interface DepartmentCardProps {
  department: Department;
  onClick: (dept: Department) => void;
}

const DepartmentCard: React.FC<DepartmentCardProps> = ({ department, onClick }) => {
  return (
    <div 
      onClick={() => onClick(department)}
      className="group glass-button p-8 cursor-pointer rounded-[3rem] transition-all duration-500 relative overflow-hidden h-full flex flex-col justify-between hover:!scale-[1.03] !border-opacity-50 !bg-opacity-30 dark:!bg-opacity-20"
    >
      <div className={`absolute -top-32 -right-32 w-80 h-80 ${department.color} opacity-20 filter blur-[100px] rounded-full transition-transform group-hover:scale-150 duration-700 pointer-events-none`}></div>
      
      <div>
        <div className="flex items-start justify-between mb-8 relative z-10">
            <div className={`p-5 rounded-2xl ${department.color} bg-opacity-20 backdrop-blur-md shadow-lg ring-1 ring-white/20 dark:ring-white/10`}>
                <div className="text-slate-900 dark:text-white transform group-hover:scale-110 transition-transform duration-300">
                    {department.icon}
                </div>
            </div>
        </div>

        <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-poly-500 group-hover:to-blue-600 transition-colors relative z-10 leading-tight tracking-tight">
            {department.name}
        </h3>
        <p className="text-base text-slate-600 dark:text-slate-300 mb-8 leading-relaxed relative z-10 font-medium opacity-90">
            {department.description}
        </p>
      </div>

      <div className="glass-panel !bg-white/40 dark:!bg-black/20 rounded-2xl py-3 px-6 flex items-center justify-between text-sm font-bold text-slate-700 dark:text-slate-200 group-hover:text-poly-600 dark:group-hover:text-white transition-colors relative z-10 w-full shadow-none border-none ring-1 ring-white/20">
        <span>Explore Subjects</span>
        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
};

export default DepartmentCard;