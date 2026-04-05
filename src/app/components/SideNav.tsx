/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export default function SideNav({ 
  onAddTask, 
  isOpen, 
  onClose 
}: { 
  onAddTask: () => void; 
  isOpen: boolean; 
  onClose: () => void; 
}) {
  return (
    <>
      <aside className={`h-full w-full flex flex-col py-12 px-6 glass-celestial rounded-r-xl border-none shadow-celestial font-body transition-all duration-500`}>
        <button 
          onClick={onClose}
          className="lg:hidden absolute top-6 right-6 w-10 h-10 flex items-center justify-center text-on-surface-variant hover:bg-white/5 rounded-full transition-all"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="mt-16 mb-12 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-surface-container-highest flex items-center justify-center mb-4 atmos-glow">
            <span className="material-symbols-outlined text-primary text-3xl">shutter_speed</span>
          </div>
          <h2 className="text-on-surface text-headline-md font-light tracking-[0.05em]">The Observer</h2>
          <p className="text-on-surface-variant text-label-md-caps mt-1 tracking-widest opacity-60">Time is a Field</p>
        </div>
        
        <div className="flex flex-col space-y-3 flex-grow">
          <button className="flex items-center space-x-4 p-4 text-primary bg-primary/10 rounded-full transition-all duration-500 group text-left">
            <span className="material-symbols-outlined">shutter_speed</span>
            <span className="font-medium tracking-wide group-active:translate-x-1">Daily Orbit</span>
          </button>
          <button className="flex items-center space-x-4 p-4 text-on-surface-variant hover:text-on-surface hover:bg-white/5 rounded-full transition-all duration-500 group text-left">
            <span className="material-symbols-outlined">inventory_2</span>
            <span className="font-medium tracking-wide group-active:translate-x-1">Task Archive</span>
          </button>
          <button className="flex items-center space-x-4 p-4 text-on-surface-variant hover:text-on-surface hover:bg-white/5 rounded-full transition-all duration-500 group text-left">
            <span className="material-symbols-outlined">center_focus_strong</span>
            <span className="font-medium tracking-wide group-active:translate-x-1">Focus Timer</span>
          </button>
          <button className="flex items-center space-x-4 p-4 text-on-surface-variant hover:text-on-surface hover:bg-white/5 rounded-full transition-all duration-500 group text-left">
            <span className="material-symbols-outlined">watch</span>
            <span className="font-medium tracking-wide group-active:translate-x-1">Chronometer</span>
          </button>
        </div>
        
        <div className="mb-8">
          <button onClick={() => { onAddTask(); onClose(); }} className="w-full metallic-silver-gradient text-on-primary font-bold py-4 min-h-[56px] rounded-full shadow-silver-glow transition-transform active:scale-95 text-label-md-caps">
            Add Task Arc
          </button>
        </div>
        
        <div className="flex flex-col space-y-4 pt-10">
          <button className="flex items-center space-x-4 text-on-surface-variant hover:text-on-surface transition-colors">
            <span className="material-symbols-outlined text-[20px]">help_outline</span>
            <span className="text-label-md-caps">Support</span>
          </button>
          <button className="flex items-center space-x-4 text-on-surface-variant hover:text-on-surface transition-colors">
            <span className="material-symbols-outlined text-[20px]">person</span>
            <span className="text-label-md-caps">Account</span>
          </button>
        </div>
      </aside>
    </>
  );
}
