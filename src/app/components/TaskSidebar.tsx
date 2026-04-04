/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useTasks } from '../context/TaskContext';

export default function TaskSidebar({ onAddTask }: { onAddTask: () => void }) {
  const { tasks, toggleTaskCompletion, getIsCompleted, deleteTask } = useTasks();
  const [now, setNow] = useState<Date | null>(null);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Determine "active" task based on current time if not explicitly set
  // This makes the UI feel alive and automatic
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

  const completedTasks = tasks.filter(t => getIsCompleted(t.id));
  const remainingTasks = tasks.filter(t => !getIsCompleted(t.id));
  
  // Find which task is currently "Active" based on time
  const activeTask = remainingTasks.find(t => isTimeInRange(t.startTime, t.endTime));
  const pendingTasks = remainingTasks.filter(t => t.id !== activeTask?.id);

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

  return (
    <section className="w-full lg:w-[26rem] h-auto lg:h-full glass-celestial border-t lg:border-t-0 lg:border-l border-outline-variant p-6 lg:p-8 overflow-y-auto z-10 flex flex-col relative shadow-celestial">
      <div className="flex items-center justify-between mb-10 shrink-0">
        <h3 className="text-headline-md text-on-surface tracking-tight">Daily Orbit</h3>
        <button className="text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined">filter_list</span>
        </button>
      </div>
      
      <div className="space-y-6 flex-grow overflow-y-auto pr-2 pb-24">
        {/* Active Focus */}
        {activeTask && (
          <div className="p-6 rounded-xl bg-surface-container-highest border border-primary/20 shadow-silver-glow group transition-all relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full metallic-silver-gradient"></div>
            <div className="flex justify-between items-start mb-4">
              <span className="text-label-md-caps text-primary">CURRENT FOCUS</span>
              <span className="text-xs text-primary/80 font-mono tracking-tighter">{getRemainingTime(activeTask.endTime)} remaining</span>
            </div>
            <h4 className="text-xl font-headline font-medium text-on-surface mb-2">{activeTask.title}</h4>
            <p className="font-body text-on-surface-variant text-sm leading-relaxed mb-4">{activeTask.description}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center text-on-surface-variant text-xs">
                <span className="material-symbols-outlined text-sm mr-1">schedule</span>
                {activeTask.startTime} - {activeTask.endTime}
              </div>
              <div className="flex space-x-2">
                <button onClick={() => toggleTaskCompletion(activeTask.id)} className="h-9 w-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-all shadow-sm">
                  <span className="material-symbols-outlined text-sm">check</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Upcoming */}
        {pendingTasks.map(task => (
          <div key={task.id} className="p-6 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-all group no-line-separation">
            <div className="flex justify-between items-start mb-1">
              <h4 className="text-lg font-headline font-medium text-on-surface group-hover:text-primary transition-colors">{task.title}</h4>
              <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => toggleTaskCompletion(task.id)} className="h-8 w-8 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant hover:text-green-400 hover:border-green-400/40 transition-all">
                  <span className="material-symbols-outlined text-sm">check</span>
                </button>
                <button onClick={() => deleteTask(task.id)} className="h-8 w-8 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant hover:text-red-400 hover:border-red-400/40 transition-all">
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>
            </div>
            <p className="font-body text-on-surface-variant/80 text-sm mb-4 line-clamp-2">{task.description}</p>
            <div className="flex items-center text-on-surface-variant text-xs font-label uppercase tracking-widest">
              <span className="material-symbols-outlined text-sm mr-1.5 opacity-60">schedule</span>
              {task.startTime} - {task.endTime}
            </div>
          </div>
        ))}

        {/* Completed Tasks (Folded) */}
        <div className="pt-6 border-t border-outline-variant">
          <button 
            onClick={() => setIsArchiveOpen(!isArchiveOpen)}
            className="flex items-center justify-between w-full text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <span className="text-label-md-caps">Archive ({completedTasks.length} Completed Today)</span>
            <span className={`material-symbols-outlined transition-transform ${isArchiveOpen ? 'rotate-180' : ''}`}>expand_more</span>
          </button>
          
          {isArchiveOpen && (
            <div className="mt-4 space-y-3">
              {completedTasks.map(task => (
                <div key={task.id} className="p-4 rounded-xl bg-surface-container-lowest border border-white/5 opacity-60 flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <button onClick={() => toggleTaskCompletion(task.id)} className="text-green-400">
                      <span className="material-symbols-outlined text-sm">check_circle</span>
                    </button>
                    <div>
                      <h4 className="text-sm font-headline text-on-surface line-through">{task.title}</h4>
                      <div className="text-[10px] text-slate-500 mt-1">{task.startTime} - {task.endTime}</div>
                    </div>
                  </div>
                  <button onClick={() => deleteTask(task.id)} className="text-slate-500 hover:text-red-400">
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Contextual FAB (Only on dashboard) */}
      <button onClick={onAddTask} className="absolute bottom-10 right-10 w-16 h-16 rounded-full metallic-silver-gradient text-on-primary shadow-silver-glow flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 group">
        <span className="material-symbols-outlined text-3xl group-hover:rotate-90 transition-transform duration-500" style={{ fontVariationSettings: "'FILL' 1" }}>add</span>
      </button>
    </section>
  );
}
