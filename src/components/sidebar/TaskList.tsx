// ==========================================
// TaskList — All Tasks Sorted by Time (v3)
// ==========================================

'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useClockStore } from '@/store/useClockStore';
import TaskItem from './TaskItem';

export default function TaskList() {
  const tasks = useClockStore((s) => s.tasks);
  const filter = useClockStore((s) => s.filter);

  // Apply filter
  const filteredTasks = tasks.filter((t) => {
    if (filter === 'pending') return !t.isCompleted;
    if (filter === 'completed') return t.isCompleted;
    return true;
  });

  // Sort by start time
  const sortedTasks = [...filteredTasks].sort(
    (a, b) => a.startTime - b.startTime
  );

  return (
    <div className="flex-1 overflow-y-auto px-6 pb-20 space-y-1">
      <AnimatePresence mode="popLayout">
        {sortedTasks.length === 0 && (
          <motion.div
            className="flex flex-col items-center justify-center py-20 px-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-4xl mb-4 opacity-30">✨</div>
            <p className="text-sm font-manrope text-on-surface-muted leading-relaxed">
              {filter === 'all'
                ? 'Your orbit is clear. Add an event to begin tracking.'
                : filter === 'pending'
                ? 'No orbiting tasks.'
                : 'No archived tasks.'}
            </p>
          </motion.div>
        )}
        {sortedTasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </AnimatePresence>
    </div>
  );
}
