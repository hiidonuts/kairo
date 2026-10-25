import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  LayoutGrid,
  List,
  Pin,
  Plus,
  SortAsc,
  X,
} from "lucide-react";
import { useMiniStore, type MiniSpace } from "./store";

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString(undefined, {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  });
}

export default function MiniSpaces() {
  const spaces = useMiniStore((s) => s.spaces);
  const createSpace = useMiniStore((s) => s.createSpace);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterPinned, setFilterPinned] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [perPageOpen, setPerPageOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [highlightId, setHighlightId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return spaces
      .filter((s) => {
        if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false;
        if (filterPinned && !s.pinned) return false;
        return true;
      })
      .sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return b.createdAt - a.createdAt;
      });
  }, [spaces, search, filterPinned]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const page = Math.min(currentPage, totalPages);
  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterPinned, itemsPerPage]);

  const handleCreate = () => {
    const id = createSpace();
    setHighlightId(id);
    setTimeout(() => setHighlightId(null), 1500);
  };

  return (
    <div className="h-full overflow-y-auto px-3 pb-8 pt-3 font-sans md:px-5">
      <div className="mx-auto w-full max-w-6xl space-y-3">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleCreate}
            className="group inline-flex items-center gap-1.5 text-[12px] font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
          >
            <Plus size={14} className="transition-transform group-hover:rotate-90 group-hover:scale-110" />
            <span>Create New Space</span>
          </button>
        </div>

        <div className="flex flex-col items-center justify-between gap-2 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-2.5 md:flex-row">
          <div className="relative w-full md:max-w-xs">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search spaces..."
              className="w-full rounded-lg border border-[var(--border)] bg-transparent px-2.5 py-1.5 text-[12px] outline-none placeholder:text-[var(--text-secondary)] focus:border-[var(--text-primary)]"
            />
          </div>

          <div className="flex w-full flex-wrap items-center gap-1.5 md:w-auto">
            <div className="relative">
              <button
                type="button"
                onClick={() => setFilterOpen((v) => !v)}
                className="flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-[var(--border)] bg-transparent px-2.5 py-1.5 text-[11px] font-medium text-[var(--text-secondary)] transition-colors hover:border-[var(--text-primary)] hover:text-[var(--text-primary)]"
              >
                <Filter size={13} /> Filter
                {filterPinned && (
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-maroon)]" />
                )}
              </button>
              {filterOpen && (
                <div className="absolute left-0 top-full z-30 mt-1 w-40 rounded-lg border border-[var(--border)] bg-[var(--card-bg)] p-1 shadow-lg">
                  <button
                    type="button"
                    onClick={() => setFilterPinned((v) => !v)}
                    className="flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-[11px] hover:bg-[var(--bg-tertiary)]"
                  >
                    Pinned only
                    {filterPinned && <span className="text-[var(--accent-maroon)]">✓</span>}
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              className="flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-[var(--border)] bg-transparent px-2.5 py-1.5 text-[11px] font-medium text-[var(--text-secondary)] transition-colors hover:border-[var(--text-primary)] hover:text-[var(--text-primary)]"
            >
              <SortAsc size={13} /> Recent
            </button>

            <div className="relative ml-auto md:ml-0">
              <button
                type="button"
                onClick={() => setPerPageOpen((v) => !v)}
                className="rounded-lg border border-[var(--border)] bg-transparent px-2.5 py-1.5 text-[11px] font-medium text-[var(--text-secondary)] hover:border-[var(--text-primary)] hover:text-[var(--text-primary)]"
              >
                Display {itemsPerPage} / page
              </button>
              {perPageOpen && (
                <div className="absolute right-0 top-full z-30 mt-1 min-w-full rounded-lg border border-[var(--border)] bg-[var(--card-bg)] p-1 shadow-lg">
                  {[6, 9, 18, 27].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => {
                        setItemsPerPage(n);
                        setPerPageOpen(false);
                      }}
                      className="block w-full rounded-md px-2.5 py-1.5 text-left text-[11px] hover:bg-[var(--bg-tertiary)]"
                    >
                      Display {n} / page
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-0.5 rounded-lg bg-[var(--bg-secondary)] p-0.5">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`rounded-md p-1 ${
                  viewMode === "grid"
                    ? "bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm"
                    : "text-[var(--text-secondary)]"
                }`}
                aria-label="Grid view"
              >
                <LayoutGrid size={13} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`rounded-md p-1 ${
                  viewMode === "list"
                    ? "bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm"
                    : "text-[var(--text-secondary)]"
                }`}
                aria-label="List view"
              >
                <List size={13} />
              </button>
            </div>
          </div>
        </div>

        {filterPinned && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-medium text-[var(--text-secondary)]">Active filters</span>
            <button
              type="button"
              onClick={() => setFilterPinned(false)}
              className="flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--bg-secondary)] px-2 py-0.5 text-[10px] font-medium hover:border-[var(--text-primary)]"
            >
              Pin <X size={10} />
            </button>
          </div>
        )}

        <div
          className={`grid gap-3 ${
            viewMode === "list" ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {paginated.length === 0 ? (
            <div className="col-span-full rounded-2xl border-2 border-dashed border-[var(--border)]/40 py-12 text-center">
              <p className="mb-3 font-sans text-sm font-medium text-[var(--text-secondary)]">
                {search || filterPinned ? "No spaces match" : "No spaces yet"}
              </p>
              {!search && !filterPinned && (
                <button
                  type="button"
                  onClick={handleCreate}
                  className="rounded-lg bg-[var(--text-primary)] px-4 py-2 text-[12px] font-medium text-[var(--bg-primary)] shadow-md hover:opacity-90"
                >
                  Create one
                </button>
              )}
            </div>
          ) : (
            paginated.map((space) => (
              <SpaceCard
                key={space.id}
                space={space}
                viewMode={viewMode}
                highlighted={highlightId === space.id}
              />
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-center gap-3 pb-4">
            <button
              type="button"
              disabled={page === 1}
              aria-label="Previous page"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrentPage(i + 1)}
                  className={`flex h-7 w-7 items-center justify-center rounded-full font-sans text-[12px] font-medium transition-colors ${
                    page === i + 1
                      ? "font-bold text-[var(--text-primary)]"
                      : "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              type="button"
              disabled={page === totalPages}
              aria-label="Next page"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function SpaceCard({
  space,
  viewMode,
  highlighted,
}: {
  space: MiniSpace;
  viewMode: "grid" | "list";
  highlighted: boolean;
}) {
  const isList = viewMode === "list";

  return (
    <div
      data-space-id={space.id}
      className={[
        "group relative flex cursor-default border border-[var(--border)] bg-[var(--card-bg)] transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5",
        isList ? "max-h-[112px] min-h-[96px] flex-row rounded-xl" : "h-full min-h-[200px] flex-col rounded-xl",
        space.pinned ? "shadow-[0_6px_20px_rgb(0_0_0/0.04)]" : "hover:border-[var(--text-secondary)]/40",
        highlighted ? "ring-2 ring-[var(--accent-maroon)]/40" : "",
      ].join(" ")}
    >
      {space.pinned && (
        <div className="absolute right-2.5 top-2.5 z-10 rounded-md border border-[var(--border)]/20 bg-[var(--card-bg)] p-1 text-[var(--accent-maroon)] shadow-sm">
          <Pin size={11} className="rotate-45" />
        </div>
      )}

      <div
        className={[
          "relative shrink-0 overflow-hidden border-[var(--border)]/20",
          isList ? "h-full w-28 border-r" : "h-16 w-full rounded-t-sm border-b",
        ].join(" ")}
      >
        <div className="h-full w-full" style={{ backgroundColor: space.color, opacity: 0.85 }} />
      </div>

      <div className={`relative flex min-h-0 flex-1 ${isList ? "flex-row" : "flex-col rounded-b-xl"}`}>
        <div className={`flex flex-1 ${isList ? "flex-row items-center gap-3 p-3" : "min-h-0 flex-col px-3.5 pt-3 pb-2"}`}>
          <div className="flex min-h-0 flex-1 flex-col justify-between">
            <div className="mb-1 flex min-w-0 items-baseline gap-2 pr-6">
              <h3 className="line-clamp-1 font-display text-[15px] leading-tight tracking-tight transition-colors group-hover:text-[var(--accent-maroon)]">
                {space.name}
              </h3>
            </div>
            <p
              className={[
                "font-sans text-[11px] leading-relaxed text-[var(--text-secondary)]",
                isList ? "line-clamp-2 pr-4" : "line-clamp-2",
              ].join(" ")}
            >
              {space.description}
            </p>
          </div>
        </div>

        {!isList && (
          <div className="mt-auto flex shrink-0 flex-col border-t border-[var(--border)]/10 bg-[var(--bg-secondary)]/30 px-3.5 py-2">
            <div className="flex w-full items-center justify-between">
              <span className="font-sans text-[10px] font-semibold text-[var(--text-secondary)]">
                {formatDate(space.createdAt)}
              </span>
              <span className="font-sans text-[10px] font-medium text-[var(--text-secondary)]">
                {space.itemCount} {space.itemCount === 1 ? "item" : "items"}
              </span>
            </div>
          </div>
        )}

        {isList && (
          <div className="flex h-full w-36 shrink-0 flex-col justify-center border-l border-[var(--border)]/10 px-3">
            <div className="flex flex-col gap-1 font-sans text-[10px] font-medium text-[var(--text-secondary)]">
              <span className="font-semibold">{formatDate(space.createdAt)}</span>
              <span>
                {space.itemCount} {space.itemCount === 1 ? "item" : "items"}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
