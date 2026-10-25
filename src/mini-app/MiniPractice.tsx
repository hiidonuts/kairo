import { useMemo, useState } from "react";
import {
  BookOpenCheck,
  ChevronDown,
  Filter,
  LayoutGrid,
  Layers,
  List,
  MoreHorizontal,
  PenLine,
  Plus,
  SortAsc,
} from "lucide-react";
import { PRACTICE_DECKS } from "./demoData";

function MasteryRing({ value, size = 20 }: { value: number; size?: number }) {
  return (
    <div
      className="relative flex shrink-0 items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
        <circle
          cx="18"
          cy="18"
          r="16"
          fill="none"
          className="stroke-[var(--border)]"
          strokeWidth="4"
        />
        <circle
          cx="18"
          cy="18"
          r="16"
          fill="none"
          className="stroke-[var(--accent-maroon)]"
          strokeWidth="4"
          strokeDasharray="100"
          strokeDashoffset={100 - value}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export default function MiniPractice() {
  const [tab, setTab] = useState<"quizzes" | "flashcards">("flashcards");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [deckFilter, setDeckFilter] = useState<"all" | "due" | "mastered">("all");

  const totalDue = PRACTICE_DECKS.filter((d) => d.kind === "Flashcards").reduce(
    (sum, d) => sum + d.due,
    0
  );

  const items = useMemo(() => {
    return PRACTICE_DECKS.filter((d) => {
      if (tab === "flashcards" ? d.kind !== "Flashcards" : d.kind !== "Quiz") return false;
      if (search && !d.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (tab === "flashcards" && deckFilter === "due" && d.due === 0) return false;
      if (tab === "flashcards" && deckFilter === "mastered" && d.mastery < 80) return false;
      return true;
    });
  }, [tab, search, deckFilter]);

  const dueToday = PRACTICE_DECKS.filter((d) => d.kind === "Flashcards" && d.due > 0);

  return (
    <div className="flex h-full flex-col overflow-hidden bg-transparent">
      <div className="mx-auto flex w-full max-w-7xl shrink-0 flex-wrap items-center gap-2 px-3 pt-4 pb-3 md:gap-3 md:px-6">
        <div className="inline-flex shrink-0 rounded-xl bg-[var(--bg-secondary)] p-0.5">
          {(["quizzes", "flashcards"] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`font-nav rounded-[10px] px-3 py-1.5 text-[12px] font-semibold capitalize transition-colors ${
                tab === key
                  ? "bg-[var(--card-bg)] text-[var(--text-primary)] shadow-sm"
                  : "text-[var(--text-secondary)]"
              }`}
            >
              {key}
              {key === "flashcards" && totalDue > 0 && (
                <span className="ml-1.5 rounded-full bg-[var(--accent-maroon)]/10 px-1.5 py-0.5 text-[10px] text-[var(--accent-maroon)]">
                  {totalDue}
                </span>
              )}
            </button>
          ))}
        </div>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search practice..."
          className="min-w-[10rem] flex-1 rounded-xl border border-[var(--border)] bg-transparent px-3 py-2 text-[12px] outline-none placeholder:text-[var(--text-secondary)] focus:border-[var(--text-primary)]"
        />

        <button
          type="button"
          className="font-nav hidden h-9 items-center gap-1.5 rounded-xl border border-[var(--border)] px-3 text-[12px] font-medium text-[var(--text-secondary)] sm:inline-flex"
        >
          All spaces <ChevronDown size={13} className="opacity-60" />
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setFilterOpen((v) => !v);
              setSortOpen(false);
              setCreateOpen(false);
            }}
            className={`font-nav flex h-9 items-center gap-1.5 rounded-xl border px-3 text-[12px] font-medium transition-colors ${
              deckFilter !== "all"
                ? "border-[var(--text-primary)] text-[var(--text-primary)]"
                : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--text-primary)] hover:text-[var(--text-primary)]"
            }`}
          >
            <Filter size={14} />
            {deckFilter === "all" ? "Filter" : deckFilter === "due" ? "Due" : "Mastered"}
            <ChevronDown size={13} className="opacity-60" />
          </button>
          {filterOpen && tab === "flashcards" && (
            <div className="absolute left-0 top-full z-30 mt-1 w-44 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-1 shadow-lg">
              {(
                [
                  ["all", "All"],
                  ["due", "Due"],
                  ["mastered", "Mastered"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setDeckFilter(id);
                    setFilterOpen(false);
                  }}
                  className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-[12px] hover:bg-[var(--bg-tertiary)]"
                >
                  {label}
                  {deckFilter === id && (
                    <span className="text-[var(--accent-maroon)]">✓</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative hidden sm:block">
          <button
            type="button"
            onClick={() => {
              setSortOpen((v) => !v);
              setFilterOpen(false);
              setCreateOpen(false);
            }}
            className="font-nav flex h-9 items-center gap-1.5 rounded-xl border border-[var(--border)] px-3 text-[12px] font-medium text-[var(--text-secondary)] hover:border-[var(--text-primary)] hover:text-[var(--text-primary)]"
          >
            <SortAsc size={14} /> Recent
          </button>
          {sortOpen && (
            <div className="absolute left-0 top-full z-30 mt-1 w-40 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-1 shadow-lg">
              {["Recent", "Name", "Needs review", "Mastered"].map((label) => (
                <div
                  key={label}
                  className="rounded-lg px-2.5 py-1.5 text-[12px] text-[var(--text-secondary)]"
                >
                  {label}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-0.5 rounded-xl bg-[var(--bg-secondary)] p-0.5">
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={`rounded-lg p-1.5 ${
              viewMode === "grid"
                ? "bg-[var(--card-bg)] text-[var(--text-primary)] shadow-sm"
                : "text-[var(--text-secondary)]"
            }`}
            aria-label="Grid view"
          >
            <LayoutGrid size={14} />
          </button>
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className={`rounded-lg p-1.5 ${
              viewMode === "list"
                ? "bg-[var(--card-bg)] text-[var(--text-primary)] shadow-sm"
                : "text-[var(--text-secondary)]"
            }`}
            aria-label="List view"
          >
            <List size={14} />
          </button>
        </div>

        <div className="relative ml-auto">
          <button
            type="button"
            onClick={() => {
              setCreateOpen((v) => !v);
              setFilterOpen(false);
              setSortOpen(false);
            }}
            className="font-nav flex h-9 items-center gap-1.5 rounded-xl bg-[var(--text-primary)] px-3.5 text-[12px] font-semibold text-[var(--bg-primary)] hover:opacity-90"
          >
            <Plus size={14} /> Create <ChevronDown size={13} className="opacity-70" />
          </button>
          {createOpen && (
            <div className="absolute right-0 top-full z-30 mt-1 w-52 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-1 shadow-lg">
              {[
                { icon: BookOpenCheck, label: "Create quiz" },
                { icon: Layers, label: "Generate flashcards" },
                { icon: PenLine, label: "Write flashcards" },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setCreateOpen(false)}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[12px] hover:bg-[var(--bg-tertiary)]"
                >
                  <item.icon size={14} className="text-[var(--text-secondary)]" />
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto min-h-0 w-full max-w-7xl flex-1 overflow-y-auto px-3 py-4 md:px-6">
        {tab === "flashcards" && dueToday.length > 0 && deckFilter === "all" && !search && (
          <div className="mb-6 space-y-3">
            <h3 className="font-display text-base text-[var(--text-primary)]">Due today</h3>
            <div className="no-scrollbar flex gap-3 overflow-x-auto pb-2">
              {dueToday.map((deck) => (
                <article
                  key={`due-${deck.id}`}
                  className="flex min-w-[260px] shrink-0 flex-col justify-between rounded-2xl border-2 border-[var(--accent-maroon)]/30 bg-[var(--card-bg)] p-4"
                >
                  <div>
                    <span className="inline-block rounded-full border border-[var(--border)] bg-[var(--bg-secondary)] px-2 py-0.5 text-[10px] font-medium text-[var(--text-secondary)]">
                      {deck.space}
                    </span>
                    <h4 className="font-display mt-2 text-lg font-bold text-[var(--text-primary)]">
                      {deck.title}
                    </h4>
                    <p className="mt-1 text-[11px] font-medium text-[var(--accent-maroon)]">
                      {deck.meta}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-[var(--border)]/40 pt-3">
                    <div className="flex items-center gap-2">
                      <MasteryRing value={deck.mastery} size={22} />
                      <span className="text-[10px] font-bold text-[var(--text-secondary)]">
                        {deck.mastery}% mastery
                      </span>
                    </div>
                    <span className="font-nav rounded-xl bg-[var(--accent-maroon)] px-3 py-1.5 text-[12px] font-medium text-white">
                      Review
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {items.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--bg-secondary)] text-[var(--text-secondary)]">
              {tab === "flashcards" ? <Layers size={22} /> : <BookOpenCheck size={22} />}
            </div>
            <h3 className="font-display text-base text-[var(--text-primary)]">
              {tab === "flashcards" ? "No flashcard decks found" : "No quizzes found"}
            </h3>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3"
                : "space-y-3"
            }
          >
            {items.map((deck) => (
              <article
                key={deck.id}
                className={`group relative rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-4 transition-colors hover:border-[var(--text-primary)]/40 ${
                  viewMode === "list"
                    ? "flex flex-row items-center justify-between gap-4"
                    : "flex flex-col"
                }`}
              >
                <button
                  type="button"
                  className="absolute top-3 right-3 rounded-md p-1 text-[var(--text-secondary)] opacity-0 transition-opacity group-hover:opacity-100 hover:bg-[var(--bg-secondary)]"
                  aria-label="Card actions"
                >
                  <MoreHorizontal size={15} />
                </button>

                <div className="min-w-0 flex-1">
                  <span className="inline-block rounded-full border border-[var(--border)] bg-[var(--bg-secondary)] px-2 py-0.5 text-[10px] font-medium text-[var(--text-secondary)]">
                    {deck.space}
                  </span>
                  <h4 className="font-display mt-2 pr-8 text-[15px] font-bold text-[var(--text-primary)]">
                    {deck.title}
                  </h4>
                  <p
                    className={`mt-1 text-[11px] ${
                      deck.kind === "Flashcards" && deck.due > 0
                        ? "font-medium text-[var(--accent-maroon)]"
                        : "text-[var(--text-secondary)]"
                    }`}
                  >
                    {deck.meta}
                    {deck.kind === "Quiz" && deck.status === "ongoing" && (
                      <span className="mt-0.5 block font-medium text-[var(--accent-maroon)]">
                        In progress
                      </span>
                    )}
                  </p>
                  {viewMode === "grid" && deck.kind === "Flashcards" && (
                    <div className="mt-3 flex items-center gap-2">
                      <MasteryRing value={deck.mastery} />
                      <span className="text-[10px] font-bold text-[var(--text-secondary)]">
                        {deck.mastery}% mastery
                      </span>
                    </div>
                  )}
                </div>

                <div
                  className={
                    viewMode === "list"
                      ? "flex shrink-0 flex-col items-end gap-2"
                      : "mt-4 flex items-center justify-between border-t border-[var(--border)]/40 pt-3"
                  }
                >
                  {viewMode === "grid" && (
                    <span className="text-[10px] text-[var(--text-tertiary)]">{deck.lastTouch}</span>
                  )}
                  <div className="flex items-center gap-2">
                    {(viewMode === "list" || deck.kind === "Quiz") && (
                      <>
                        <MasteryRing value={deck.mastery} />
                        <span className="text-[10px] font-bold text-[var(--text-secondary)]">
                          {deck.mastery}%
                        </span>
                        {viewMode === "grid" && (
                          <div className="mx-1 h-3.5 w-px bg-[var(--border)]" />
                        )}
                      </>
                    )}
                    <button
                      type="button"
                      className="font-nav rounded-xl border border-[var(--border)] bg-[var(--card-bg)] px-3 py-1.5 text-[12px] font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--text-primary)] hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)]"
                    >
                      {deck.kind === "Flashcards"
                        ? "Review"
                        : deck.status === "completed"
                          ? "Reattempt"
                          : deck.status === "ongoing"
                            ? "Continue"
                            : "Start"}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
