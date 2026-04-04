// ==========================================
// Core Types for MyTime 3D Wall Clock Planner
// ==========================================

export interface Task {
  id: string;
  title: string;
  description: string;
  startTime: number;   // 0–24 decimal hours (e.g., 9.5 = 9:30 AM)
  endTime: number;     // 0–24 decimal hours
  color: string;       // hex color from palette
  isCompleted: boolean;
  completedAt: string | null;
}

export interface CompletionStats {
  totalTasks: number;
  completedTasks: number;
  totalHours: number;
  completedHours: number;
  percentage: number;
}

export type TaskFilter = 'all' | 'pending' | 'completed';
