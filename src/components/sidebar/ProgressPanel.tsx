// ==========================================
// ProgressPanel — Daily Completion Stats (v3 - Ethereal)
// ==========================================

'use client';

import { useClockStore } from '@/store/useClockStore';
import { motion } from 'framer-motion';

export default function ProgressPanel() {
  const stats = useClockStore((s) => s.completionStats);

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset =
    circumference - (stats.percentage / 100) * circumference;

  return (
    <div className="flex flex-col px-8 py-6 bg-transparent">
      {/* Circular progress */}
      <div className="flex items-center justify-center relative mb-6">
        <svg width="110" height="110" viewBox="0 0 100 100" className="drop-shadow-[0_0_15px_rgba(203,213,225,0.1)]">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="rgba(255,255,255,0.03)"
            strokeWidth="6"
          />
          {/* Progress circle */}
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="url(#progressGradientV3)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            transform="rotate(-90 50 50)"
          />
          <defs>
            <linearGradient
              id="progressGradientV3"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="var(--color-primary)" />
              <stop offset="100%" stopColor="var(--color-primary-variant)" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute flex flex-col items-center">
          <motion.span
            className="text-2xl font-bold text-on-surface font-manrope"
            key={stats.percentage}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            {stats.percentage}%
          </motion.span>
          <span className="text-[10px] text-on-surface-muted uppercase tracking-[0.08em] font-inter">Orbit</span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-4 gap-2">
        <div className="flex flex-col items-center px-1 py-3 bg-surface-container-lowest/40 rounded-xl transition-colors hover:bg-surface-container-lowest">
          <span className="text-[17px] font-bold text-on-surface font-manrope mb-0.5">{stats.completedTasks}</span>
          <span className="text-[9px] text-on-surface-muted uppercase tracking-wider font-inter">Done</span>
        </div>
        <div className="flex flex-col items-center px-1 py-3 bg-surface-container-lowest/40 rounded-xl transition-colors hover:bg-surface-container-lowest">
          <span className="text-[17px] font-bold text-on-surface font-manrope mb-0.5">
            {stats.totalTasks - stats.completedTasks}
          </span>
          <span className="text-[9px] text-on-surface-muted uppercase tracking-wider font-inter">Pending</span>
        </div>
        <div className="flex flex-col items-center px-1 py-3 bg-surface-container-lowest/40 rounded-xl transition-colors hover:bg-surface-container-lowest">
          <span className="text-[17px] font-bold text-primary font-manrope mb-0.5 drop-shadow-[0_0_8px_rgba(248,250,252,0.3)]">{stats.completedHours}h</span>
          <span className="text-[9px] text-primary/70 uppercase tracking-wider font-inter">Tracked</span>
        </div>
        <div className="flex flex-col items-center px-1 py-3 bg-surface-container-lowest/40 rounded-xl transition-colors hover:bg-surface-container-lowest">
          <span className="text-[17px] font-bold text-on-surface-muted font-manrope mb-0.5">{stats.totalHours}h</span>
          <span className="text-[9px] text-on-surface-muted uppercase tracking-wider font-inter">Planned</span>
        </div>
      </div>
    </div>
  );
}
