import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, TaskStatus, TaskCompletion } from '../types';
import { useTaskStore } from '@/store/useTaskStore';
import { getTodayString } from '@/lib/storage';

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  toggleTaskCompletion: (id: string) => void;
  getIsCompleted: (id: string) => boolean;
  deleteTask: (id: string) => void;
  clearAllCompletions: () => void;
  hoveredTaskId: string | null;
  setHoveredTaskId: (id: string | null) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const store = useTaskStore();
  const [hoveredTaskId, setHoveredTaskId] = useState<string | null>(null);
  const [today, setToday] = useState('');

  useEffect(() => {
    setToday(getTodayString());
    // Update date on midnight
    const timer = setInterval(() => {
      setToday(getTodayString());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const getIsCompleted = (id: string) => {
    const completion = store.completions.find(c => c.taskId === id && c.date === today);
    return !!completion?.isCompleted;
  };

  const updateTaskStatus = (id: string, status: TaskStatus) => {
    if (status === 'completed') {
      store.toggleTaskCompletion(id, today);
    }
    // We don't have 'status' per task anymore in the model, 
    // but we can simulate it for the UI if needed, 
    // or just use completions. For now, we'll focus on completion.
  };

  const toggleTaskCompletion = (id: string) => {
    store.toggleTaskCompletion(id, today);
  };

  return (
    <TaskContext.Provider value={{
      tasks: store.tasks,
      addTask: store.addTask,
      updateTaskStatus,
      toggleTaskCompletion,
      getIsCompleted,
      deleteTask: store.deleteTask,
      clearAllCompletions: store.clearAllCompletions,
      hoveredTaskId,
      setHoveredTaskId
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTasks must be used within a TaskProvider');
  return context;
}
