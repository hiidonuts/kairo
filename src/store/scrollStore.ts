import { create } from "zustand";

type ScrollState = {
  /** 0–1 how far the hero has scrolled out of view */
  progress: number;
  setProgress: (value: number) => void;
};

export const useScrollStore = create<ScrollState>((set) => ({
  progress: 0,
  setProgress: (progress) => set({ progress }),
}));
