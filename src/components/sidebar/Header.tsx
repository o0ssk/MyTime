'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useClockStore } from '@/store/useClockStore';

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');
  const completionStats = useClockStore((s) => s.completionStats);

  useEffect(() => {
    setMounted(true);
    const update = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }));
      setDateStr(now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted) return null;

  return (
    <motion.div
      className="absolute top-12 text-center w-full z-10 pointer-events-none"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <p className="label-md font-label text-primary tracking-[0.3em] uppercase mb-2">
        {dateStr}
      </p>
      <h1 className="display-lg font-headline text-on-surface font-light leading-none">
        {timeStr}
      </h1>
      
      {/* Small Orbit Progress Bar */}
      <div className="flex items-center justify-center space-x-2 mt-4">
        <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            className="h-full metallic-silver-gradient"
            initial={{ width: 0 }}
            animate={{ width: `${completionStats.percentage}%` }}
            transition={{ duration: 1.5, ease: 'circOut' }}
          />
        </div>
        <span className="text-[10px] font-label text-on-surface-muted uppercase tracking-widest opacity-60">
          {Math.round(completionStats.percentage)}% Orbit Complete
        </span>
      </div>
    </motion.div>
  );
}
