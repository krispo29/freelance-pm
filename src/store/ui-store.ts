import { create } from "zustand";
import { persist } from "zustand/middleware";

type Language = "en" | "th";

interface UIState {
  sidebarOpen: boolean;
  activeModal: string | null;
  language: Language;
  
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  openModal: (modalName: string) => void;
  closeModal: () => void;
  setLanguage: (lang: Language) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: false,
      activeModal: null,
      language: "th", // Default to Thai

      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (isOpen) => set({ sidebarOpen: isOpen }),
      openModal: (modalName) => set({ activeModal: modalName }),
      closeModal: () => set({ activeModal: null }),
      setLanguage: (lang) => set({ language: lang }),
    }),
    {
      name: "ui-storage",
      partialize: (state) => ({ language: state.language }),
    }
  )
);
