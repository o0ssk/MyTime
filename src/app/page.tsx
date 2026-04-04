/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useState, useEffect } from 'react';
import TopNav from './components/TopNav';
import SideNav from './components/SideNav';
import Clock3D from '../components/clock/Clock3D';
import TaskSidebar from './components/TaskSidebar';
import AddTaskModal from './components/AddTaskModal';
import { TaskProvider } from './context/TaskContext';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <TaskProvider>
      <main className="min-h-screen bg-surface font-body overflow-x-hidden">
        {/* Background stars/particles could go here */}
        <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,1)_0%,rgba(0,0,0,1)_100%)]" />
        
        <TopNav onMenuToggle={() => setIsMenuOpen(true)} />
        
        <div className="flex flex-col lg:flex-row pt-16 md:pt-20">
          <SideNav 
            onAddTask={() => setIsModalOpen(true)} 
            isOpen={isMenuOpen}
            onClose={() => setIsMenuOpen(false)}
          />
          
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 lg:pl-80 min-h-[calc(100vh-5rem)] relative z-10 transition-all duration-500">
            <div className="w-full max-w-[1200px] flex flex-col items-center">
              {/* Clock Container */}
              <div className="w-full mb-8 md:mb-12">
                <Clock3D />
              </div>
              
              {/* Legend / Status / Mobile Task List? */}
              <div className="w-full lg:hidden mb-24">
                {/* TaskSidebar will show as a bottom sheet on mobile */}
              </div>
            </div>
          </div>

          {/* Task Sidebar - Responsive behavior (Desktop right, Mobile Bottom Sheet) */}
          <TaskSidebar onAddTask={() => setIsModalOpen(true)} />
        </div>

        <AddTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </main>
    </TaskProvider>
  );
}
