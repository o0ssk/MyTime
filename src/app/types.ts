/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TaskStatus = 'pending' | 'in-progress' | 'completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  startTime: string; // "HH:mm" format
  endTime: string;   // "HH:mm" format
  color: string;
}

export interface TaskCompletion {
  taskId: string;
  date: string; // "YYYY-MM-DD"
  isCompleted: boolean;
  completedAt?: string; // ISO string
}

export interface TaskState {
  tasks: Task[];
  completions: TaskCompletion[];
}
