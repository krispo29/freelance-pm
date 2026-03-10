import { create } from "zustand";

interface UIState {
  sidebarOpen: boolean;
  activeModal: string | null;
  
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  openModal: (modalName: string) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  activeModal: null,

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (isOpen) => set({ sidebarOpen: isOpen }),
  openModal: (modalName) => set({ activeModal: modalName }),
  closeModal: () => set({ activeModal: null }),
}));
