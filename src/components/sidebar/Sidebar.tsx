// ==========================================
// Sidebar — Main Sidebar Container (v3 - The Ethereal Observer)
// ==========================================

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProgressPanel from './ProgressPanel';
import TaskList from './TaskList';
import { useClockStore } from '@/store/useClockStore';
import { TaskFilter } from '@/types';
import { Plus } from 'lucide-react';

const FILTERS: { key: TaskFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Orbiting' },
  { key: 'completed', label: 'Archived' },
];

export default function Sidebar() {
  const [mounted, setMounted] = useState(false);
  const openDialog = useClockStore((s) => s.openDialog);
  const filter = useClockStore((s) => s.filter);
  const setFilter = useClockStore((s) => s.setFilter);
  const totalTasks = useClockStore((s) => s.completionStats.totalTasks);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <aside className="absolute right-0 w-[420px] h-full" style={{ opacity: 0 }} />;

  return (
    <>
      <motion.aside
        className="relative w-[26rem] h-full glass-sidebar border-l border-white/5 p-8 flex flex-col overflow-hidden"
        initial={{ x: 40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25, delay: 0.2 }}
      >
        {/* Header Section */}
        <div className="flex items-center justify-between mb-10">
          <h3 className="headline-md font-headline text-on-surface">Daily Orbit</h3>
          <button className="text-slate-400 hover:text-on-surface transition-colors">
            <span className="material-symbols-outlined">filter_list</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto -mx-2 px-2 scrollbar-hide">
          <TaskList />
        </div>
      </motion.aside>

      {/* Contextual FAB (matches design) */}
      <motion.button
        className="fixed bottom-10 right-10 w-16 h-16 rounded-full metallic-silver-gradient text-on-primary shadow-[0_10px_40px_rgba(203,213,225,0.3)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-50 pointer-events-auto"
        onClick={() => openDialog()}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Plus size={32} strokeWidth={3} />
      </motion.button>
    </>
  );
}
