/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useState } from 'react';
import TopNav from './components/TopNav';
import SideNav from './components/SideNav';
import Clock3D from '../components/clock/Clock3D';
import TaskSidebar from './components/TaskSidebar';
import AddTaskModal from './components/AddTaskModal';
import { TaskProvider } from './context/TaskContext';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <TaskProvider>
      <div className="bg-background text-on-surface font-body selection:bg-primary/30 min-h-screen overflow-hidden flex">
        <TopNav />
        <SideNav onAddTask={() => setIsModalOpen(true)} />
        
        <main className="lg:ml-72 pt-20 min-h-screen flex flex-col lg:flex-row relative bg-gradient-to-br from-surface to-surface-dim w-full overflow-x-hidden overflow-y-auto lg:overflow-hidden">
          <div className="flex-none lg:flex-1 relative h-[50vh] lg:h-full flex items-center justify-center min-h-[350px]">
            <Clock3D />
          </div>
          <TaskSidebar onAddTask={() => setIsModalOpen(true)} />
        </main>

        {/* Visual Polish: Floating Particles / Atmospheric Gradients */}
        <div className="fixed top-1/4 -left-20 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="fixed bottom-1/4 -right-20 w-80 h-80 bg-slate-400/5 blur-[100px] rounded-full pointer-events-none"></div>
        
        <AddTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </TaskProvider>
  );
}
