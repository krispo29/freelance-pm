import { create } from "zustand";
import { Project, ProjectStatus } from "@/types";

interface ProjectState {
  // State
  projects: Project[];
  selectedProjectId: string | null;
  filterStatus: ProjectStatus | "all";
  searchQuery: string;

  // Actions
  setProjects: (projects: Project[]) => void;
  setSelectedProject: (id: string | null) => void;
  setFilterStatus: (status: ProjectStatus | "all") => void;
  setSearchQuery: (query: string) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  selectedProjectId: null,
  filterStatus: "all",
  searchQuery: "",

  setProjects: (projects) => set({ projects }),
  setSelectedProject: (id) => set({ selectedProjectId: id }),
  setFilterStatus: (status) => set({ filterStatus: status }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
