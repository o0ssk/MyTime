'use client';

import { Bell, Settings, Search } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TopNavBar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-10 h-20 bg-slate-950/40 backdrop-blur-xl border-b border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
      {/* Logo */}
      <div className="text-2xl font-light text-primary uppercase tracking-[0.2em] font-manrope">
        MyTime
      </div>

      {/* Navigation Links */}
      <div className="hidden md:flex items-center space-x-12 font-manrope tracking-tight font-light text-sm">
        <a 
          className="text-primary border-b border-primary pb-1" 
          href="#"
        >
          Dashboard
        </a>
        <a 
          className="text-on-surface-muted hover:text-on-surface transition-all duration-300" 
          href="#"
        >
          Analytics
        </a>
        <a 
          className="text-on-surface-muted hover:text-on-surface transition-all duration-300" 
          href="#"
        >
          Focus Mode
        </a>
      </div>

      {/* Action Icons */}
      <div className="flex items-center space-x-6">
        <button className="text-on-surface-muted hover:bg-white/5 p-2 rounded-full transition-all duration-300">
          <Bell size={20} strokeWidth={1.5} />
        </button>
        <button className="text-on-surface-muted hover:bg-white/5 p-2 rounded-full transition-all duration-300">
          <Settings size={20} strokeWidth={1.5} />
        </button>
        
        {/* User Profile */}
        <div className="h-10 w-10 rounded-full border border-primary/20 overflow-hidden cursor-pointer hover:border-primary/50 transition-colors">
          <img 
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop" 
            alt="User profile" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </nav>
  );
}
