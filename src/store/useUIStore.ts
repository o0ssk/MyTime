import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  isLeftSidebarOpen: boolean;
  isRightSidebarOpen: boolean;
  toggleLeftSidebar: () => void;
  toggleRightSidebar: () => void;
  setLeftSidebar: (open: boolean) => void;
  setRightSidebar: (open: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isLeftSidebarOpen: true,
      isRightSidebarOpen: true,
      toggleLeftSidebar: () => set((state) => ({ isLeftSidebarOpen: !state.isLeftSidebarOpen })),
      toggleRightSidebar: () => set((state) => ({ isRightSidebarOpen: !state.isRightSidebarOpen })),
      setLeftSidebar: (open: boolean) => set({ isLeftSidebarOpen: open }),
      setRightSidebar: (open: boolean) => set({ isRightSidebarOpen: open }),
    }),
    {
      name: 'mytime-ui-storage',
    }
  )
);
