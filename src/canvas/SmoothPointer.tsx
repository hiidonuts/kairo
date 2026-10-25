import { useFrame } from "@react-three/fiber";
import { pointerSmooth } from "../config/motion";
import { useScrollStore } from "../store/scrollStore";

/** One place that eases the raw pointer — camera and graph both read smoothPointer. */
export default function SmoothPointer() {
  useFrame(() => {
    const { pointer, smoothPointer, setSmoothPointer } = useScrollStore.getState();
    const x = smoothPointer.x + (pointer.x - smoothPointer.x) * pointerSmooth;
    const y = smoothPointer.y + (pointer.y - smoothPointer.y) * pointerSmooth;
    if (x !== smoothPointer.x || y !== smoothPointer.y) {
      setSmoothPointer(x, y);
    }
  });
  return null;
}
