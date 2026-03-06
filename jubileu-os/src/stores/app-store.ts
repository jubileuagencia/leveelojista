import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  // Sidebar
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Client filter
  activeClientId: string | null;
  setActiveClient: (id: string | null) => void;

  // View preferences
  taskViewMode: 'list' | 'kanban';
  setTaskViewMode: (mode: 'list' | 'kanban') => void;

  // Theme
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      activeClientId: null,
      setActiveClient: (id) => set({ activeClientId: id }),

      taskViewMode: 'kanban',
      setTaskViewMode: (mode) => set({ taskViewMode: mode }),

      theme: 'dark',
      setTheme: (theme) => set({ theme }),
    }),
    { name: 'jubileu-os-prefs' }
  )
);
