import { useState, type ReactNode } from "react";
import {
  BookOpenCheck,
  Filter,
  Play,
  Plus,
  Search,
} from "lucide-react";
import {
  GRAPH_EDGES,
  GRAPH_NODES,
  PRACTICE_DECKS,
  STUDY_TASKS,
} from "./demoData";
import MiniSpaces from "./MiniSpaces";
import MiniNotes from "./MiniNotes";

function SectionTitle({
  title,
  meta,
  action,
}: {
  title: string;
  meta?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3">
      <div>
        <h2 className="font-display text-lg font-semibold tracking-tight text-[var(--text-primary)]">
          {title}
        </h2>
        {meta && (
          <p className="mt-0.5 text-[12px] font-medium text-[var(--text-secondary)]">{meta}</p>
        )}
      </div>
      {action}
    </div>
  );
}

function timeAwareGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 17) return "Good afternoon";
  return "Good evening";
}

export function MiniHome({ onGo }: { onGo: (id: string) => void }) {
  return (
    <div className="mx-auto max-w-3xl space-y-7 px-5 py-5 md:px-7">
      <header className="space-y-2 pt-1">
        <h1 className="font-display text-[1.75rem] font-semibold leading-[1.05] tracking-tight text-[var(--text-primary)] md:text-[2.1rem]">
          {timeAwareGreeting()}
        </h1>
        <p className="text-[14px] font-medium text-[var(--text-secondary)]">
          Make meaningful progress today.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        {[
          { label: "Upload docs", go: "spaces" },
          { label: "New practice", go: "practice" },
          { label: "Study timer", go: "study-room" },
        ].map((a) => (
          <button
            key={a.label}
            type="button"
            onClick={() => onGo(a.go)}
            className="font-nav rounded-full border border-[var(--border)] bg-[var(--bg-secondary)] px-3.5 py-2 text-[12px] font-semibold text-[var(--text-primary)] transition-colors hover:border-[var(--accent-maroon)]/40"
          >
            {a.label}
          </button>
        ))}
      </div>

      <section>
        <SectionTitle
          title="Today"
          meta={new Date().toLocaleDateString(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        />
        <div className="grid gap-3 md:grid-cols-[1.4fr_1fr]">
          <button
            type="button"
            onClick={() => onGo("practice")}
            className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4 text-left transition-colors hover:border-[var(--accent-maroon)]/30"
          >
            <p className="font-nav text-[11px] font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
              Due for review
            </p>
            <p className="mt-2 font-display text-3xl font-semibold text-[var(--text-primary)]">12</p>
            <p className="mt-1 text-[12px] text-[var(--text-secondary)]">
              Cards waiting in World History
            </p>
          </button>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4">
            <p className="font-nav text-[11px] font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
              Daily goal
            </p>
            <p className="mt-2 font-display text-3xl font-semibold text-[var(--accent-maroon)]">
              3<span className="text-lg text-[var(--text-secondary)]"> / 5</span>
            </p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--bg-primary)]">
              <div className="h-full w-3/5 rounded-full bg-[var(--accent-maroon)]" />
            </div>
          </div>
        </div>
      </section>

      <section>
        <SectionTitle
          title="Up next"
          action={
            <button
              type="button"
              onClick={() => onGo("study-room")}
              className="font-nav text-[12px] font-semibold text-[var(--accent-maroon)]"
            >
              Open Study Room
            </button>
          }
        />
        <div className="space-y-2">
          {STUDY_TASKS.filter((t) => !t.done)
            .slice(0, 2)
            .map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] px-3.5 py-3"
              >
                <span className="h-4 w-4 rounded-full border border-[var(--border)]" />
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium text-[var(--text-primary)]">
                    {task.title}
                  </p>
                  <p className="text-[11px] text-[var(--text-secondary)]">{task.meta}</p>
                </div>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}

export { MiniSpaces, MiniNotes };

export function MiniPractice() {
  const [tab, setTab] = useState<"quizzes" | "flashcards">("flashcards");
  const items = PRACTICE_DECKS.filter((d) =>
    tab === "flashcards" ? d.kind === "Flashcards" : d.kind === "Quiz"
  );

  return (
    <div className="flex h-full flex-col px-5 py-4 md:px-7">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-xl font-semibold tracking-tight">Practice</h2>
        <button
          type="button"
          className="font-nav inline-flex items-center gap-1.5 rounded-full bg-[var(--text-primary)] px-3 py-1.5 text-[11px] font-semibold text-[var(--bg-secondary)]"
        >
          <Plus size={13} /> New
        </button>
      </div>

      <div className="mt-4 inline-flex w-fit rounded-full border border-[var(--border)] bg-[var(--bg-secondary)] p-0.5">
        {(["quizzes", "flashcards"] as const).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`font-nav rounded-full px-3.5 py-1.5 text-[12px] font-semibold capitalize transition-colors ${
              tab === key
                ? "bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm"
                : "text-[var(--text-secondary)]"
            }`}
          >
            {key}
          </button>
        ))}
      </div>

      <div className="mt-4 grid flex-1 grid-cols-1 gap-3 overflow-y-auto pb-4 sm:grid-cols-2">
        {items.map((deck) => (
          <article
            key={deck.id}
            className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-nav text-[10px] font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
                  {deck.kind}
                </p>
                <h3 className="font-display mt-1 text-[15px] font-semibold">{deck.title}</h3>
                <p className="mt-1 text-[11px] text-[var(--text-secondary)]">{deck.space}</p>
              </div>
              <BookOpenCheck size={16} className="text-[var(--accent-maroon)]" />
            </div>
            <div className="mt-4 flex items-center justify-between text-[11px] text-[var(--text-secondary)]">
              <span>{deck.cards} items</span>
              <span>{deck.mastery}% mastery</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--bg-primary)]">
              <div
                className="h-full rounded-full bg-[var(--accent-maroon)]"
                style={{ width: `${deck.mastery}%` }}
              />
            </div>
            <button
              type="button"
              className="font-nav mt-3 inline-flex items-center gap-1.5 text-[12px] font-semibold text-[var(--accent-maroon)]"
            >
              <Play size={12} /> Study
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}

export function MiniStudyRoom() {
  const [tasks, setTasks] = useState(STUDY_TASKS);
  const [running, setRunning] = useState(false);

  return (
    <div className="mx-auto grid h-full max-w-3xl gap-4 px-5 py-5 md:grid-cols-[1fr_220px] md:px-7">
      <div>
        <h2 className="font-display text-xl font-semibold tracking-tight">Study Room</h2>
        <p className="mt-1 text-[12px] text-[var(--text-secondary)]">
          Focus timer and today’s plan.
        </p>
        <div className="mt-4 space-y-2">
          {tasks.map((task) => (
            <button
              key={task.id}
              type="button"
              onClick={() =>
                setTasks((prev) =>
                  prev.map((t) => (t.id === task.id ? { ...t, done: !t.done } : t))
                )
              }
              className="flex w-full items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] px-3.5 py-3 text-left"
            >
              <span
                className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                  task.done
                    ? "border-[var(--accent-maroon)] bg-[var(--accent-maroon)]"
                    : "border-[var(--border)]"
                }`}
              >
                {task.done && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
              </span>
              <div className="min-w-0">
                <p
                  className={`truncate text-[13px] font-medium ${
                    task.done
                      ? "text-[var(--text-secondary)] line-through"
                      : "text-[var(--text-primary)]"
                  }`}
                >
                  {task.title}
                </p>
                <p className="text-[11px] text-[var(--text-secondary)]">{task.meta}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <aside className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4">
        <p className="font-nav text-[11px] font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
          Focus timer
        </p>
        <p className="font-display mt-3 text-center text-4xl font-semibold tracking-tight">
          25:00
        </p>
        <button
          type="button"
          onClick={() => setRunning((v) => !v)}
          className="font-nav mt-4 w-full rounded-full bg-[var(--text-primary)] py-2.5 text-[12px] font-semibold text-[var(--bg-secondary)]"
        >
          {running ? "Pause" : "Start focus"}
        </button>
      </aside>
    </div>
  );
}

export function MiniGraph() {
  return (
    <div className="relative h-full overflow-hidden bg-[var(--bg-primary)]">
      <div className="absolute left-4 top-4 z-10 flex flex-wrap gap-2">
        <div className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-1.5 shadow-sm">
          <Search size={13} className="text-[var(--text-secondary)]" />
          <input
            placeholder="Find a concept..."
            className="w-36 bg-transparent text-[12px] outline-none placeholder:text-[var(--text-secondary)]"
          />
        </div>
        <button
          type="button"
          className="font-nav inline-flex items-center gap-1 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-1.5 text-[11px] font-semibold text-[var(--text-secondary)]"
        >
          <Filter size={12} /> Filter
        </button>
      </div>

      <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
        {GRAPH_EDGES.map(([a, b]) => {
          const na = GRAPH_NODES.find((n) => n.id === a)!;
          const nb = GRAPH_NODES.find((n) => n.id === b)!;
          return (
            <line
              key={`${a}-${b}`}
              x1={na.x}
              y1={na.y}
              x2={nb.x}
              y2={nb.y}
              stroke="#1a1a18"
              strokeOpacity={0.18}
              strokeWidth={0.35}
            />
          );
        })}
        {GRAPH_NODES.map((n) => (
          <g key={n.id}>
            <circle cx={n.x} cy={n.y} r={2.2} fill="#8B2020" fillOpacity={0.85} />
            <text
              x={n.x + 3}
              y={n.y + 0.8}
              fontSize="3.2"
              fill="#1a1a18"
              fillOpacity={0.75}
              style={{ fontFamily: "var(--font-sans)" }}
            >
              {n.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
