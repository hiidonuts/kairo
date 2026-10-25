export type MiniTabId =
  | "home"
  | "spaces"
  | "notes-list"
  | "practice"
  | "study-room"
  | "knowledge-graph"
  | "ai_chat";

export type MiniTab = {
  id: MiniTabId;
  title: string;
};

export const NAV_ITEMS: {
  id: Exclude<MiniTabId, "ai_chat">;
  label: string;
}[] = [
  { id: "home", label: "Home" },
  { id: "spaces", label: "Spaces" },
  { id: "notes-list", label: "Notes" },
  { id: "practice", label: "Practice" },
  { id: "study-room", label: "Study Room" },
  { id: "knowledge-graph", label: "Graph View" },
];

export const CONTINUE_DOCS = [
  { id: "d1", name: "Age of Revolutions" },
];

export const PRACTICE_DECKS = [
  { id: "p1", title: "World History timelines", kind: "Flashcards", cards: 24, mastery: 48, space: "World History" },
  { id: "p2", title: "Revolutions quiz", kind: "Quiz", cards: 18, mastery: 62, space: "World History" },
];

export const STUDY_TASKS = [
  { id: "t1", title: "Review Age of Revolutions", done: false, meta: "25 min · World History" },
  { id: "t2", title: "Timeline flashcards", done: false, meta: "Due today · World History" },
  { id: "t3", title: "Map labels practice", done: true, meta: "Done · World History" },
];

export const GRAPH_NODES = [
  { id: "g1", label: "Revolution", x: 28, y: 42 },
  { id: "g2", label: "Enlightenment", x: 52, y: 30 },
  { id: "g3", label: "Empire", x: 70, y: 55 },
  { id: "g4", label: "Industry", x: 38, y: 68 },
  { id: "g5", label: "Nation-state", x: 58, y: 48 },
  { id: "g6", label: "Trade", x: 78, y: 36 },
];

export const GRAPH_EDGES: [string, string][] = [
  ["g1", "g2"],
  ["g2", "g5"],
  ["g3", "g6"],
  ["g4", "g1"],
  ["g5", "g3"],
];
