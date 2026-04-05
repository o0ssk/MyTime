// ==========================================
// TaskDialog — Add/Edit Task Modal (v3 - Ethereal)
// ==========================================

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useClockStore } from '@/store/useClockStore';
import {
  toTimeInputValue,
  TASK_COLORS,
} from '@/lib/timeUtils';

export default function TaskDialog() {
  const isDialogOpen = useClockStore((s) => s.isDialogOpen);
  const editingTask = useClockStore((s) => s.editingTask);
  const closeDialog = useClockStore((s) => s.closeDialog);
  const addTask = useClockStore((s) => s.addTask);
  const updateTask = useClockStore((s) => s.updateTask);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [selectedColor, setSelectedColor] = useState(TASK_COLORS[0]);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
      setStartTime(editingTask.startTime);
      setEndTime(editingTask.endTime);
      setSelectedColor(editingTask.color);
    } else {
      setTitle('');
      setDescription('');
      // Default to next full hour
      const now = new Date();
      const nextHour = (now.getHours() + 1) % 24;
      setStartTime(toTimeInputValue(nextHour));
      setEndTime(toTimeInputValue((nextHour + 1) % 24));
      setSelectedColor(TASK_COLORS[0]);
    }
  }, [editingTask, isDialogOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;



    if (editingTask) {
      updateTask(editingTask.id, {
        title: title.trim(),
        description: description.trim(),
        startTime: startTime,
        endTime: endTime,
        color: selectedColor,
      });
    } else {
      addTask(title.trim(), description.trim(), startTime, endTime);
    }
    closeDialog();
  };

  return (
    <AnimatePresence>
      {isDialogOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDialog}
          >
            {/* Dialog - stop propagation so clicking inside doesn't close */}
            <motion.div
              className="w-full max-w-md bg-surface-container-high/60 backdrop-blur-[48px] rounded-2xl border border-outline-variant/15 p-8 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] flex flex-col relative overflow-hidden"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleSubmit} className="flex flex-col flex-1 z-10 w-full space-y-8">
                <div>
                  <h2 className="text-xl font-manrope font-semibold text-on-surface mb-1">
                    {editingTask ? 'Edit Event' : 'New Event'}
                  </h2>
                  <p className="text-xs text-on-surface-muted font-inter uppercase tracking-widest">
                    Time block
                  </p>
                </div>

                {/* Title input */}
                <div className="flex flex-col space-y-2 group">
                  <input
                    id="task-title"
                    type="text"
                    className="w-full bg-transparent border-b border-outline-variant/30 py-2 text-lg text-on-surface font-manrope placeholder:text-on-surface-muted focus:outline-none focus:border-primary transition-colors"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter event title"
                    autoFocus
                  />
                </div>

                {/* Time range */}
                <div className="flex flex-col space-y-3">
                  <label className="text-[10px] text-on-surface-muted uppercase tracking-widest font-inter">Orbit Window</label>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <input
                        id="start-time"
                        type="time"
                        className="w-full bg-surface-container-lowest/50 backdrop-blur-md border border-outline-variant/15 rounded-lg px-4 py-2 text-sm text-on-surface font-inter focus:outline-none focus:border-primary transition-colors"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                      />
                    </div>
                    <span className="text-on-surface-muted font-manrope text-sm">—</span>
                    <div className="flex-1">
                      <input
                        id="end-time"
                        type="time"
                        className="w-full bg-surface-container-lowest/50 backdrop-blur-md border border-outline-variant/15 rounded-lg px-4 py-2 text-sm text-on-surface font-inter focus:outline-none focus:border-primary transition-colors"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Color picker */}
                {editingTask && (
                  <div className="flex flex-col space-y-3">
                    <label className="text-[10px] text-on-surface-muted uppercase tracking-widest font-inter">Spectrum</label>
                    <div className="flex items-center space-x-3">
                      {TASK_COLORS.map((c) => (
                        <button
                          key={c}
                          type="button"
                          className={`w-6 h-6 rounded-full transition-transform hover:scale-110 ${selectedColor === c ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-110' : ''}`}
                          style={{ backgroundColor: c }}
                          onClick={() => setSelectedColor(c)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Description input */}
                <div className="flex flex-col space-y-3 pt-2">
                  <textarea
                    id="task-desc"
                    className="w-full bg-transparent border-b border-outline-variant/30 py-2 text-sm text-on-surface font-inter placeholder:text-on-surface-muted focus:outline-none focus:border-primary transition-colors resize-none"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Notes (optional)"
                    rows={2}
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-4 pt-4 mt-auto">
                  <button
                    type="button"
                    className="px-6 py-2 rounded-full text-xs font-inter uppercase tracking-widest text-on-surface-muted hover:text-on-surface transition-colors"
                    onClick={closeDialog}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-full text-xs font-inter uppercase tracking-widest bg-primary text-on-primary hover:bg-primary-variant transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!title.trim()}
                  >
                    {editingTask ? 'Apply' : 'Initialize'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
