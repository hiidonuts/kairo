import { Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr } from "@react-three/drei";
import KnowledgeGraph from "./KnowledgeGraph";
import CameraRig from "./CameraRig";
import SmoothPointer from "./SmoothPointer";
import { useScrollStore } from "../store/scrollStore";
import { tokens } from "../config/tokens";

function SceneReadySignal() {
  const setSceneReady = useScrollStore((s) => s.setSceneReady);
  useEffect(() => {
    setSceneReady(true);
    return () => setSceneReady(false);
  }, [setSceneReady]);
  return null;
}

export default function SceneCanvas() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[1] bg-ivory">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0.15, 13.5], fov: 40, near: 0.1, far: 80 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
      >
        <color attach="background" args={[tokens.ivory]} />
        <Suspense fallback={null}>
          <SmoothPointer />
          <KnowledgeGraph />
          <CameraRig />
          <SceneReadySignal />
        </Suspense>
        <AdaptiveDpr />
      </Canvas>
    </div>
  );
}
