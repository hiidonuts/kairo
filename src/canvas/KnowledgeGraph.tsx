import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as d3 from "d3";
import * as THREE from "three";
import { graph } from "../config/motion";
import { tokens } from "../config/tokens";
import { useScrollStore } from "../store/scrollStore";
import { buildGraph, FOCUS_NODE_ID, type GraphNode } from "./graphData";

type SimNode = GraphNode & d3.SimulationNodeDatum;
type SimLink = d3.SimulationLinkDatum<SimNode> & { source: SimNode; target: SimNode };

const tempObj = new THREE.Object3D();
const tempColor = new THREE.Color();
const charcoal = new THREE.Color(tokens.charcoal);
const maroon = new THREE.Color(tokens.maroon);

type Display = { x: number; y: number; z: number };

export default function KnowledgeGraph() {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const lines = useRef<THREE.LineSegments>(null);
  const labelGroup = useRef<THREE.Group>(null);
  const simRef = useRef<d3.Simulation<SimNode, SimLink> | null>(null);
  const cursor = useRef({ x: 0, y: 0 });
  const wasHero = useRef(true);
  const lastPointer = useRef({ x: 0, y: 0 });

  const { nodes, edges } = useMemo(() => buildGraph(), []);
  const simNodes = useMemo(() => nodes as SimNode[], [nodes]);
  const display = useRef<Display[]>(
    nodes.map((n) => ({ x: n.x, y: n.y, z: n.z }))
  ).current;

  const lineGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(edges.length * 6), 3));
    return geo;
  }, [edges.length]);

  useEffect(() => {
    const links: SimLink[] = edges.map(([a, b]) => ({
      source: simNodes[a],
      target: simNodes[b],
    }));

    /**
     * Force layout settles when the pointer is still.
     * Cursor only adds energy while moving — no ambient wander.
     */
    const cursorForce = () => {
      const progress = useScrollStore.getState().progress;
      if (progress >= 0.42) return;
      const mx = cursor.current.x;
      const my = cursor.current.y;
      const r = graph.cursorRepelRadius;
      for (const d of simNodes) {
        const dx = (d.x ?? 0) - mx;
        const dy = (d.y ?? 0) - my;
        const dist = Math.hypot(dx, dy);
        if (dist < r && dist > 0.001) {
          const t = 1 - dist / r;
          const f = t * t * graph.cursorRepelStrength * 0.055;
          d.vx = (d.vx ?? 0) + (dx / dist) * f;
          d.vy = (d.vy ?? 0) + (dy / dist) * f;
        }
      }
    };

    const simulation = d3
      .forceSimulation(simNodes)
      .force("link", d3.forceLink<SimNode, SimLink>(links).distance(1.55).strength(0.32))
      .force("charge", d3.forceManyBody().strength(-1.1).distanceMax(4.2))
      .force("x", d3.forceX(0).strength(0.035))
      .force("y", d3.forceY(0).strength(0.04))
      .force("collide", d3.forceCollide(0.3))
      .force("cursor", cursorForce)
      .velocityDecay(0.72)
      .alphaDecay(0.028)
      .alphaMin(0.001)
      .alpha(0.55);

    // Cool to rest after initial layout — motion only from cursor / re-entry
    simulation.alphaTarget(0);

    simRef.current = simulation;

    return () => {
      simulation.alphaTarget(0);
      simulation.stop();
      simRef.current = null;
    };
  }, [edges, simNodes]);

  useFrame(() => {
    const meshRef = mesh.current;
    if (!meshRef) return;

    const smooth = useScrollStore.getState().smoothPointer;
    const progress = useScrollStore.getState().progress;
    const hero = progress < 0.42;

    const targetX = smooth.x * 3.8;
    const targetY = smooth.y * 2.4;
    cursor.current.x += (targetX - cursor.current.x) * graph.cursorLerp;
    cursor.current.y += (targetY - cursor.current.y) * graph.cursorLerp;

    const dx = smooth.x - lastPointer.current.x;
    const dy = smooth.y - lastPointer.current.y;
    const pointerSpeed = Math.hypot(dx, dy);
    lastPointer.current.x = smooth.x;
    lastPointer.current.y = smooth.y;

    const simulation = simRef.current;
    if (simulation) {
      if (hero) {
        if (!wasHero.current) {
          // One soft settle after scrolling back — then rest
          simulation.alpha(0.12).alphaTarget(0).restart();
        } else if (pointerSpeed > 0.0015) {
          // Wake only while the mouse is moving
          simulation.alphaTarget(0.12);
          if (simulation.alpha() < 0.05) simulation.alpha(0.1).restart();
        } else {
          simulation.alphaTarget(0);
        }
      } else {
        simulation.alphaTarget(0);
      }
      wasHero.current = hero;
    }

    const posAttr = lines.current?.geometry.getAttribute("position") as
      | THREE.BufferAttribute
      | undefined;
    const lerp = graph.displayLerp;

    for (let i = 0; i < simNodes.length; i++) {
      const n = simNodes[i];
      let tx = n.x ?? 0;
      let ty = n.y ?? 0;
      let tz = n.z;

      if (i === FOCUS_NODE_ID && progress > 0.25) {
        const k = Math.min(1, (progress - 0.25) / 0.35);
        tx = THREE.MathUtils.lerp(tx, 0, k);
        ty = THREE.MathUtils.lerp(ty, 0.05, k);
        tz = THREE.MathUtils.lerp(tz, 0.05, k);
      }

      const d = display[i];
      d.x += (tx - d.x) * lerp;
      d.y += (ty - d.y) * lerp;
      d.z += (tz - d.z) * lerp;

      let s = n.scale;
      if (i === FOCUS_NODE_ID && progress > 0.35) {
        s = THREE.MathUtils.lerp(n.scale, 0.2, Math.min(1, (progress - 0.35) / 0.3));
      } else if (progress > 0.5 && i !== FOCUS_NODE_ID) {
        s = n.scale * Math.max(0.25, 1 - (progress - 0.5));
      }

      tempObj.position.set(d.x, d.y, d.z);
      tempObj.scale.setScalar(s);
      tempObj.updateMatrix();
      meshRef.setMatrixAt(i, tempObj.matrix);
      tempColor.copy(charcoal).lerp(maroon, 0.35 + n.memory * 0.5);
      meshRef.setColorAt(i, tempColor);
    }

    meshRef.instanceMatrix.needsUpdate = true;
    if (meshRef.instanceColor) meshRef.instanceColor.needsUpdate = true;

    if (posAttr) {
      edges.forEach(([a, b], i) => {
        const i6 = i * 6;
        const da = display[a];
        const db = display[b];
        posAttr.array[i6] = da.x;
        posAttr.array[i6 + 1] = da.y;
        posAttr.array[i6 + 2] = da.z;
        posAttr.array[i6 + 3] = db.x;
        posAttr.array[i6 + 4] = db.y;
        posAttr.array[i6 + 5] = db.z;
      });
      posAttr.needsUpdate = true;
    }

    if (labelGroup.current) {
      labelGroup.current.children.forEach((child, i) => {
        const d = display[i];
        if (!d) return;
        child.position.set(d.x + 0.2, d.y + 0.05, d.z);
        const sprite = child.children[0] as THREE.Sprite | undefined;
        const mat = sprite?.material as THREE.SpriteMaterial | undefined;
        if (!mat) return;
        const dist = Math.hypot(d.x - cursor.current.x, d.y - cursor.current.y);
        const near = dist < graph.labelNear && hero;
        const target =
          (progress > 0.55 ? 0.05 : near ? graph.labelNearOpacity : graph.labelBaseOpacity) *
          graph.opacity;
        mat.opacity += (target - mat.opacity) * 0.06;
      });
    }
  });

  return (
    <group scale={0.84}>
      <instancedMesh ref={mesh} args={[undefined, undefined, nodes.length]} frustumCulled={false}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshBasicMaterial toneMapped={false} transparent opacity={graph.opacity} depthWrite={false} />
      </instancedMesh>
      <lineSegments ref={lines} geometry={lineGeo} frustumCulled={false}>
        <lineBasicMaterial
          color={tokens.charcoal}
          transparent
          opacity={graph.opacity * 0.55}
          depthWrite={false}
        />
      </lineSegments>
      <group ref={labelGroup}>
        {nodes.map((n) => (
          <group key={n.id}>
            <NodeLabel text={n.label} />
          </group>
        ))}
      </group>
    </group>
  );
}

function NodeLabel({ text }: { text: string }) {
  const texture = useMemo(() => makeLabelTexture(text), [text]);
  return (
    <sprite scale={[1.4, 0.34, 1]} center={[0, 0.5]}>
      <spriteMaterial
        map={texture}
        transparent
        opacity={graph.labelBaseOpacity * graph.opacity}
        depthTest={false}
        depthWrite={false}
        toneMapped={false}
      />
    </sprite>
  );
}

function makeLabelTexture(text: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 384;
  canvas.height = 96;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, 384, 96);
  ctx.fillStyle = tokens.charcoal;
  ctx.globalAlpha = 0.75;
  ctx.font = "400 28px ui-sans-serif, system-ui, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 6, 48);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
