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

export type PracticeDeck = {
  id: string;
  title: string;
  kind: "Flashcards" | "Quiz";
  space: string;
  cards: number;
  due: number;
  mastery: number;
  status: "new" | "ongoing" | "completed";
  meta: string;
  lastTouch: string;
};

export const PRACTICE_DECKS: PracticeDeck[] = [
  {
    id: "p1",
    title: "World History timelines",
    kind: "Flashcards",
    space: "World History",
    cards: 24,
    due: 12,
    mastery: 48,
    status: "ongoing",
    meta: "12 due · 24 cards",
    lastTouch: "Reviewed 2 days ago",
  },
  {
    id: "p2",
    title: "Revolutions quiz",
    kind: "Quiz",
    space: "World History",
    cards: 18,
    due: 0,
    mastery: 62,
    status: "completed",
    meta: "18 questions, mixed types, hard",
    lastTouch: "Attempted 3 days ago",
  },
];

export type StudyTodo = {
  id: string;
  title: string;
  kind: "task" | "deadline";
  done: boolean;
  space: string | null;
  meta?: string;
  dueLabel?: string;
};

export const STUDY_TASKS: StudyTodo[] = [];

export type GraphNode = {
  id: string;
  label: string;
  kind: "space" | "document" | "subtopic";
  x: number;
  y: number;
  mastery: number | null;
  parentId?: string;
};

export const GRAPH_NODES: GraphNode[] = [
  { id: "space", label: "World History", kind: "space", x: 50, y: 48, mastery: 58 },
  {
    id: "doc-rev",
    label: "Age of Revolutions",
    kind: "document",
    x: 28,
    y: 32,
    mastery: 52,
    parentId: "space",
  },
  {
    id: "doc-ind",
    label: "Industrial Age",
    kind: "document",
    x: 72,
    y: 34,
    mastery: 41,
    parentId: "space",
  },
  {
    id: "st-enl",
    label: "Enlightenment",
    kind: "subtopic",
    x: 16,
    y: 52,
    mastery: 72,
    parentId: "doc-rev",
  },
  {
    id: "st-rev",
    label: "Revolution",
    kind: "subtopic",
    x: 30,
    y: 68,
    mastery: 48,
    parentId: "doc-rev",
  },
  {
    id: "st-nat",
    label: "Nation-state",
    kind: "subtopic",
    x: 44,
    y: 58,
    mastery: 35,
    parentId: "doc-rev",
  },
  {
    id: "st-ind",
    label: "Industry",
    kind: "subtopic",
    x: 68,
    y: 66,
    mastery: 28,
    parentId: "doc-ind",
  },
  {
    id: "st-trade",
    label: "Trade",
    kind: "subtopic",
    x: 84,
    y: 54,
    mastery: null,
    parentId: "doc-ind",
  },
  {
    id: "st-emp",
    label: "Empire",
    kind: "subtopic",
    x: 78,
    y: 22,
    mastery: 55,
    parentId: "doc-ind",
  },
];

export const GRAPH_EDGES: [string, string][] = [
  ["space", "doc-rev"],
  ["space", "doc-ind"],
  ["doc-rev", "st-enl"],
  ["doc-rev", "st-rev"],
  ["doc-rev", "st-nat"],
  ["doc-ind", "st-ind"],
  ["doc-ind", "st-trade"],
  ["doc-ind", "st-emp"],
  ["st-enl", "st-rev"],
  ["st-rev", "st-nat"],
  ["st-ind", "st-trade"],
];
