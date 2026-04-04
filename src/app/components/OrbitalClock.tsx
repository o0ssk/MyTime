/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useTasks } from '../context/TaskContext';

export default function OrbitalClock() {
  const { tasks, getIsCompleted } = useTasks();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourDegrees = (hours % 12) * 30 + minutes * 0.5;
  const minuteDegrees = minutes * 6 + seconds * 0.1;

  const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formattedDate = time.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const getArcProps = (startTime: string, endTime: string, radius: number = 46) => {
    const parseTime = (timeStr: string) => {
      const [h, m] = timeStr.split(':').map(Number);
      return (h % 12) + m / 60;
    };
    
    const startH = parseTime(startTime);
    let endH = parseTime(endTime);
    if (endH < startH) endH += 12;
    
    const durationH = endH - startH;
    
    // Check if current time is within this arc (for 12h clock visualization)
    const currentH = (time.getHours() % 12) + time.getMinutes() / 60;
    const isActive = currentH >= startH && currentH < endH;
    
    const C = 2 * Math.PI * radius;
    // Add a tiny gap between tasks by subtracting a small amount from L
    const L = Math.max(0, (durationH / 12) * C - 2); 
    const offsetDeg = (startH / 12) * 360;
    const strokeDashoffset = - (offsetDeg / 360) * C;
    
    return {
      strokeDasharray: `${L} ${C}`,
      strokeDashoffset,
      isActive
    };
  };

  return (
    <div className="flex-grow flex flex-col items-center justify-center relative p-8">
      {/* Header Section */}
      <div className="absolute top-12 text-center w-full">
        <p className="font-label text-primary tracking-[0.3em] uppercase mb-2 text-xs">{formattedDate}</p>
        <h1 className="text-5xl font-headline text-on-surface font-light leading-none">{formattedTime}</h1>
        <div className="flex items-center justify-center space-x-2 mt-4">
          <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="w-3/4 h-full metallic-silver-gradient" style={{ width: '75%' }}></div>
          </div>
          <span className="text-[10px] font-label text-slate-400 uppercase tracking-widest">75% Orbit Complete</span>
        </div>
      </div>

      {/* The Clock */}
      <div className="relative w-[32rem] h-[32rem] flex items-center justify-center rounded-full clock-face-glow">
        {/* Metallic Outer Ring */}
        <div className="absolute inset-0 rounded-full border border-primary/20 shadow-[inset_0_0_20px_rgba(203,213,225,0.1)]"></div>
        <div className="absolute -inset-1 rounded-full border-[0.5px] border-primary/40"></div>
        
        {/* Main Face */}
        <div className="relative w-[28rem] h-[28rem] bg-surface-container-low rounded-full flex items-center justify-center overflow-hidden">
          {/* Glass Overlay Shine */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-30 pointer-events-none"></div>
          
          {/* Minute Ticks */}
          <div className="absolute inset-4 rounded-full">
            <div className="absolute w-full h-full">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-3 bg-primary/40"></div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-3 bg-primary/40"></div>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[1px] w-3 bg-primary/40"></div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 h-[1px] w-3 bg-primary/40"></div>
            </div>
          </div>

          {/* Task Arcs */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
            {tasks.map(task => {
              if (getIsCompleted(task.id)) return null;
              const arcProps = getArcProps(task.startTime, task.endTime);
              const { isActive, ...props } = arcProps;
              
              return (
                <circle 
                  key={task.id}
                  className={isActive ? "text-primary arc-shadow" : "text-secondary/20"}
                  cx="50" cy="50" r="46" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeLinecap="round" 
                  strokeWidth={isActive ? "1.5" : "1"}
                  {...props}
                  style={{ transition: 'all 1s ease-in-out' }}
                />
              );
            })}
          </svg>

          {/* Hour Numbers */}
          <div className="absolute inset-12 font-headline text-on-surface/40 font-light flex items-center justify-center">
            <span className="absolute top-0 text-lg">12</span>
            <span className="absolute right-0 text-lg">3</span>
            <span className="absolute bottom-0 text-lg">6</span>
            <span className="absolute left-0 text-lg">9</span>
          </div>

          {/* Hands */}
          <div className="relative w-full h-full">
            {/* Hour Hand */}
            <div 
              className="absolute top-1/2 left-1/2 w-1 h-24 bg-primary/80 -translate-x-1/2 -translate-y-full origin-bottom rounded-full transition-transform duration-1000 ease-linear"
              style={{ transform: `translateX(-50%) translateY(-100%) rotate(${hourDegrees}deg)` }}
            ></div>
            {/* Minute Hand */}
            <div 
              className="absolute top-1/2 left-1/2 w-0.5 h-36 bg-primary -translate-x-1/2 -translate-y-full origin-bottom rounded-full transition-transform duration-1000 ease-linear"
              style={{ transform: `translateX(-50%) translateY(-100%) rotate(${minuteDegrees}deg)` }}
            ></div>
            {/* Center Pin */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-primary-fixed rounded-full shadow-[0_0_10px_rgba(203,213,225,0.5)]"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
