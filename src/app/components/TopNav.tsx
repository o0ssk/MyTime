/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export default function TopNav() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 lg:px-10 h-20 glass-celestial shadow-celestial">
      <div className="text-display-lg !text-xl lg:!text-2xl text-primary font-light uppercase tracking-[0.2em] atmos-glow">MyTime</div>
      <div className="hidden lg:flex items-center space-x-12 font-body tracking-tight font-light text-sm">
        <a className="text-primary pb-1 font-medium relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-primary after:shadow-silver-glow" href="#">Dashboard</a>
        <a className="text-on-surface-variant hover:text-primary transition-all duration-300" href="#">Analytics</a>
        <a className="text-on-surface-variant hover:text-primary transition-all duration-300" href="#">Focus Mode</a>
      </div>
      <div className="flex items-center space-x-6">
        <button className="text-on-surface-variant hover:bg-white/5 p-2 rounded-full transition-all duration-300">
          <span className="material-symbols-outlined text-[22px]">notifications</span>
        </button>
        <button className="text-on-surface-variant hover:bg-white/5 p-2 rounded-full transition-all duration-300">
          <span className="material-symbols-outlined text-[22px]">settings</span>
        </button>
        <div className="h-10 w-10 rounded-full overflow-hidden atmos-glow ring-2 ring-primary/10">
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
