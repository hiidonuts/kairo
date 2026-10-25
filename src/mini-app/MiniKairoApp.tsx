import { useCallback, useState } from "react";
import MiniSidebar from "./MiniSidebar";
import MiniTopbar from "./MiniTopbar";
import MiniAiAssistant, { MiniExpandedChat } from "./MiniAiAssistant";
import {
  MiniGraph,
  MiniNotes,
  MiniPractice,
  MiniSpaces,
  MiniStudyRoom,
} from "./pages";
import { NAV_ITEMS, type MiniTab, type MiniTabId } from "./demoData";
import "./mini-app.css";

function titleFor(id: MiniTabId) {
  if (id === "ai_chat") return "Kairo AI";
  return NAV_ITEMS.find((n) => n.id === id)?.label ?? "Home";
}

export default function MiniKairoApp() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeId, setActiveId] = useState<MiniTabId>("spaces");
  const [tabs, setTabs] = useState<MiniTab[]>([{ id: "spaces", title: "Spaces" }]);

  const openTab = useCallback((id: MiniTabId) => {
    if (id === "home") return;
    setTabs((prev) => {
      if (prev.some((t) => t.id === id)) return prev;
      return [...prev, { id, title: titleFor(id) }];
    });
    setActiveId(id);
  }, []);

  const closeTab = useCallback(
    (id: MiniTabId) => {
      setTabs((prev) => {
        if (prev.length <= 1) return prev;
        const next = prev.filter((t) => t.id !== id);
        if (activeId === id) {
          setActiveId(next[next.length - 1]?.id ?? "spaces");
        }
        return next;
      });
    },
    [activeId]
  );

  const expanded = activeId === "ai_chat";

  return (
    <div
      className="mini-kairo pointer-events-auto h-[min(760px,82vh)] w-full border border-[var(--border)] md:h-[min(800px,84vh)]"
      role="region"
      aria-label="Interactive Kairo app preview"
    >
      <div className="flex h-full min-h-0">
        <MiniSidebar
          activeId={activeId === "ai_chat" ? "spaces" : activeId}
          collapsed={collapsed}
          onToggleCollapsed={() => setCollapsed((v) => !v)}
          onNavigate={openTab}
        />

        <div className="flex min-w-0 flex-1 flex-col bg-[var(--bg-primary)]">
          <MiniTopbar
            tabs={tabs}
            activeId={activeId}
            onSelect={setActiveId}
            onClose={closeTab}
          />

          <div className="relative min-h-0 flex-1 overflow-hidden bg-[var(--bg-secondary)]">
            <div className="absolute inset-0 overflow-auto">
              {activeId === "spaces" && <MiniSpaces />}
              {activeId === "notes-list" && <MiniNotes />}
              {activeId === "practice" && <MiniPractice />}
              {activeId === "study-room" && <MiniStudyRoom />}
              {activeId === "knowledge-graph" && <MiniGraph />}
              {activeId === "ai_chat" && <MiniExpandedChat />}
            </div>

            <MiniAiAssistant
              hidden={expanded}
              onExpand={() => openTab("ai_chat")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
