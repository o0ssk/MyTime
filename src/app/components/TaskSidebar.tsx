/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useTasks } from '../context/TaskContext';

export default function TaskSidebar({ 
  onAddTask, 
  isMobile, 
  onClose 
}: { 
  onAddTask: () => void, 
  isMobile?: boolean, 
  onClose?: () => void 
}) {
  const { tasks, toggleTaskCompletion, getIsCompleted, deleteTask, clearAllCompletions } = useTasks();
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState<Date | null>(null);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Determine "active" task based on current time
  const isTimeInRange = (startStr: string, endStr: string) => {
    if (!now) return false;
    const [sH, sM] = startStr.split(':').map(Number);
    const [eH, eM] = endStr.split(':').map(Number);
    const currentH = now.getHours();
    const currentM = now.getMinutes();
    const startTime = sH * 60 + sM;
    const endTime = eH * 60 + eM;
    const currentTime = currentH * 60 + currentM;
    return currentTime >= startTime && currentTime < endTime;
  };

  const getRemainingTime = (endTimeStr: string) => {
    if (!now) return '--:--:--';
    const [hours, minutes] = endTimeStr.split(':').map(Number);
    const end = new Date(now);
    end.setHours(hours, minutes, 0, 0);
    const diff = end.getTime() - now.getTime();
    if (diff <= 0) return '00:00:00';
    const h = Math.floor(diff / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);
    if (h > 0) return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const completedTasks = tasks.filter(t => getIsCompleted(t.id));
  const remainingTasks = tasks.filter(t => !getIsCompleted(t.id));
  const progress = tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0;
  
  // Find which task is currently "Active" based on time
  const activeTask = remainingTasks.find(t => isTimeInRange(t.startTime, t.endTime));
  const pendingTasks = remainingTasks.filter(t => t.id !== activeTask?.id);

  return (
    <section 
      className={`h-full w-full relative backdrop-blur-3xl bg-slate-900/60 p-4 md:p-6 lg:p-8 overflow-hidden flex flex-col shadow-celestial transition-all duration-500 ${isMobile ? 'border-none' : 'border-l border-outline-variant rounded-l-[3rem]'}`}
    >
      {/* Mobile Bottom Sheet Handle */}
      {isMobile && (
        <div className="w-full flex justify-center mb-6 shrink-0">
          <div 
            className="w-16 h-1.5 bg-silver-300/30 rounded-full cursor-pointer hover:bg-silver-300/50 transition-colors shadow-inner"
            onClick={onClose}
          />
        </div>
      )}

      <div className="flex items-center justify-between mb-6 md:mb-10 shrink-0">
        <h3 className="text-xl md:text-headline-md text-on-surface tracking-tight">Daily Orbit</h3>
        <div className="flex items-center space-x-1 md:space-x-2">
          {isMobile && (
            <button 
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 text-on-surface-variant transition-colors"
            >
              <span className="material-symbols-outlined text-[24px]">expand_more</span>
            </button>
          )}
           <button 
            onClick={(e) => {
              e.stopPropagation();
              if(confirm("Reset all progress for today? Definitions will remain.")) {
                clearAllCompletions();
              }
            }}
            title="Reset Today's Progress"
            className="w-10 h-10 md:w-9 md:h-9 flex items-center justify-center rounded-full hover:bg-white/5 text-on-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined text-[20px] md:text-[20px]">restart_alt</span>
          </button>
          <button className="w-10 h-10 md:w-9 md:h-9 flex items-center justify-center rounded-full hover:bg-white/5 text-on-surface-variant transition-colors">
            <span className="material-symbols-outlined text-[20px] md:text-[20px]">filter_list</span>
          </button>
        </div>
      </div>
      
      {/* Progress Metric */}
      <div className="mb-6 md:mb-10 p-4 md:p-5 rounded-2xl bg-surface-container-low border border-white/5 shrink-0 transition-opacity duration-300">
        <div className="flex justify-between items-end mb-3">
          <span className="text-xs md:text-label-md-caps text-on-surface-variant">Celestial Progress</span>
          <span className="text-lg md:text-xl font-headline text-primary">
            {mounted ? completedTasks.length : 0} 
            <small className="text-[10px] md:text-xs text-on-surface-variant opacity-60"> / {tasks.length} ARCS</small>
          </span>
        </div>
        <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
          <div 
            className="h-full metallic-silver-gradient shadow-silver-glow transition-all duration-1000 ease-out"
            style={{ width: `${mounted ? progress : 0}%` }}
          ></div>
        </div>
      </div>
      
      <div className="space-y-4 md:space-y-6 flex-grow overflow-y-auto pr-2 pb-32 invisible-scrollbar">
        {/* Active Focus */}
        {activeTask && (
          <div className="p-4 md:p-6 rounded-xl bg-surface-container-highest border border-primary/20 shadow-silver-glow group transition-all relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full metallic-silver-gradient"></div>
            <div className="flex justify-between items-start mb-3 md:mb-4">
              <span className="text-[10px] md:text-label-md-caps text-primary">CURRENT FOCUS</span>
              <span className="text-[10px] md:text-xs text-primary/80 font-mono tracking-tighter">{getRemainingTime(activeTask.endTime)} remaining</span>
            </div>
            <h4 className="text-lg md:text-xl font-headline font-medium text-on-surface mb-1 md:mb-2">{activeTask.title}</h4>
            <p className="font-body text-on-surface-variant text-sm leading-relaxed mb-4 line-clamp-2 md:line-clamp-none">{activeTask.description}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center text-on-surface-variant text-[11px] md:text-xs">
                <span className="material-symbols-outlined text-sm mr-1">schedule</span>
                {activeTask.startTime} - {activeTask.endTime}
              </div>
              <div className="flex space-x-2">
                <button onClick={() => toggleTaskCompletion(activeTask.id)} className="h-10 w-10 md:h-9 md:w-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-all">
                  <span className="material-symbols-outlined text-sm">check</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Upcoming */}
        {pendingTasks.map(task => (
          <div key={task.id} className="p-4 md:p-6 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-all group no-line-separation">
            <div className="flex justify-between items-start mb-1">
              <h4 className="text-base md:text-lg font-headline font-medium text-on-surface group-hover:text-primary transition-colors">{task.title}</h4>
              <div className="flex space-x-2 md:space-x-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => toggleTaskCompletion(task.id)} className="h-10 w-10 md:h-8 md:w-8 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant hover:text-green-400 hover:border-green-400/40 transition-all">
                  <span className="material-symbols-outlined text-sm">check</span>
                </button>
                <button onClick={() => deleteTask(task.id)} className="h-10 w-10 md:h-8 md:w-8 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant hover:text-red-400 hover:border-red-400/40 transition-all">
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>
            </div>
            <p className="font-body text-on-surface-variant/80 text-sm mb-3 md:mb-4 line-clamp-2">{task.description}</p>
            <div className="flex items-center text-on-surface-variant text-[10px] md:text-xs font-label uppercase tracking-widest">
              <span className="material-symbols-outlined text-sm mr-1.5 opacity-60">schedule</span>
              {task.startTime} - {task.endTime}
            </div>
          </div>
        ))}

        {/* Archive Sector */}
        <div className="pt-6 border-t border-outline-variant">
          <button 
            onClick={() => setIsArchiveOpen(!isArchiveOpen)}
            className="flex items-center justify-between w-full text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <span className="text-[10px] md:text-label-md-caps">Archive Sector ({mounted ? completedTasks.length : 0} completed)</span>
            <span className={`material-symbols-outlined text-sm md:text-base transition-transform ${isArchiveOpen ? 'rotate-180' : ''}`}>expand_more</span>
          </button>
          
          {mounted && isArchiveOpen && (
            <div className="mt-4 space-y-2 md:space-y-3">
              {completedTasks.length === 0 && (
                <p className="text-[10px] text-center text-on-surface-variant opacity-40 py-4">No completed arcs yet.</p>
              )}
              {completedTasks.map(task => (
                <div key={task.id} className="p-3 md:p-4 rounded-xl bg-surface-container-lowest border border-white/5 opacity-60 flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <button onClick={() => toggleTaskCompletion(task.id)} className="text-green-400">
                      <span className="material-symbols-outlined text-sm">check_circle</span>
                    </button>
                    <div>
                      <h4 className="text-xs md:text-sm font-headline text-on-surface line-through">{task.title}</h4>
                      <div className="text-[8px] md:text-[10px] text-slate-500 mt-0.5">{task.startTime} - {task.endTime}</div>
                    </div>
                  </div>
                  <button onClick={() => deleteTask(task.id)} className="text-on-surface-variant/60 hover:text-red-400 transition-colors">
                    <span className="material-symbols-outlined text-xs md:text-sm">delete</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Component */}
      <div className="absolute bottom-6 md:bottom-10 right-6 md:right-10 flex flex-col items-center space-y-4 transition-opacity duration-500">
        <button onClick={onAddTask} className="w-14 h-14 md:w-16 md:h-16 rounded-full metallic-silver-gradient text-on-primary shadow-silver-glow flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 group">
          <span className="material-symbols-outlined text-2xl md:text-3xl group-hover:rotate-90 transition-transform duration-500" style={{ fontVariationSettings: "'FILL' 1" }}>add</span>
        </button>
      </div>
    </section>
  );
}
