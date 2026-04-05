// ==========================================
// TaskItem — Single Task Row (v3 - The Ethereal Observer)
// ==========================================

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Task } from '@/types';
import { useClockStore } from '@/store/useClockStore';
import { formatTime, getTaskDuration, parseTimeInput } from '@/lib/timeUtils';
import { CheckCircle2, Circle, Edit2, Trash2 } from 'lucide-react';

interface TaskItemProps {
  task: Task;
}

export default function TaskItem({ task }: TaskItemProps) {
  const toggleTaskComplete = useClockStore((s) => s.toggleTaskComplete);
  const deleteTask = useClockStore((s) => s.deleteTask);
  const openDialog = useClockStore((s) => s.openDialog);
  const setHoveredTask = useClockStore((s) => s.setHoveredTask);

  const [now, setNow] = useState(0);

  useEffect(() => {
    const update = () => {
      const d = new Date();
      setNow(d.getHours() + d.getMinutes() / 60);
    };
    update();
    const t = setInterval(update, 60000);
    return () => clearInterval(t);
  }, []);

  const start = parseTimeInput(task.startTime);
  const end = parseTimeInput(task.endTime);

  const isActive = !task.isCompleted && 
    (end >= start ? (now >= start && now <= end) : (now >= start || now <= end));

  return (
    <motion.div
      className={`group relative p-6 mb-6 rounded-xl transition-all cursor-pointer border ${
        isActive 
          ? 'bg-surface-container-highest border-primary/20 shadow-xl hover:bg-surface-container-highest/80' 
          : 'bg-surface-container-low border-white/5 hover:bg-surface-container-high'
      } ${task.isCompleted ? 'opacity-50 grayscale select-none pointer-events-none' : ''}`}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: task.isCompleted ? 0.4 : 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      onMouseEnter={() => setHoveredTask(task.id)}
      onMouseLeave={() => setHoveredTask(null)}
      onClick={() => !task.isCompleted && openDialog(task)}
    >
      <div className="flex justify-between items-start mb-4">
        <span className={`label-md font-label tracking-widest ${isActive ? 'text-primary' : 'text-on-surface-muted opacity-60'}`}>
          {isActive ? 'CURRENT FOCUS' : 'UPCOMING'}
        </span>
        {isActive && (
          <span className="text-[10px] text-primary/60 font-inter">In Orbit</span>
        )}
      </div>

      <h4 className={`text-lg font-headline font-medium mb-2 transition-colors ${isActive ? 'text-on-surface' : 'text-on-surface group-hover:text-primary'}`}>
        {task.title}
      </h4>

      {task.description && (
        <p className="body-lg text-on-surface-muted text-sm leading-relaxed mb-4 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center text-on-surface-muted text-xs font-inter gap-2">
          <span className="material-symbols-outlined text-sm">schedule</span>
          {formatTime(parseTimeInput(task.startTime))} — {formatTime(parseTimeInput(task.endTime))}
        </div>

        {!isActive && !task.isCompleted && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
             <button 
              className="h-8 w-8 rounded-full border border-white/10 flex items-center justify-center text-on-surface-muted hover:text-primary hover:border-primary/40 transition-all font-inter"
              onClick={(e) => { e.stopPropagation(); toggleTaskComplete(task.id); }}
            >
              <span className="material-symbols-outlined text-sm">check</span>
            </button>
            <button 
              className="h-8 w-8 rounded-full border border-white/10 flex items-center justify-center text-on-surface-muted hover:text-[#ffb4ab] hover:border-[#ffb4ab]/40 transition-all font-inter"
              onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
            >
              <span className="material-symbols-outlined text-sm">delete</span>
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
