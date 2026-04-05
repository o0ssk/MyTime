/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useUIStore } from '@/store/useUIStore';

export default function TopNav() {
  const { toggleLeftSidebar, toggleRightSidebar } = useUIStore();

  return (
    <nav className="absolute top-0 left-0 w-full z-[60] flex h-16 md:h-20 shrink-0 items-center justify-between gap-4 px-4 md:px-10 shadow-celestial backdrop-blur-3xl bg-slate-900/60 border-b border-white/5 transition-all duration-500">
      <div className="flex items-center space-x-4">
        <button 
          onClick={toggleLeftSidebar}
          className="w-12 h-12 flex items-center justify-center text-on-surface-variant hover:bg-white/5 rounded-full transition-all group"
          title="Toggle Navigation"
        >
          <span className="material-symbols-outlined text-[28px] group-active:scale-95 transition-transform">menu</span>
        </button>
        <div className="text-xl md:text-2xl text-primary font-light uppercase tracking-[0.2em] atmos-glow ml-2">MyTime</div>
      </div>

      <div className="hidden lg:flex items-center space-x-12 font-body tracking-tight font-light text-sm">
        <a className="text-primary pb-1 font-medium relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-primary after:shadow-silver-glow" href="#">Dashboard</a>
        <a className="text-on-surface-variant hover:text-primary transition-all duration-300" href="#">Analytics</a>
        <a className="text-on-surface-variant hover:text-primary transition-all duration-300" href="#">Focus Mode</a>
      </div>

      <div className="flex items-center space-x-2 md:space-x-6">
        <button 
          onClick={toggleRightSidebar}
          className="text-on-surface-variant hover:bg-white/5 w-12 h-12 md:w-10 md:h-10 flex items-center justify-center rounded-full transition-all group"
          title="Toggle Tasks"
        >
          <span className="material-symbols-outlined text-[24px] md:text-[22px] group-active:scale-95 transition-transform">view_sidebar</span>
        </button>
        <button className="text-on-surface-variant hover:bg-white/5 w-12 h-12 md:w-10 md:h-10 flex items-center justify-center rounded-full transition-all duration-300">
          <span className="material-symbols-outlined text-[24px] md:text-[22px]">notifications</span>
        </button>
        <button className="text-on-surface-variant hover:bg-white/5 w-12 h-12 md:w-10 md:h-10 flex items-center justify-center rounded-full transition-all duration-300">
          <span className="material-symbols-outlined text-[24px] md:text-[22px]">settings</span>
        </button>
        <div className="h-10 w-10 md:h-12 md:w-12 rounded-full overflow-hidden atmos-glow ring-2 ring-primary/10 hidden sm:block">
          <img 
            alt="User profile" 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJoSWDzUJuCaHL7hKepStiHvnTNPjZmliC0mzKUCBwOepBDd_IvRKXEkOnFENA0I0s3gvGurKXOq2_vplnRmJ0XW24pMp1NWJhpms8bSNX3PYHM2Wo2Gmo6ff4qA0w8bUBj3_y0v1ikXhBn561mq0_biWMMIBbMNeldJjkIyCEJy2zxjkaDkkIJ_6oIe9PISGvJREeDJ0ENsyVD1SJm1PB7Qn41mN53nLmP8OL38wicsIQaRGQmaqlkvfbJXEH5-5tFaaLlmk8CAY"
          />
        </div>
      </div>
    </nav>
  );
}
