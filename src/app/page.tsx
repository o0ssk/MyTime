'use client';

import React, { useState, useEffect } from 'react';
import TopNav from './components/TopNav';
import SideNav from './components/SideNav';
import Clock3D from '../components/clock/Clock3D';
import TaskSidebar from './components/TaskSidebar';
import AddTaskModal from './components/AddTaskModal';
import { TaskProvider } from './context/TaskContext';
import { useUIStore } from '@/store/useUIStore';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const { isLeftSidebarOpen, isRightSidebarOpen, setLeftSidebar, setRightSidebar } = useUIStore();

  useEffect(() => {
    setMounted(true);
    
    // Default open state for large screens
    if (window.innerWidth >= 1280) {
      setLeftSidebar(true);
      setRightSidebar(true);
    } else {
      setLeftSidebar(false);
      setRightSidebar(false);
    }
  }, [setLeftSidebar, setRightSidebar]);

  if (!mounted) return null;

  return (
    <TaskProvider>
      <main className="relative h-screen w-screen bg-surface font-body overflow-hidden">
        {/* Deep Field Background */}
        <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,1)_0%,rgba(0,0,0,1)_100%)] z-0" />
        
        {/* Floating Top Header - Fixed/Absolute across full width */}
        <div className="absolute top-0 left-0 w-full z-50">
          <TopNav />
        </div>

        {/* 
          CENTRAL CLOCK CONTAINER
          - absolute inset-0 fills the entire viewport
          - Ensure it's under the nav and sidebars (z-0)
          - No dynamic margins or padding to prevent clipping
        */}
        <div className="absolute inset-0 flex justify-center items-center z-0 overflow-visible">
          {/* Internal container to allow scaling beyond parent if needed */}
          <div className="w-full h-full flex items-center justify-center scale-100 sm:scale-100 transition-transform duration-1000 ease-out">
            <Clock3D />
          </div>
        </div>

        {/* LATER MOBILE BACKDROP */}
        {!isDesktop && (isLeftSidebarOpen || isRightSidebarOpen) && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[55] animate-in fade-in"
            onClick={() => {
              setLeftSidebar(false);
              setRightSidebar(false);
            }}
          />
        )}

        {/* LEFT NAV DRAWER - Absolute on desktop / Fixed on mobile */}
        <div 
          className={`transition-all duration-500 ease-in-out z-[60] bg-surface/60 backdrop-blur-3xl border-r border-white/5 ${
            isDesktop 
              ? `fixed left-0 top-1/2 -translate-y-1/2 h-[85vh] w-72 rounded-r-[3rem] ${isLeftSidebarOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`
              : `fixed inset-y-0 left-0 w-[280px] sm:w-80 shadow-2xl ${isLeftSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`
          }`}
        >
          <SideNav 
            onAddTask={() => setIsModalOpen(true)} 
            isOpen={isLeftSidebarOpen}
            onClose={() => setLeftSidebar(false)}
          />
        </div>
        
        {/* RIGHT TASK SIDEBAR (Drawer/Overlay) */}
        <div 
          className={`transition-all duration-500 ease-in-out z-[60] bg-surface/60 backdrop-blur-3xl border-l border-white/5 ${
            isDesktop
              ? `fixed right-0 top-1/2 -translate-y-1/2 h-[85vh] w-[26rem] rounded-l-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] ${isRightSidebarOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`
              : `fixed bottom-0 left-0 w-full h-[75vh] md:h-[80vh] rounded-t-[3rem] border-t shadow-[0_-20px_100px_rgba(0,0,0,0.9)] ${isRightSidebarOpen ? 'translate-y-0' : 'translate-y-full'}`
          }`}
        >
          <TaskSidebar 
            onAddTask={() => setIsModalOpen(true)} 
            isMobile={!isDesktop}
            onClose={() => setRightSidebar(false)}
          />
        </div>

        <AddTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        
        {/* Mobile Sidebar Toggle Buttons if collapsed */}
        {!isDesktop && !isLeftSidebarOpen && !isRightSidebarOpen && (
           <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex gap-4 z-40">
             {/* Note: In a real app we'd have trigger icons here, but TopNav already has them. */}
           </div>
        )}
      </main>
    </TaskProvider>
  );
}
