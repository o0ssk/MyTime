/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useTasks } from '../context/TaskContext';

export default function AddTaskModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { addTask } = useTasks();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [color, setColor] = useState('#8B5CF6'); // Default to a nice purple
  const [durationArc, setDurationArc] = useState({ start: 0, end: 0 });

  const PRESET_COLORS = [
    { id: 'purple', value: '#8B5CF6', label: 'Mystic' },
    { id: 'blue', value: '#3B82F6', label: 'Celestial' },
    { id: 'emerald', value: '#10B981', label: 'Ethereal' },
    { id: 'rose', value: '#F43F5E', label: 'Stellar' },
    { id: 'amber', value: '#F59E0B', label: 'Solar' },
    { id: 'slate', value: '#64748B', label: 'Vesper' },
  ];

  useEffect(() => {
    // Calculate arc angles based on time (24h format to 360 degrees)
    const timeToAngle = (timeStr: string) => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return ((hours % 24) * 60 + minutes) * (360 / (24 * 60));
    };

    setDurationArc({
      start: timeToAngle(startTime),
      end: timeToAngle(endTime)
    });
  }, [startTime, endTime]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTask({ title, description, startTime, endTime, color });
    setTitle('');
    setDescription('');
    setColor('#8B5CF6');
    onClose();
  };

  const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(x, y, radius, endAngle - 90);
    const end = polarToCartesian(x, y, radius, startAngle - 90);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return [
      "M", start.x, start.y, 
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");
  };

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="glass-celestial border border-outline-variant rounded-[32px] md:rounded-[40px] w-full max-w-4xl shadow-celestial relative flex flex-col md:flex-row overflow-hidden max-h-[90vh]">
        
        {/* Left Side: Visualizer - Compact on mobile */}
        <div className="w-full md:w-1/2 p-4 md:p-12 flex flex-col items-center justify-center bg-surface-dim/40 relative min-h-[160px] md:min-h-auto shrink-0 md:border-r border-outline-variant/30">
          <div className="relative w-32 h-32 md:w-64 md:h-64 mb-4 md:mb-8 transition-all duration-500">
            {/* Background Ring */}
            <svg className="w-full h-full transform -rotate-0" viewBox="0 0 256 256">
              <circle
                cx="128"
                cy="128"
                r="110"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-outline-variant/30"
              />
              {/* Duration Arc */}
              <path
                d={describeArc(128, 128, 110, durationArc.start, durationArc.end)}
                fill="none"
                stroke="url(#silverGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                className="drop-shadow-[0_0_8px_rgba(203,213,225,0.4)]"
              />
              <defs>
                <linearGradient id="silverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#cbd5e1" />
                  <stop offset="100%" stopColor="#64748b" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Time Labels */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] md:text-label-md-caps text-on-surface-variant mb-1">Duration</span>
              <span className="text-xl md:text-4xl font-headline text-on-surface tracking-tighter">
                {Math.abs(durationArc.end - durationArc.start) / 15} <small className="text-xs md:text-lg opacity-50">hrs</small>
              </span>
            </div>
          </div>
          
          <div className="text-center space-y-1 md:space-y-2 hidden sm:block">
            <h3 className="text-sm md:text-headline-sm text-on-surface">Temporal Alignment</h3>
            <p className="text-[10px] md:text-body-md text-on-surface-variant max-w-[200px]">Define the celestial period.</p>
          </div>
        </div>

        {/* Right Side: Inputs */}
        <div className="w-full md:w-1/2 p-6 md:p-12 bg-surface flex flex-col justify-center relative overflow-y-auto max-h-[60vh] md:max-h-none">
          <button onClick={onClose} className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface transition-colors w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-all z-20 md:hidden">
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
          <button onClick={onClose} className="hidden md:flex absolute top-8 right-8 text-on-surface-variant hover:text-on-surface transition-colors w-10 h-10 items-center justify-center rounded-full hover:bg-surface-container transition-all z-20">
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>

          <h2 className="text-xl md:text-headline-md text-on-surface mb-6 md:mb-10 tracking-tight leading-none mt-2">New Task Arc</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-8">
            <div className="space-y-1">
              <label className="text-[10px] md:text-label-md-caps text-primary block">Objective Name</label>
              <input 
                required
                type="text" 
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full bg-transparent border-b border-outline-variant py-2 md:py-4 text-on-surface focus:outline-none focus:border-primary transition-all text-base md:text-xl font-body"
                placeholder="Ex. Architectural Reverie"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] md:text-label-md-caps text-primary block">Expansion</label>
              <textarea 
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full bg-transparent border-b border-outline-variant py-2 md:py-4 text-on-surface-variant focus:outline-none focus:border-primary transition-all resize-none h-12 md:h-20 font-body text-sm md:text-base"
                placeholder="Detail the atmospheric parameters..."
              />
            </div>

            <div className="flex space-x-4 md:space-x-8">
              <div className="flex-1 space-y-2">
                <label className="text-[10px] md:text-label-md-caps text-primary block">Genesis</label>
                <input 
                  required
                  type="time" 
                  value={startTime}
                  onChange={e => setStartTime(e.target.value)}
                  className="w-full bg-surface-container-high/40 rounded-xl md:rounded-2xl px-4 py-3 md:px-5 md:py-4 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary transition-all [color-scheme:dark] font-mono text-base md:text-lg"
                />
              </div>
              <div className="flex-1 space-y-2">
                <label className="text-[10px] md:text-label-md-caps text-primary block">Culmination</label>
                <input 
                  required
                  type="time" 
                  value={endTime}
                  onChange={e => setEndTime(e.target.value)}
                  className="w-full bg-surface-container-high/40 rounded-xl md:rounded-2xl px-4 py-3 md:px-5 md:py-4 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary transition-all [color-scheme:dark] font-mono text-base md:text-lg"
                />
              </div>
            </div>

            <div className="space-y-3 md:space-y-4">
              <label className="text-[10px] md:text-label-md-caps text-primary block">Aura Spectrum</label>
              <div className="flex flex-wrap gap-3 md:gap-4">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setColor(c.value)}
                    className={`group relative w-10 h-10 md:w-12 md:h-12 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 ${color === c.value ? 'ring-2 ring-primary ring-offset-4 ring-offset-surface' : ''}`}
                    style={{ backgroundColor: c.value }}
                  >
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-surface-container text-on-surface text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-outline-variant">
                      {c.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button type="submit" className="w-full metallic-silver-gradient text-on-primary font-bold py-4 md:py-5 rounded-xl md:rounded-2xl shadow-silver-glow hover:scale-[1.02] active:scale-[0.98] transition-all text-sm md:text-base tracking-[0.1em] uppercase">
                Manifest Task
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
