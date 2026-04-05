// ==========================================
// Core Types for MyTime 3D Wall Clock Planner
// ==========================================

export interface Task {
  id: string;
  title: string;
  description: string;
  startTime: string;   // "HH:mm" format
  endTime: string;     // "HH:mm" format
  color: string;       // hex color from palette
  isCompleted?: boolean;
  completedAt?: string | null;
}

export interface CompletionStats {
  totalTasks: number;
  completedTasks: number;
  totalHours: number;
  completedHours: number;
  percentage: number;
}

export type TaskFilter = 'all' | 'pending' | 'completed';
