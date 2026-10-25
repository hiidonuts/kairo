import { create } from "zustand";

export const DEMO_PROMPT = "What can you do?";

export const DEMO_REPLY =
  "I’m Kairo AI — your on-device study partner. I can help you explore Spaces, turn notes into flashcards and quizzes, explain concepts from your materials, plan a Study Room session, and walk the knowledge graph with you. Everything stays on your computer.";

export type AiMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type AiStore = {
  open: boolean;
  messages: AiMessage[];
  input: string;
  typing: boolean;
  setOpen: (open: boolean) => void;
  setInput: (value: string) => void;
  /** Only the demo prompt is accepted; anything else is ignored. */
  trySend: () => boolean;
  resetChat: () => void;
};

export const useMiniAiStore = create<AiStore>((set, get) => ({
  open: false,
  messages: [],
  input: "",
  typing: false,
  setOpen: (open) => set({ open }),
  setInput: (input) => set({ input }),
  trySend: () => {
    const text = get().input.trim();
    if (text !== DEMO_PROMPT) return false;
    if (get().typing) return false;
    if (get().messages.some((m) => m.role === "user" && m.content === DEMO_PROMPT)) {
      set({ input: "" });
      return true;
    }
    const userMsg: AiMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: DEMO_PROMPT,
    };
    set({ messages: [...get().messages, userMsg], input: "", typing: true });
    window.setTimeout(() => {
      const reply: AiMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: DEMO_REPLY,
      };
      set((s) => ({ messages: [...s.messages, reply], typing: false }));
    }, 600);
    return true;
  },
  resetChat: () => set({ messages: [], input: "", typing: false }),
}));
