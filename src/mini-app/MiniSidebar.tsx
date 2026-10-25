import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Clock,
  FileText,
  LayoutGrid,
  LineChart,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { CONTINUE_DOCS, NAV_ITEMS, type MiniTabId } from "./demoData";
import { NavIcon } from "./NavIcon";
import { useMiniStore } from "./store";

type Props = {
  activeId: Exclude<MiniTabId, "ai_chat">;
  collapsed: boolean;
  onToggleCollapsed: () => void;
  onNavigate: (id: MiniTabId) => void;
};

const DISABLED_NAV = new Set<MiniTabId>(["home"]);

export default function MiniSidebar({
  activeId,
  collapsed,
  onToggleCollapsed,
  onNavigate,
}: Props) {
  const spaces = useMiniStore((s) => s.spaces);
  const pinned = spaces.filter((s) => s.pinned);
  const [spacesOpen, setSpacesOpen] = useState(true);
  const [recentsOpen, setRecentsOpen] = useState(true);
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <aside
      className="relative z-20 flex h-full shrink-0 flex-col overflow-hidden border-r border-[var(--border)] bg-[var(--sidebar-bg)]"
      style={{ width: collapsed ? 64 : 220 }}
    >
      <div
        className={`flex h-12 shrink-0 items-center pt-2 ${
          collapsed ? "justify-center px-0" : "justify-between px-5"
        }`}
      >
        {!collapsed && (
          <h1 className="font-display text-xl font-bold tracking-tight text-[var(--text-primary)]">
            Kairo
          </h1>
        )}
        <button
          type="button"
          onClick={onToggleCollapsed}
          className="rounded-md p-1.5 text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      <div
        className={`no-scrollbar flex-1 space-y-6 overflow-y-auto py-4 ${
          collapsed ? "px-2" : "px-3"
        }`}
      >
        <div className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const disabled = DISABLED_NAV.has(item.id);
            const active = !disabled && activeId === item.id;

            if (disabled) {
              return (
                <button
                  key={item.id}
                  type="button"
                  disabled
                  title={`${item.label} is not available in this preview`}
                  className={`font-nav flex w-full items-center gap-3 rounded-full px-3 py-2.5 text-[13px] font-semibold text-[var(--text-secondary)] opacity-40 ${
                    collapsed ? "justify-center rounded-md px-0" : ""
                  }`}
                >
                  <NavIcon id={item.id} size={18} active={false} hovered={false} />
                  {!collapsed && <span className="leading-none">{item.label}</span>}
                </button>
              );
            }

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                onMouseEnter={() => setHovered(item.id)}
                onMouseLeave={() => setHovered(null)}
                className={`font-nav relative flex w-full items-center gap-3 rounded-full px-3 py-2.5 text-[13px] font-semibold transition-all ${
                  active
                    ? "bg-transparent text-[var(--nav-active-text)] shadow-sm"
                    : "text-[var(--text-secondary)] hover:bg-[var(--border)]/10 hover:text-[var(--text-primary)]"
                } ${collapsed ? "justify-center rounded-md px-0" : ""}`}
              >
                {active && (
                  <span
                    className={`absolute h-1.5 w-1.5 rounded-full bg-[var(--accent-maroon)] ${
                      collapsed ? "left-1" : "left-2"
                    }`}
                  />
                )}
                <NavIcon
                  id={item.id}
                  size={18}
                  active={active}
                  hovered={hovered === item.id}
                  className={active && !collapsed ? "ml-2" : undefined}
                />
                {!collapsed && <span className="leading-none">{item.label}</span>}
              </button>
            );
          })}

          <button
            type="button"
            disabled
            title="Progress is not available in this preview"
            className={`font-nav flex w-full items-center gap-3 rounded-full px-3 py-2.5 text-[13px] font-semibold text-[var(--text-secondary)] opacity-40 ${
              collapsed ? "justify-center rounded-md px-0" : ""
            }`}
          >
            <LineChart size={18} />
            {!collapsed && <span className="leading-none">Progress</span>}
          </button>
        </div>

        {!collapsed && (
          <>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setSpacesOpen((v) => !v)}
                className="font-nav flex w-full items-center justify-between px-2 py-1.5 text-[12px] font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                <span className="flex items-center gap-2">
                  <LayoutGrid size={13} />
                  Pinned spaces
                </span>
                {spacesOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
              </button>
              {spacesOpen && (
                <div className="ml-3 mt-1 space-y-0.5 border-l-2 border-[var(--border)]/30 pl-3">
                  {pinned.length === 0 ? (
                    <div className="px-2 py-1.5 font-nav text-[12px] text-[var(--text-secondary)]">
                      No pinned spaces
                    </div>
                  ) : (
                    pinned.map((space) => (
                      <button
                        key={space.id}
                        type="button"
                        onClick={() => onNavigate("spaces")}
                        className="font-nav flex w-full items-center gap-2.5 px-2 py-1.5 text-left text-[12px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                      >
                        <span
                          className="h-2 w-2 shrink-0 border border-[var(--border)]"
                          style={{ backgroundColor: space.color }}
                        />
                        <span className="truncate">{space.name}</span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setRecentsOpen((v) => !v)}
                className="font-nav flex w-full items-center justify-between px-2 py-1.5 text-[12px] font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                <span className="flex items-center gap-2">
                  <Clock size={13} />
                  Continue
                </span>
                {recentsOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
              </button>
              {recentsOpen && (
                <div className="ml-3 mt-1 space-y-0.5 border-l-2 border-[var(--border)]/30 pl-3">
                  {CONTINUE_DOCS.map((doc) => (
                    <button
                      key={doc.id}
                      type="button"
                      onClick={() => onNavigate("notes-list")}
                      className="font-nav flex w-full items-center gap-2.5 px-2 py-1.5 text-left text-[12px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    >
                      <FileText size={13} className="shrink-0 opacity-50" />
                      <span className="truncate">{doc.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <div className={`mt-auto border-t border-[var(--border)]/30 p-3 ${collapsed ? "px-2" : ""}`}>
        <div
          className={`flex items-center gap-2.5 rounded-xl px-2 py-2 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--bg-primary)] font-nav text-[11px] font-bold text-[var(--text-primary)]">
            Y
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1 text-left">
              <div className="font-nav truncate text-[13px] font-semibold text-[var(--text-primary)]">
                You
              </div>
              <div className="font-nav text-[11px] text-[var(--text-secondary)]">Profile</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
