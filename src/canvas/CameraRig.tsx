import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { camera } from "../config/motion";
import { useScrollStore } from "../store/scrollStore";

const targetPos = new THREE.Vector3();
const look = new THREE.Vector3(...camera.hero.lookAt);
const desired = new THREE.Vector3();

export default function CameraRig() {
  const { camera: cam } = useThree();
  const initialized = useRef(false);

  useFrame(() => {
    const pointer = useScrollStore.getState().smoothPointer;

    desired.set(
      camera.hero.position[0] + pointer.x * camera.parallax,
      camera.hero.position[1] + pointer.y * camera.parallax * 0.5,
      camera.hero.position[2]
    );

    if (!initialized.current) {
      cam.position.copy(desired);
      targetPos.copy(desired);
      cam.lookAt(look);
      initialized.current = true;
      return;
    }

    targetPos.lerp(desired, camera.lerp);
    cam.position.copy(targetPos);
    cam.lookAt(look);
  });

  return null;
}
