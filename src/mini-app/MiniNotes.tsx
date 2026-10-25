import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { ChevronsLeft, ChevronsRight, Plus, Search } from "lucide-react";
import MiniNoteEditor from "./MiniNoteEditor";
import { useMiniStore } from "./store";

function notePreview(content: string) {
  try {
    const blocks = JSON.parse(content) as Array<{
      content?: Array<{ text?: string }>;
    }>;
    if (!Array.isArray(blocks)) return "";
    const text = blocks
      .flatMap((b) => (Array.isArray(b.content) ? b.content : []))
      .map((c) => c.text ?? "")
      .join(" ");
    return text.replace(/\s+/g, " ").trim().slice(0, 120);
  } catch {
    return content.replace(/\s+/g, " ").trim().slice(0, 120);
  }
}

function formatShort(ts: number) {
  return new Date(ts).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function MiniNotes() {
  const notes = useMiniStore((s) => s.notes);
  const spaces = useMiniStore((s) => s.spaces);
  const createNote = useMiniStore((s) => s.createNote);
  const [selectedId, setSelectedId] = useState<string | null>(notes[0]?.id ?? null);
  const [isListOpen, setIsListOpen] = useState(true);
  const [listWidth] = useState(300);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!selectedId && notes[0]) setSelectedId(notes[0].id);
    if (selectedId && !notes.some((n) => n.id === selectedId)) {
      setSelectedId(notes[0]?.id ?? null);
    }
  }, [notes, selectedId]);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return notes;
    return notes.filter((n) => {
      const preview = notePreview(n.content).toLowerCase();
      return n.title.toLowerCase().includes(q) || preview.includes(q);
    });
  }, [notes, searchQuery]);

  const selected = notes.find((n) => n.id === selectedId) ?? filtered[0] ?? null;

  const handleCreate = () => {
    const id = createNote();
    setSelectedId(id);
    setIsListOpen(true);
  };

  const getSpace = (spaceId: string | null) => spaces.find((s) => s.id === spaceId);

  return (
    <div className="absolute inset-0 flex w-full overflow-hidden bg-[var(--bg-primary)]">
      <motion.div
        initial={false}
        animate={{ width: isListOpen ? listWidth : 0 }}
        transition={{ type: "tween", duration: 0.2 }}
        className={`relative z-10 flex h-full shrink-0 flex-col bg-[var(--bg-secondary)] group/sidebar ${
          isListOpen ? "overflow-visible border-r border-[var(--border)]" : "overflow-hidden border-r-0"
        }`}
      >
        <div className="absolute top-0 left-0 flex h-full flex-col" style={{ width: listWidth }}>
          <div className="flex h-11 shrink-0 items-center justify-between px-3">
            <button
              type="button"
              onClick={handleCreate}
              className="font-nav flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 text-[13px] font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--border)]/40"
            >
              <Plus size={16} className="shrink-0" />
              <span>New note</span>
            </button>
            <button
              type="button"
              onClick={() => setIsListOpen(false)}
              className="cursor-pointer border-0 bg-transparent p-1.5 text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
              title="Collapse list"
            >
              <ChevronsLeft size={16} />
            </button>
          </div>

          <div className="shrink-0 px-3 pb-2">
            <div className="relative">
              <Search
                className="absolute top-1/2 left-2.5 -translate-y-1/2 text-[var(--text-secondary)]"
                size={14}
              />
              <input
                type="text"
                placeholder="Search notes or #tag"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-transparent bg-[var(--bg-tertiary)] py-1.5 pr-3 pl-8 text-sm outline-none transition-colors placeholder:text-[var(--text-secondary)]/70 focus:border-[var(--border)]"
              />
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1 overflow-visible border-b border-[var(--border)]/60 px-3 pb-2 text-[11px] font-medium text-[var(--text-secondary)]">
            <span className="rounded-lg px-2.5 py-1">All spaces</span>
            <span className="rounded-lg px-2.5 py-1">Recently edited</span>
          </div>

          <div
            className="no-scrollbar flex flex-1 flex-col gap-0.5 overflow-x-hidden overflow-y-auto px-2 py-2"
            data-lenis-prevent="true"
          >
            {filtered.length === 0 ? (
              <div className="mt-10 p-8 text-center text-sm text-[var(--text-secondary)]">
                No notes found
              </div>
            ) : (
              filtered.map((note) => {
                const isSelected = selected?.id === note.id;
                const preview = notePreview(note.content);
                const space = getSpace(note.spaceId);
                return (
                  <button
                    key={note.id}
                    type="button"
                    onClick={() => setSelectedId(note.id)}
                    className={`flex w-full min-w-0 flex-col gap-0.5 rounded-lg px-3 py-2.5 text-left transition-colors ${
                      isSelected
                        ? "bg-[var(--text-primary)]/5"
                        : "hover:bg-[var(--text-primary)]/5"
                    }`}
                  >
                    <h3
                      className={`truncate text-[13.5px] leading-snug ${
                        isSelected
                          ? "font-semibold text-[var(--text-primary)]"
                          : "font-medium text-[var(--text-primary)]/90"
                      } ${!note.title ? "text-[var(--text-secondary)]" : ""}`}
                    >
                      {note.title || "Untitled note"}
                    </h3>
                    {preview && (
                      <p className="line-clamp-2 text-[12px] leading-snug text-[var(--text-secondary)]">
                        {preview}
                      </p>
                    )}
                    <div className="mt-1 flex min-w-0 items-center gap-1.5 text-[11px] text-[var(--text-tertiary)]">
                      <span
                        className="h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ backgroundColor: space?.color ?? "var(--text-secondary)" }}
                      />
                      <span className="truncate">{space?.name ?? "Uncategorized"}</span>
                      <span className="ml-auto shrink-0">{formatShort(note.updatedAt)}</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </motion.div>

      <div
        className="relative flex h-full flex-1 flex-col overflow-hidden bg-[var(--bg-secondary)]"
        id="editor-pane-container"
      >
        {!isListOpen && (
          <div className="absolute top-2 left-3 z-20">
            <button
              type="button"
              onClick={() => setIsListOpen(true)}
              className="cursor-pointer border-0 bg-transparent p-1.5 text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
              title="Expand list"
            >
              <ChevronsRight size={16} />
            </button>
          </div>
        )}

        {selected ? (
          <div
            className="relative flex h-full flex-1 justify-center overflow-y-auto"
            data-lenis-prevent="true"
          >
            <div className="w-full pb-32">
              <MiniNoteEditor
                key={selected.id}
                noteId={selected.id}
                besideList={isListOpen}
              />
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-1 flex-col items-center justify-center space-y-4 text-[var(--text-secondary)]">
            <p className="text-sm">No note selected</p>
            <button
              type="button"
              onClick={handleCreate}
              className="font-nav rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm text-[var(--text-primary)]"
            >
              Create a note
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
