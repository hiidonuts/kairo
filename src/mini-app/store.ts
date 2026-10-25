import { create } from "zustand";

export type MiniSpace = {
  id: string;
  name: string;
  description: string;
  color: string;
  pinned: boolean;
  createdAt: number;
  itemCount: number;
};

export type MiniNote = {
  id: string;
  title: string;
  content: string;
  spaceId: string | null;
  updatedAt: number;
  createdAt: number;
};

const WORLD_HISTORY_ID = "space-world-history";

const initialSpaces: MiniSpace[] = [
  {
    id: WORLD_HISTORY_ID,
    name: "World History",
    description: "Empires, revolutions, and the long arcs that shaped the modern world.",
    color: "#C4A484",
    pinned: true,
    createdAt: new Date("2026-05-11").getTime(),
    itemCount: 1,
  },
];

const initialNotes: MiniNote[] = [
  {
    id: "note-wh-1",
    title: "Age of Revolutions",
    content: JSON.stringify([
      {
        id: "b1",
        type: "paragraph",
        props: {
          textColor: "default",
          backgroundColor: "default",
          textAlignment: "left",
        },
        content: [
          {
            type: "text",
            text: "Outline the political and social forces behind the late-18th-century revolutions.",
            styles: {},
          },
        ],
        children: [],
      },
      {
        id: "b2",
        type: "bulletListItem",
        props: {
          textColor: "default",
          backgroundColor: "default",
          textAlignment: "left",
        },
        content: [{ type: "text", text: "Enlightenment ideas and popular sovereignty", styles: {} }],
        children: [],
      },
      {
        id: "b3",
        type: "bulletListItem",
        props: {
          textColor: "default",
          backgroundColor: "default",
          textAlignment: "left",
        },
        content: [{ type: "text", text: "Fiscal crisis and elite conflict", styles: {} }],
        children: [],
      },
    ]),
    spaceId: WORLD_HISTORY_ID,
    updatedAt: Date.now() - 1000 * 60 * 60 * 5,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
  },
];

const SPACE_COLORS = ["#C4A484", "#8B2020", "#4F7A5C", "#5B7C99", "#B7791F", "#6B5B7A"];

type MiniStore = {
  spaces: MiniSpace[];
  notes: MiniNote[];
  createSpace: () => string;
  createNote: (spaceId?: string | null) => string;
  updateNote: (id: string, patch: Partial<Pick<MiniNote, "title" | "content" | "spaceId">>) => void;
};

export const WORLD_HISTORY_SPACE_ID = WORLD_HISTORY_ID;

export const useMiniStore = create<MiniStore>((set, get) => ({
  spaces: initialSpaces,
  notes: initialNotes,
  createSpace: () => {
    const id = crypto.randomUUID();
    const n = get().spaces.length + 1;
    const space: MiniSpace = {
      id,
      name: "New Space",
      description: "Add a short description for this space.",
      color: SPACE_COLORS[(n - 1) % SPACE_COLORS.length],
      pinned: false,
      createdAt: Date.now(),
      itemCount: 0,
    };
    set((s) => ({ spaces: [space, ...s.spaces] }));
    return id;
  },
  createNote: (spaceId = WORLD_HISTORY_ID) => {
    const id = crypto.randomUUID();
    const note: MiniNote = {
      id,
      title: "",
      content: "[]",
      spaceId,
      updatedAt: Date.now(),
      createdAt: Date.now(),
    };
    set((s) => ({
      notes: [note, ...s.notes],
      spaces: s.spaces.map((sp) =>
        sp.id === spaceId ? { ...sp, itemCount: sp.itemCount + 1 } : sp
      ),
    }));
    return id;
  },
  updateNote: (id, patch) => {
    set((s) => ({
      notes: s.notes.map((n) =>
        n.id === id ? { ...n, ...patch, updatedAt: Date.now() } : n
      ),
    }));
  },
}));
