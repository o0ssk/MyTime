'use client';

import { 
  Timer, 
  Archive, 
  Focus, 
  Clock, 
  HelpCircle, 
  User, 
  Plus 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useClockStore } from '@/store/useClockStore';

export default function ObserverSidebar() {
  const openDialog = useClockStore((s) => s.openDialog);

  return (
    <aside className="fixed left-0 top-0 h-full flex flex-col py-12 px-6 z-40 bg-slate-900/60 backdrop-blur-[24px] h-screen w-72 rounded-r-[3rem] border-r border-white/10 shadow-[20px_0_40px_rgba(0,0,0,0.3)] font-manrope font-medium text-sm tracking-widest">
      
      {/* Profil/Logo Section */}
      <div className="mt-16 mb-12 flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-surface-container-highest flex items-center justify-center mb-4 border border-outline-variant/20 shadow-lg">
          <Timer className="text-primary" size={32} strokeWidth={1} />
        </div>
        <h2 className="text-on-surface text-lg font-light tracking-[0.1em]">The Observer</h2>
        <p className="text-on-surface-muted text-[10px] uppercase mt-1 opacity-60">Time is a field.</p>
      </div>

      {/* Main Navigation */}
      <div className="flex flex-col space-y-2 flex-grow">
        <button className="flex items-center space-x-4 p-4 text-primary bg-white/5 rounded-full transition-all duration-500 group">
          <Timer size={20} strokeWidth={1.5} />
          <span className="group-active:translate-x-1">Daily Orbit</span>
        </button>
        <button className="flex items-center space-x-4 p-4 text-on-surface-muted hover:text-primary hover:bg-white/5 rounded-full transition-all duration-500 group">
          <Archive size={20} strokeWidth={1.5} />
          <span className="group-active:translate-x-1">Task Archive</span>
        </button>
        <button className="flex items-center space-x-4 p-4 text-on-surface-muted hover:text-primary hover:bg-white/5 rounded-full transition-all duration-500 group">
          <Focus size={20} strokeWidth={1.5} />
          <span className="group-active:translate-x-1">Focus Timer</span>
        </button>
        <button className="flex items-center space-x-4 p-4 text-on-surface-muted hover:text-primary hover:bg-white/5 rounded-full transition-all duration-500 group">
          <Clock size={20} strokeWidth={1.5} />
          <span className="group-active:translate-x-1">Chronometer</span>
        </button>
      </div>

      {/* Action CTA */}
      <div className="mb-8 px-4">
        <button 
          onClick={() => openDialog()}
          className="w-full metallic-silver-gradient text-on-primary font-bold py-4 rounded-xl shadow-lg shadow-primary/10 transition-transform active:scale-95 flex items-center justify-center gap-2"
        >
          <Plus size={18} strokeWidth={2.5} />
          Add Task
        </button>
      </div>

      {/* Footer Navigation */}
      <div className="flex flex-col space-y-4 pt-6 border-t border-white/5">
        <button className="flex items-center space-x-4 text-on-surface-muted hover:text-primary transition-colors">
          <HelpCircle size={18} strokeWidth={1.5} />
          <span>Support</span>
        </button>
        <button className="flex items-center space-x-4 text-on-surface-muted hover:text-primary transition-colors">
          <User size={18} strokeWidth={1.5} />
          <span>Account</span>
        </button>
      </div>
    </aside>
  );
}
