import { create } from "zustand";

type ScrollState = {
  /** 0–1 progress of the Stage 1 page */
  progress: number;
  /** Raw pointer −1…1 */
  pointer: { x: number; y: number };
  /** Smoothed pointer for camera + graph (updated each frame) */
  smoothPointer: { x: number; y: number };
  sceneReady: boolean;
  setProgress: (value: number) => void;
  setPointer: (x: number, y: number) => void;
  setSmoothPointer: (x: number, y: number) => void;
  setSceneReady: (ready: boolean) => void;
};

export const useScrollStore = create<ScrollState>((set) => ({
  progress: 0,
  pointer: { x: 0, y: 0 },
  smoothPointer: { x: 0, y: 0 },
  sceneReady: false,
  setProgress: (progress) => set({ progress }),
  setPointer: (x, y) => set({ pointer: { x, y } }),
  setSmoothPointer: (x, y) => set({ smoothPointer: { x, y } }),
  setSceneReady: (sceneReady) => set({ sceneReady }),
}));
