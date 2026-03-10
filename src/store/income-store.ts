import { create } from "zustand";

interface IncomeState {
  // Filters
  dateRange: { from: Date | undefined; to: Date | undefined };
  groupBy: "project" | "month";
  
  // Actions
  setDateRange: (range: { from: Date | undefined; to: Date | undefined }) => void;
  setGroupBy: (groupBy: "project" | "month") => void;
  resetFilters: () => void;
}

export const useIncomeStore = create<IncomeState>((set) => ({
  dateRange: { from: undefined, to: undefined },
  groupBy: "month", // Default view grouped by month

  setDateRange: (range) => set({ dateRange: range }),
  setGroupBy: (groupBy) => set({ groupBy }),
  resetFilters: () => set({ 
    dateRange: { from: undefined, to: undefined }, 
    groupBy: "month" 
  }),
}));
