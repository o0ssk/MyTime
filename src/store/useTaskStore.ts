/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Task, TaskCompletion, TaskState } from '@/app/types';

interface TaskStore extends TaskState {
  // Actions
  addTask: (task: Omit<Task, 'id'>) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (taskId: string, date: string) => void;
  getTaskCompletion: (taskId: string, date: string) => TaskCompletion | undefined;
  resetCompletionsForDate: (date: string) => void;
  clearAllCompletions: () => void;
}

const TASK_COLORS = [
  '#94a3b8', // Slate
  '#cbd5e1', // Silver
  '#64748b', // Steel
  '#475569', // Lead
  '#334155', // Charcoal Slate
  '#1e293b', // Deep Navy Slate
  '#0ea5e9', // Sky (Cool Accent)
  '#71717a', // Glacier Slate
  '#f8fafc', // Bright Silver
  '#e2e8f0', // Muted Silver
];

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [
        {
          id: '1',
          title: 'Deep Work: UI Architecture',
          description: 'Refining the orbital mechanics and glassmorphic depth for the centerpiece.',
          startTime: '09:00',
          endTime: '11:00',
          color: '#cbd5e1'
        },
        {
          id: '2',
          title: 'Client Synchronization',
          description: 'Reviewing Q4 timeline and milestone delivery.',
          startTime: '11:30',
          endTime: '12:30',
          color: '#94a3b8'
        },
        {
          id: '3',
          title: 'Cognitive Reset',
          description: 'Unstructured time for reflection and environmental recalibration.',
          startTime: '13:00',
          endTime: '14:00',
          color: '#71717a'
        }
      ],
      completions: [],

      addTask: (taskData) => {
        const id = Math.random().toString(36).substring(2, 11);
        const color = taskData.color || TASK_COLORS[get().tasks.length % TASK_COLORS.length];
        const newTask: Task = { ...taskData, id, color };
        set((state) => ({
          tasks: [...state.tasks, newTask].sort((a, b) => a.startTime.localeCompare(b.startTime))
        }));
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
          completions: state.completions.filter((c) => c.taskId !== id)
        }));
      },

      toggleTaskCompletion: (taskId, date) => {
        set((state) => {
          const index = state.completions.findIndex(
            (c) => c.taskId === taskId && c.date === date
          );

          if (index >= 0) {
            const newCompletions = [...state.completions];
            const current = newCompletions[index];
            newCompletions[index] = {
              ...current,
              isCompleted: !current.isCompleted,
              completedAt: !current.isCompleted ? new Date().toISOString() : undefined
            };
            return { completions: newCompletions };
          } else {
            const newCompletion: TaskCompletion = {
              taskId,
              date,
              isCompleted: true,
              completedAt: new Date().toISOString()
            };
            return { completions: [...state.completions, newCompletion] };
          }
        });
      },

      getTaskCompletion: (taskId, date) => {
        return get().completions.find((c) => c.taskId === taskId && c.date === date);
      },

      resetCompletionsForDate: (date) => {
        set((state) => ({
          completions: state.completions.filter((c) => c.date !== date)
        }));
      },
      
      clearAllCompletions: () => {
        set({ completions: [] });
      }
    }),
    {
      name: 'mytime-task-storage',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') {
          return localStorage;
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
    }
  )
);
