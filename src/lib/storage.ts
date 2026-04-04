// ==========================================
// localStorage Persistence Helpers
// ==========================================

import { Task } from '@/types';

const STORAGE_KEY_PREFIX = 'mytime_v2_tasks_';

/**
 * Get the storage key for a given date
 */
function getKey(date: string): string {
  return `${STORAGE_KEY_PREFIX}${date}`;
}

/**
 * Save tasks to localStorage
 */
export function saveTasks(date: string, tasks: Task[]): void {
  try {
    localStorage.setItem(getKey(date), JSON.stringify(tasks));
  } catch (e) {
    console.error('Failed to save tasks to localStorage:', e);
  }
}

/**
 * Load tasks from localStorage
 */
export function loadTasks(date: string): Task[] {
  try {
    const data = localStorage.getItem(getKey(date));
    if (data) {
      return JSON.parse(data) as Task[];
    }
  } catch (e) {
    console.error('Failed to load tasks from localStorage:', e);
  }
  return [];
}

/**
 * Clear tasks for a given date
 */
export function clearDay(date: string): void {
  try {
    localStorage.removeItem(getKey(date));
  } catch (e) {
    console.error('Failed to clear tasks from localStorage:', e);
  }
}

/**
 * Get today's date as YYYY-MM-DD string
 */
export function getTodayString(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}
