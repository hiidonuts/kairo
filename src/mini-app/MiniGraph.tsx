import { useMemo, useState } from "react";
import {
  ChevronDown,
  Filter,
  LocateFixed,
  Pencil,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import { GRAPH_EDGES, GRAPH_NODES, type GraphNode } from "./demoData";

function masteryFill(combined: number | null): string {
  if (combined == null || combined === 0) return "var(--bg-secondary)";
  if (combined >= 100) return "var(--accent)";
  return `color-mix(in srgb, var(--accent) ${combined}%, var(--bg-secondary))`;
}

function nodeRadius(kind: GraphNode["kind"]) {
  if (kind === "space") return 3.2;
  if (kind === "document") return 2.4;
  return 1.8;
}

export default function MiniGraph() {
  const [search, setSearch] = useState("");
  const [focusedId, setFocusedId] = useState<string | null>("st-enl");
  const [spaceOpen, setSpaceOpen] = useState(false);
  const [filterNew, setFilterNew] = useState(false);

  const focused = GRAPH_NODES.find((n) => n.id === focusedId) ?? null;

  const searchResults = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return GRAPH_NODES.filter((n) => n.label.toLowerCase().includes(q)).slice(0, 6);
  }, [search]);

  const connected = useMemo(() => {
    if (!focused) return [];
    const ids = new Set<string>();
    for (const [a, b] of GRAPH_EDGES) {
      if (a === focused.id) ids.add(b);
      if (b === focused.id) ids.add(a);
    }
    return GRAPH_NODES.filter((n) => ids.has(n.id));
  }, [focused]);

  return (
    <div className="relative h-full overflow-hidden bg-[var(--bg-secondary)]">
      <div className="pointer-events-none absolute inset-x-4 top-4 z-10 flex items-start justify-between gap-3 md:inset-x-6 md:top-5">
        <div className="pointer-events-auto relative w-full max-w-xs">
          <div className="relative flex items-center">
            <Search
              size={15}
              className="absolute left-3 text-[var(--text-secondary)]"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search concepts"
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--card-bg)] py-2 pr-3 pl-9 text-[12px] text-[var(--text-primary)] shadow-sm outline-none placeholder:text-[var(--text-tertiary)] focus:border-[var(--text-secondary)]"
            />
          </div>
          {search.trim().length > 0 && (
            <div className="absolute top-full right-0 left-0 z-30 mt-2 max-h-56 overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--card-bg)] py-1 shadow-xl">
              {searchResults.length === 0 ? (
                <div className="px-3 py-2.5 text-[12px] text-[var(--text-secondary)]">
                  No results
                </div>
              ) : (
                searchResults.map((result) => (
                  <button
                    key={result.id}
                    type="button"
                    onClick={() => {
                      setFocusedId(result.id);
                      setSearch("");
                    }}
                    className="flex w-full flex-col px-3 py-2 text-left hover:bg-[var(--bg-secondary)]"
                  >
                    <span className="text-[12px] font-medium text-[var(--text-primary)]">
                      {result.label}
                    </span>
                    <span className="text-[10px] text-[var(--text-secondary)]">
                      World History · {result.kind}
                    </span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        <div className="pointer-events-auto flex shrink-0 items-center gap-1.5">
          <div className="relative">
            <button
              type="button"
              onClick={() => setSpaceOpen((v) => !v)}
              className="font-nav flex max-w-[10rem] items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] px-2.5 py-2 text-[12px] font-medium text-[var(--text-primary)] shadow-sm"
            >
              <span className="truncate">World History</span>
              <ChevronDown size={14} className="shrink-0 text-[var(--text-secondary)]" />
            </button>
            {spaceOpen && (
              <div className="absolute top-full right-0 z-30 mt-2 w-52 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card-bg)] py-1 shadow-xl">
                <button
                  type="button"
                  onClick={() => setSpaceOpen(false)}
                  className="flex w-full items-center justify-between bg-[var(--bg-secondary)] px-3 py-2 text-left"
                >
                  <span className="font-nav text-[12px]">World History</span>
                  <span className="text-[10px] text-[var(--text-secondary)]">Ready</span>
                </button>
              </div>
            )}
          </div>
          <button
            type="button"
            aria-label="Rebuild map"
            className="flex items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-2 text-[var(--text-primary)] shadow-sm"
          >
            <RefreshCw size={16} />
          </button>
          <button
            type="button"
            aria-label="Center graph"
            className="flex items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-2 text-[var(--text-primary)] shadow-sm"
          >
            <LocateFixed size={16} />
          </button>
          <button
            type="button"
            onClick={() => setFilterNew((v) => !v)}
            aria-label="Filter"
            className={`flex items-center justify-center rounded-xl border p-2 shadow-sm transition-colors ${
              filterNew
                ? "border-[var(--text-primary)] bg-[var(--bg-secondary)] text-[var(--text-primary)]"
                : "border-[var(--border)] bg-[var(--card-bg)] text-[var(--text-primary)]"
            }`}
          >
            <Filter size={16} />
          </button>
          <button
            type="button"
            aria-label="Edit layout"
            className="hidden items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-2 text-[var(--text-primary)] shadow-sm sm:flex"
          >
            <Pencil size={16} />
          </button>
        </div>
      </div>

      <svg
        className="h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
      >
        {GRAPH_EDGES.map(([a, b]) => {
          const na = GRAPH_NODES.find((n) => n.id === a)!;
          const nb = GRAPH_NODES.find((n) => n.id === b)!;
          const dim =
            focused && focused.id !== a && focused.id !== b
              ? 0.12
              : 0.28;
          return (
            <line
              key={`${a}-${b}`}
              x1={na.x}
              y1={na.y}
              x2={nb.x}
              y2={nb.y}
              stroke="var(--text-primary)"
              strokeOpacity={dim}
              strokeWidth={0.35}
            />
          );
        })}
        {GRAPH_NODES.map((n) => {
          const r = nodeRadius(n.kind);
          const isFocused = focused?.id === n.id;
          const dimmed = focused && !isFocused && !connected.some((c) => c.id === n.id);
          return (
            <g
              key={n.id}
              className="cursor-pointer"
              opacity={dimmed ? 0.28 : 1}
              onClick={() => setFocusedId(n.id)}
            >
              <circle
                cx={n.x}
                cy={n.y}
                r={isFocused ? r + 0.7 : r}
                fill={masteryFill(n.mastery)}
                stroke={
                  n.mastery == null
                    ? "var(--text-secondary)"
                    : "var(--bg-primary)"
                }
                strokeWidth={n.mastery == null ? 0.35 : 0.25}
              />
              {(n.kind !== "subtopic" || isFocused || !focused) && (
                <text
                  x={n.x + r + 1.2}
                  y={n.y + 0.9}
                  fontSize={n.kind === "space" ? 3.4 : 2.8}
                  fill="var(--text-primary)"
                  fillOpacity={0.8}
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  {n.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      <div className="absolute bottom-4 left-4 z-10 rounded-xl border border-[var(--border)] bg-[var(--card-bg)]/95 px-3 py-2.5 text-[10px] text-[var(--text-secondary)] shadow-sm backdrop-blur-sm md:bottom-5 md:left-5">
        <p className="font-nav mb-1.5 text-[11px] font-semibold text-[var(--text-primary)]">
          Mastery
        </p>
        <ul className="space-y-1">
          <li className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full border border-[var(--text-secondary)]"
              style={{ background: masteryFill(null) }}
            />
            No practice yet
          </li>
          {[0, 50, 100].map((pct) => (
            <li key={pct} className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full border border-[var(--bg-primary)]"
                style={{ background: masteryFill(pct) }}
              />
              {pct}%
            </li>
          ))}
        </ul>
      </div>

      {focused && (
        <aside className="absolute top-16 right-3 bottom-4 z-20 flex w-[min(280px,calc(100%-1.5rem))] flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] shadow-xl md:top-5 md:right-5 md:bottom-5 md:w-[300px]">
          <div className="shrink-0 p-4 pb-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-display text-xl tracking-tight text-[var(--text-primary)]">
                {focused.label}
              </h3>
              <button
                type="button"
                onClick={() => setFocusedId(null)}
                aria-label="Close"
                className="rounded-full bg-[var(--bg-secondary)] p-1.5 text-[var(--text-secondary)] hover:bg-[var(--border)] hover:text-[var(--text-primary)]"
              >
                <X size={13} />
              </button>
            </div>
            <p className="mt-1 text-[11px] text-[var(--text-secondary)]">
              {focused.kind} in World History
            </p>
          </div>

          <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-4 pb-4">
            <div className="mb-3 rounded-xl border border-[var(--border)]/50 bg-[var(--bg-secondary)] p-3">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-[10px] font-medium text-[var(--text-secondary)]">
                  Mastery
                </span>
                {focused.mastery == null ? (
                  <span className="text-[10px] text-[var(--text-tertiary)]">No progress yet</span>
                ) : (
                  <span className="text-[12px] font-semibold text-[var(--text-primary)] tabular-nums">
                    {focused.mastery}%
                  </span>
                )}
              </div>
              {focused.mastery != null && (
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--border)]">
                  <div
                    className="h-full rounded-full bg-[var(--accent)]"
                    style={{ width: `${focused.mastery}%` }}
                  />
                </div>
              )}
            </div>

            <h4 className="font-display mb-2 text-[13px] text-[var(--text-primary)]">
              Connections ({connected.length})
            </h4>
            <div className="space-y-1">
              {connected.map((cn) => (
                <button
                  key={cn.id}
                  type="button"
                  onClick={() => setFocusedId(cn.id)}
                  className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left hover:bg-[var(--bg-secondary)]"
                >
                  <span className="truncate text-[12px] font-medium text-[var(--text-primary)]">
                    {cn.label}
                  </span>
                  <span className="shrink-0 text-[10px] text-[var(--text-secondary)] capitalize">
                    {cn.kind}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}
