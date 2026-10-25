import type { CSSProperties } from "react";
import { Bell, Keyboard, Plus, X } from "lucide-react";
import type { MiniTab, MiniTabId } from "./demoData";

type Props = {
  tabs: MiniTab[];
  activeId: MiniTabId;
  onSelect: (id: MiniTabId) => void;
  onClose: (id: MiniTabId) => void;
};

export default function MiniTopbar({ tabs, activeId, onSelect, onClose }: Props) {
  return (
    <div className="relative z-10 flex h-10 shrink-0 items-end bg-[var(--tab-bg)] px-3 pt-1">
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-px bg-[var(--border)]"
        aria-hidden
      />

      <div className="no-scrollbar flex min-w-0 flex-1 items-end gap-0.5 overflow-x-auto">
        {tabs.map((tab) => {
          const active = tab.id === activeId;
          return (
            <div
              key={tab.id}
              role="tab"
              tabIndex={0}
              onClick={() => onSelect(tab.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onSelect(tab.id);
              }}
              className={`group relative flex h-full min-w-[120px] max-w-[180px] cursor-pointer items-center gap-2 rounded-t-[10px] px-3 py-[6px] transition-colors ${
                active
                  ? "z-10 text-[var(--text-primary)]"
                  : "bg-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
              }`}
            >
              {active && (
                <div className="absolute inset-x-0 top-0 bottom-0 z-[-1] rounded-t-[10px] border border-b-0 border-[var(--border)] bg-[var(--bg-secondary)]">
                  <div
                    className="arc-tab-left"
                    style={{ "--arc-fill": "var(--bg-secondary)" } as CSSProperties}
                  />
                  <div
                    className="arc-tab-right"
                    style={{ "--arc-fill": "var(--bg-secondary)" } as CSSProperties}
                  />
                </div>
              )}
              <span className="font-nav relative z-10 flex-1 truncate text-[12px] font-medium tracking-tight">
                {tab.title}
              </span>
              {tabs.length > 1 && (
                <button
                  type="button"
                  aria-label={`Close ${tab.title}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose(tab.id);
                  }}
                  className="relative z-10 rounded-md p-0.5 text-[var(--text-secondary)] opacity-0 transition-opacity hover:bg-[var(--border)] group-hover:opacity-100 focus-visible:opacity-100"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="mb-1.5 flex shrink-0 items-center gap-0.5 pr-1 text-[var(--text-secondary)]">
        <button
          type="button"
          className="rounded-md p-1.5 transition-colors hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
          aria-label="New note"
          title="New note (preview)"
        >
          <Plus size={15} />
        </button>
        <button
          type="button"
          className="rounded-md p-1.5 transition-colors hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
          aria-label="Keyboard shortcuts"
          title="Shortcuts (preview)"
        >
          <Keyboard size={15} />
        </button>
        <button
          type="button"
          className="rounded-md p-1.5 transition-colors hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
          aria-label="Notifications"
          title="Notifications (preview)"
        >
          <Bell size={15} />
        </button>
      </div>
    </div>
  );
}
