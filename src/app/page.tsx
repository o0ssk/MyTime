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
    
    // Responsive behavior: hide sidebars on small screens by default
    if (window.innerWidth < 1024) {
      setLeftSidebar(false);
      setRightSidebar(false);
    } else {
      setLeftSidebar(true);
      setRightSidebar(true);
    }
  }, [setLeftSidebar, setRightSidebar]);

  if (!mounted) return null;

  return (
    <TaskProvider>
      <main className="flex flex-col h-screen bg-surface font-body overflow-hidden relative">
        {/* Background stars/particles */}
        <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,1)_0%,rgba(0,0,0,1)_100%)] z-0" />
        
        <TopNav />
        
        <div className="flex-1 flex relative overflow-hidden mt-16 md:mt-20 z-10">
          {/* Mobile Backdrops */}
          {!isDesktop && (isLeftSidebarOpen || isRightSidebarOpen) && (
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] transition-opacity duration-500 animate-in fade-in"
              onClick={() => {
                setLeftSidebar(false);
                setRightSidebar(false);
              }}
            />
          )}

          {/* Left Sidebar (SideNav - Drawer on Mobile) */}
          <div 
            className={`transition-all duration-500 ease-in-out z-[60] ${
              isDesktop 
                ? `absolute left-0 top-0 h-full w-64 ${isLeftSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`
                : `fixed inset-y-0 left-0 w-[280px] sm:w-80 bg-surface/95 backdrop-blur-3xl border-r border-white/5 ${isLeftSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`
            }`}
          >
            <SideNav 
              onAddTask={() => setIsModalOpen(true)} 
              isOpen={isLeftSidebarOpen}
              onClose={() => setLeftSidebar(false)}
            />
          </div>
          
          {/* Main 3D Clock Container - Dynamic Margins for Centering */}
          <div 
            className="flex-1 flex justify-center items-center relative transition-all duration-500 ease-in-out overflow-hidden"
            style={{ 
              paddingLeft: (isDesktop && isLeftSidebarOpen) ? '16rem' : '0', 
              paddingRight: (isDesktop && isRightSidebarOpen) ? '24rem' : '0' 
            }}
          >
            <div className="w-full h-full flex items-center justify-center scale-[0.75] sm:scale-90 md:scale-100 transition-transform duration-700">
              <Clock3D />
            </div>
          </div>
 
          {/* Right Sidebar (TaskSidebar - Bottom Sheet on Mobile) */}
          <div 
            className={`transition-all duration-500 ease-in-out z-[60] ${
              isDesktop
                ? `absolute right-0 top-0 h-full w-96 ${isRightSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`
                : `fixed bottom-0 left-0 w-full h-[75vh] md:h-[80vh] rounded-t-[3rem] bg-surface/95 backdrop-blur-3xl border-t border-white/5 shadow-[0_-20px_100px_rgba(0,0,0,0.9)] pt-2 ${isRightSidebarOpen ? 'translate-y-0' : 'translate-y-[100%]'}`
            }`}
          >
            <TaskSidebar 
              onAddTask={() => setIsModalOpen(true)} 
              isMobile={!isDesktop}
              onClose={() => setRightSidebar(false)}
            />
          </div>
        </div>
 
        <AddTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </main>
    </TaskProvider>
  );
}
