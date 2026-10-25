import { useEffect, useState } from "react";
import { ChevronDown, Clock, Pause, Play, Plus, RotateCcw } from "lucide-react";

const FOCUS_SECONDS = 25 * 60;

function formatClock(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function MiniStudyRoom() {
  const [filter, setFilter] = useState<"all" | "tasks" | "deadlines">("all");
  const [running, setRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(FOCUS_SECONDS);
  const [setupOpen, setSetupOpen] = useState(false);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setTimeLeft((t) => (t <= 1 ? FOCUS_SECONDS : t - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [running]);

  const radius = 96;
  const svgSize = (radius + 14) * 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (timeLeft / FOCUS_SECONDS) * circumference;
  const untouched = !running && timeLeft === FOCUS_SECONDS;

  const emptyCopy =
    filter === "tasks"
      ? "No tasks yet. Add one when you're ready."
      : filter === "deadlines"
        ? "No deadlines yet."
        : "Your list is clear. Add a task whenever you're ready.";

  return (
    <div className="mx-auto flex h-full w-full max-w-6xl flex-col px-3 py-4 min-[520px]:py-5 md:px-6">
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-5 min-[720px]:grid-cols-2 min-[720px]:gap-8 lg:gap-10">
        <div className="flex min-h-0 flex-col items-center justify-between">
          <div className="relative flex w-full flex-1 flex-col items-center justify-center">
            <div className="relative z-20 mb-5">
              <button
                type="button"
                onClick={() => setSetupOpen((v) => !v)}
                className={`font-sans flex items-center gap-2 rounded-full border border-[var(--border)] px-3.5 py-1.5 text-[11px] font-medium transition-colors ${
                  setupOpen
                    ? "bg-[var(--border)]/10 text-[var(--text-primary)]"
                    : "bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--border)]/10"
                }`}
              >
                <Clock size={13} className="text-[var(--text-secondary)]" />
                <span>
                  25 min focus, 5 min break,{" "}
                  <span className="text-[var(--text-secondary)]">World History</span>
                </span>
                <ChevronDown size={13} className="text-[var(--text-secondary)]" />
              </button>
              {setupOpen && (
                <div className="absolute top-full left-1/2 z-30 mt-2 w-64 -translate-x-1/2 rounded-2xl border border-[var(--border)]/40 bg-[var(--card-bg)] p-4 shadow-xl">
                  <p className="font-nav text-[12px] font-medium text-[var(--text-primary)]">
                    Timer lengths
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <label className="block">
                      <span className="mb-1 block text-[10px] font-medium text-[var(--text-secondary)]">
                        Focus
                      </span>
                      <div className="rounded-xl border border-[var(--border)]/50 bg-[var(--bg-tertiary)] px-3 py-2 text-[12px] tabular-nums">
                        25
                      </div>
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-[10px] font-medium text-[var(--text-secondary)]">
                        Break
                      </span>
                      <div className="rounded-xl border border-[var(--border)]/50 bg-[var(--bg-tertiary)] px-3 py-2 text-[12px] tabular-nums">
                        5
                      </div>
                    </label>
                  </div>
                  <p className="mt-2 text-[10px] leading-snug text-[var(--text-secondary)]">
                    Assigned to World History for this preview.
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col items-center gap-5">
              <div className="relative flex items-center justify-center">
                <svg width={svgSize} height={svgSize} className="-rotate-90">
                  <circle
                    cx={svgSize / 2}
                    cy={svgSize / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="transparent"
                    className="text-[var(--border)]"
                  />
                  <circle
                    cx={svgSize / 2}
                    cy={svgSize / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="7"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className="text-[var(--accent-maroon)] transition-[stroke-dashoffset] duration-1000 ease-linear"
                    strokeLinecap="round"
                  />
                </svg>
                <div
                  className="absolute flex flex-col items-center justify-center"
                  role="timer"
                  aria-label={`Focus ${formatClock(timeLeft)}`}
                >
                  <div className="font-display text-5xl leading-none tracking-tighter text-[var(--accent-maroon)] tabular-nums md:text-6xl">
                    {formatClock(timeLeft)}
                  </div>
                  <div className="font-nav mt-2 text-[12px] font-medium text-[var(--text-primary)]">
                    Focus
                    {!running && !untouched && (
                      <span className="text-[var(--text-secondary)]">, paused</span>
                    )}
                  </div>
                  <div className="mt-0.5 text-[11px] text-[var(--text-secondary)]">
                    Next: 5 min break
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setRunning(false);
                    setTimeLeft(FOCUS_SECONDS);
                  }}
                  disabled={untouched}
                  aria-label="Restart"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-secondary)] transition-colors hover:bg-[var(--border)]/40 hover:text-[var(--text-primary)] disabled:pointer-events-none disabled:opacity-40"
                >
                  <RotateCcw size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => setRunning((v) => !v)}
                  aria-label={running ? "Pause" : untouched ? "Start" : "Resume"}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent-maroon)] text-white shadow-lg transition-opacity hover:opacity-90"
                >
                  {running ? (
                    <Pause size={24} />
                  ) : (
                    <Play size={24} className="ml-0.5" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRunning(false);
                    setTimeLeft(FOCUS_SECONDS);
                  }}
                  disabled={untouched}
                  aria-label="Stop"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-secondary)] transition-colors hover:bg-[var(--border)]/40 hover:text-[var(--text-primary)] disabled:pointer-events-none disabled:opacity-40"
                >
                  <div className="h-2.5 w-2.5 rounded-sm bg-current" />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 flex h-[88px] w-full shrink-0 flex-col items-center justify-center border-t border-[var(--border)] px-2">
            <div className="grid w-full max-w-md grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-3 text-[var(--text-secondary)]">
              <div className="flex flex-col items-center text-center">
                <span className="font-nav mb-0.5 text-[10px] font-medium">Today</span>
                <span className="text-[15px] font-medium text-[var(--text-primary)] tabular-nums">
                  45 min
                </span>
                <span className="text-[10px]">2 sessions</span>
              </div>
              <div className="h-8 w-px bg-[var(--border)]" />
              <div className="flex flex-col items-center text-center">
                <span className="font-nav mb-0.5 text-[10px] font-medium">Last 7 days</span>
                <span className="text-[15px] font-medium text-[var(--text-primary)] tabular-nums">
                  4 h 10 min
                </span>
                <span className="text-[10px]">9 sessions</span>
              </div>
              <div className="h-8 w-px bg-[var(--border)]" />
              <div className="flex flex-col items-center text-center">
                <span className="font-nav mb-0.5 text-[10px] font-medium">Avg quality</span>
                <span className="text-[15px] font-medium text-[var(--text-primary)] tabular-nums">
                  4.2
                </span>
                <span className="text-[10px]">7 days</span>
              </div>
            </div>
          </div>
        </div>

        <section className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] shadow-[0_8px_30px_rgb(0_0_0/0.04)]">
          <div className="shrink-0 space-y-3 px-4 pt-4 pb-3 md:px-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-xl text-[var(--text-primary)] md:text-2xl">
                To-do list
              </h2>
              <button
                type="button"
                className="font-nav flex items-center gap-1.5 rounded-lg bg-[var(--text-primary)] px-3 py-1.5 text-[12px] font-medium text-[var(--bg-primary)] hover:opacity-90"
              >
                <Plus size={13} /> Add task
              </button>
            </div>
            <div className="inline-flex rounded-xl bg-[var(--bg-tertiary)] p-0.5">
              {(["all", "tasks", "deadlines"] as const).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFilter(key)}
                  className={`font-nav rounded-[10px] px-3 py-1.5 text-[11px] font-semibold capitalize transition-colors ${
                    filter === key
                      ? "bg-[var(--card-bg)] text-[var(--text-primary)] shadow-sm"
                      : "text-[var(--text-secondary)]"
                  }`}
                >
                  {key}
                </button>
              ))}
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-4 md:px-4">
            <p className="px-2 py-10 text-center text-[12px] leading-relaxed text-[var(--text-secondary)]">
              {emptyCopy}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
