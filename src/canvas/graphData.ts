import { graph } from "../config/motion";

export type GraphNode = {
  id: number;
  tier: 0 | 1 | 2;
  /** World position — mutated by the simulation each frame */
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  scale: number;
  memory: number;
  label: string;
};

const SUBJECTS = [
  "Physics", "Biology", "Chemistry", "Calculus", "Literature", "History",
  "Philosophy", "Economics", "Neuroscience", "Art History", "Linear Algebra",
  "Psychology", "Astronomy", "Genetics", "Ethics", "Sociology", "Poetry",
  "Ecology", "Robotics", "Music Theory", "Linguistics", "Architecture",
  "Thermodynamics", "World History", "Cognitive Science", "Discrete Math",
  "Cell membrane", "Risk management", "Neural networks", "Exam notes",
  "Photosynthesis", "Case study", "Lecture 4", "Flashcards", "Supply chain",
  "Organic Chemistry", "Macroeconomics", "Creative Writing", "Algorithms",
  "Databases", "Machine Learning", "Anatomy", "Epistemology", "Cloud Computing",
  "Cryptography", "Game Theory", "Statistics", "Political Science",
];

function seeded(i: number) {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

export function buildGraph(): { nodes: GraphNode[]; edges: [number, number][] } {
  const nodes: GraphNode[] = [];
  const edges: [number, number][] = [];

  for (let i = 0; i < graph.nodeCount; i++) {
    const tier: 0 | 1 | 2 = i < 1 ? 0 : i < 8 ? 1 : 2;
    const angle = seeded(i) * Math.PI * 2;
    const radius = 0.9 + seeded(i + 1) * 3.8;
    nodes.push({
      id: i,
      tier,
      x: Math.cos(angle) * radius * (0.75 + seeded(i + 2) * 0.85),
      y: Math.sin(angle) * radius * (0.5 + seeded(i + 3) * 0.6),
      z: (seeded(i + 4) - 0.5) * 0.9,
      vx: 0,
      vy: 0,
      scale: tier === 0 ? 0.1 : tier === 1 ? 0.065 : 0.04 + seeded(i + 5) * 0.02,
      memory: 0.2 + seeded(i + 6) * 0.65,
      label: SUBJECTS[i % SUBJECTS.length],
    });
  }

  // Sparse constellation: mostly one link per node, rare second link
  for (let i = 0; i < nodes.length; i++) {
    const target = Math.floor(seeded(i * 11 + 2) * nodes.length);
    if (target !== i) edges.push([i, target]);
    if (seeded(i + 9) > 0.82) {
      const target2 = Math.floor(seeded(i * 7 + 5) * nodes.length);
      if (target2 !== i) edges.push([i, target2]);
    }
  }

  return { nodes, edges };
}

export const FOCUS_NODE_ID = 4;
