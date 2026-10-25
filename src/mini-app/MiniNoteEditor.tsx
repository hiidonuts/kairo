import { useEffect, useMemo, useState } from "react";
import { filterSuggestionItems } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import {
  SuggestionMenuController,
  getDefaultReactSlashMenuItems,
  useCreateBlockNote,
} from "@blocknote/react";
import { useMiniStore } from "./store";

type Props = {
  noteId: string;
  besideList: boolean;
};

function parseBlocks(content: string) {
  try {
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : undefined;
  } catch {
    return undefined;
  }
}

export default function MiniNoteEditor({ noteId, besideList }: Props) {
  const note = useMiniStore((s) => s.notes.find((n) => n.id === noteId));
  const spaces = useMiniStore((s) => s.spaces);
  const updateNote = useMiniStore((s) => s.updateNote);
  const [title, setTitle] = useState(note?.title ?? "");

  useEffect(() => {
    setTitle(note?.title ?? "");
  }, [noteId, note?.title]);

  const initialContent = useMemo(() => {
    return note ? parseBlocks(note.content) : undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- seed once per note open
  }, [noteId]);

  const editor = useCreateBlockNote({
    initialContent,
  });

  const space = spaces.find((s) => s.id === note?.spaceId);
  const edited = note
    ? new Date(note.updatedAt).toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Just now";

  if (!note) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-[var(--text-secondary)]">
        Select a note
      </div>
    );
  }

  return (
    <div
      className={`kairo-note-canvas relative mx-auto mt-8 mb-20 w-full max-w-7xl min-h-full ${
        besideList ? "px-6 sm:px-10 md:px-14" : "px-4 md:px-8"
      }`}
    >
      <div className={`relative mb-2 mt-4 flex items-center ${besideList ? "pl-2" : "pl-6"} pr-8`}>
        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            updateNote(noteId, { title: e.target.value });
          }}
          className="w-full bg-transparent font-display text-[40px] font-medium leading-tight text-[var(--text-primary)] outline-none placeholder:text-[var(--text-tertiary)]"
          placeholder="Untitled"
        />
      </div>

      <div
        className={`relative mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 font-sans text-xs text-[var(--text-tertiary)] ${
          besideList ? "pl-2" : "pl-6"
        }`}
      >
        <span>Edited {edited}</span>
        <span className="inline-flex items-center gap-1.5">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: space?.color ?? "var(--text-secondary)" }}
          />
          {space?.name ?? "Uncategorized"}
        </span>
      </div>

      <div className="relative mt-4 w-full pb-16">
        <BlockNoteView
          editor={editor}
          theme="light"
          slashMenu={false}
          onChange={() => {
            updateNote(noteId, { content: JSON.stringify(editor.document) });
          }}
        >
          <SuggestionMenuController
            triggerCharacter="/"
            getItems={async (query) =>
              filterSuggestionItems(getDefaultReactSlashMenuItems(editor), query)
            }
          />
        </BlockNoteView>
      </div>
    </div>
  );
}
