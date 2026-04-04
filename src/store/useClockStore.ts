// ==========================================
// Zustand Store — Clock State Management (v2)
// ==========================================

'use client';

import { create } from 'zustand';
import { Task, CompletionStats, TaskFilter } from '@/types';
import { generateId, getNextColor, getTaskDuration } from '@/lib/timeUtils';
import { saveTasks, loadTasks, getTodayString } from '@/lib/storage';

interface ClockState {
  // State
  tasks: Task[];
  hoveredTaskId: string | null;
  isDialogOpen: boolean;
  editingTask: Task | null;
  filter: TaskFilter;
  currentDate: string;

  // Computed
  completionStats: CompletionStats;

  // Actions
  addTask: (title: string, description: string, startTime: number, endTime: number) => void;
  updateTask: (taskId: string, updates: Partial<Pick<Task, 'title' | 'description' | 'startTime' | 'endTime' | 'color'>>) => void;
  deleteTask: (taskId: string) => void;
  toggleTaskComplete: (taskId: string) => void;
  setHoveredTask: (id: string | null) => void;
  setFilter: (filter: TaskFilter) => void;
  openDialog: (task?: Task) => void;
  closeDialog: () => void;
  initializeFromStorage: () => void;
}

function computeStats(tasks: Task[]): CompletionStats {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.isCompleted).length;

  let totalHours = 0;
  let completedHours = 0;

  tasks.forEach((t) => {
    const duration = getTaskDuration(t.startTime, t.endTime);
    totalHours += duration;
    if (t.isCompleted) completedHours += duration;
  });

  totalHours = Math.round(totalHours * 10) / 10;
  completedHours = Math.round(completedHours * 10) / 10;

  const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return { totalTasks, completedTasks, totalHours, completedHours, percentage };
}

export const useClockStore = create<ClockState>((set, get) => ({
  // Initial state
  tasks: [],
  hoveredTaskId: null,
  isDialogOpen: false,
  editingTask: null,
  filter: 'all',
  currentDate: getTodayString(),
  completionStats: computeStats([]),

  // Initialize from localStorage
  initializeFromStorage: () => {
    const date = getTodayString();
    let tasks = loadTasks(date);

    // Silver Edition Migration: Remap old vibrant colors to the new silver palette
    const oldToNewMap: Record<string, string> = {
      '#F59E0B': '#cbd5e1', // Amber -> Silver
      '#E9C349': '#f8fafc', // Gold -> Bright Silver
      '#6366F1': '#71717a', // Indigo -> Glacier Slate (New)
      '#EC4899': '#64748b', // Pink -> Steel
      '#3B82F6': '#475569', // Blue -> Lead
      '#EF4444': '#0ea5e9', // Red -> Sky Blue (Cool Accent)
    };

    let hasChanged = false;
    tasks = tasks.map(t => {
      const newColor = oldToNewMap[t.color.toUpperCase()];
      if (newColor) {
        hasChanged = true;
        return { ...t, color: newColor };
      }
      return t;
    });

    if (hasChanged) {
      saveTasks(date, tasks);
    }

    set({ tasks, currentDate: date, completionStats: computeStats(tasks) });
  },

  // Add a new task
  addTask: (title, description, startTime, endTime) => {
    const tasks = get().tasks;
    const newTask: Task = {
      id: generateId(),
      title,
      description,
      startTime,
      endTime,
      color: getNextColor(tasks.length),
      isCompleted: false,
      completedAt: null,
    };
    const updated = [...tasks, newTask];
    set({ tasks: updated, completionStats: computeStats(updated) });
    saveTasks(get().currentDate, updated);
  },

  // Update an existing task
  updateTask: (taskId, updates) => {
    const tasks = get().tasks.map((t) =>
      t.id === taskId ? { ...t, ...updates } : t
    );
    set({ tasks, completionStats: computeStats(tasks) });
    saveTasks(get().currentDate, tasks);
  },

  // Delete a task
  deleteTask: (taskId) => {
    const tasks = get().tasks.filter((t) => t.id !== taskId);
    set({ tasks, completionStats: computeStats(tasks) });
    saveTasks(get().currentDate, tasks);
  },

  // Toggle task completion
  toggleTaskComplete: (taskId) => {
    const tasks = get().tasks.map((t) =>
      t.id === taskId
        ? {
            ...t,
            isCompleted: !t.isCompleted,
            completedAt: !t.isCompleted ? new Date().toISOString() : null,
          }
        : t
    );
    set({ tasks, completionStats: computeStats(tasks) });
    saveTasks(get().currentDate, tasks);
  },

  // Hover
  setHoveredTask: (id) => set({ hoveredTaskId: id }),

  // Filter
  setFilter: (filter) => set({ filter }),

  // Dialog
  openDialog: (task) => {
    set({ isDialogOpen: true, editingTask: task || null });
  },
  closeDialog: () => {
    set({ isDialogOpen: false, editingTask: null });
  },
}));
