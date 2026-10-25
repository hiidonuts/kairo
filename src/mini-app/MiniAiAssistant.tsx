import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Clock, Maximize2, Mic, Plus, Send, X } from "lucide-react";
import { DEMO_PROMPT, useMiniAiStore } from "./aiStore";

type Props = {
  onExpand: () => void;
  /** Hide the docked launcher/panel when expanded chat tab is active */
  hidden: boolean;
};

function useTypewriter(active: boolean) {
  const messages = useMiniAiStore((s) => s.messages);

  useEffect(() => {
    if (!active || messages.length > 0) return;

    let i = 0;
    useMiniAiStore.getState().setInput("");
    const id = window.setInterval(() => {
      const current = useMiniAiStore.getState().input;
      // Stop if the user edits away from the typewriter sequence
      if (current.length > i || (current.length > 0 && !DEMO_PROMPT.startsWith(current))) {
        window.clearInterval(id);
        return;
      }
      i += 1;
      useMiniAiStore.getState().setInput(DEMO_PROMPT.slice(0, i));
      if (i >= DEMO_PROMPT.length) window.clearInterval(id);
    }, 45);

    return () => window.clearInterval(id);
  }, [active, messages.length]);
}

function ChatThread({ expanded }: { expanded?: boolean }) {
  const messages = useMiniAiStore((s) => s.messages);
  const typing = useMiniAiStore((s) => s.typing);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || messages.length === 0) return;
    // Keep scroll inside the panel — never scroll the landing page
    scroller.scrollTop = scroller.scrollHeight;
  }, [messages, typing]);

  return (
    <div
      ref={scrollerRef}
      className={`no-scrollbar flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-4 ${
        expanded ? "px-6 md:px-10" : ""
      }`}
    >
      {messages.length === 0 && !typing && (
        <div className="flex h-full min-h-[160px] flex-col items-center justify-center gap-3 text-center">
          <img src="/kairo-ai.png" alt="" className="h-14 w-14 object-contain opacity-90" />
          <p className="font-display text-lg font-semibold text-[var(--text-primary)]">Kairo AI</p>
          <p className="max-w-[260px] font-sans text-xs text-[var(--text-secondary)]">
            Ask about your Spaces, notes, and practice, or send the suggested question below.
          </p>
        </div>
      )}

      {messages.map((m) =>
        m.role === "user" ? (
          <div key={m.id} className="flex justify-end">
            <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-[var(--text-primary)] px-3.5 py-2.5 font-sans text-[13px] leading-relaxed text-[var(--bg-secondary)]">
              {m.content}
            </div>
          </div>
        ) : (
          <div key={m.id} className="flex items-start gap-2.5">
            <div className="mt-0.5 h-8 w-8 shrink-0">
              <img src="/kairo-ai.png" alt="" className="h-full w-full object-contain" />
            </div>
            <div className="min-w-0 flex-1 rounded-2xl rounded-tl-sm border border-[var(--border)] bg-[var(--bg-secondary)] p-3.5 font-sans text-[13px] leading-relaxed text-[var(--text-primary)]">
              {m.content}
            </div>
          </div>
        )
      )}

      {typing && (
        <div className="flex items-start gap-2.5">
          <div className="mt-0.5 h-8 w-8 shrink-0">
            <img src="/kairo-ai.png" alt="" className="h-full w-full object-contain" />
          </div>
          <div className="rounded-2xl rounded-tl-sm border border-[var(--border)] bg-[var(--bg-secondary)] px-3.5 py-3 font-sans text-[13px] text-[var(--text-secondary)]">
            Thinking…
          </div>
        </div>
      )}
    </div>
  );
}

function ChatComposer() {
  const input = useMiniAiStore((s) => s.input);
  const setInput = useMiniAiStore((s) => s.setInput);
  const trySend = useMiniAiStore((s) => s.trySend);
  const typing = useMiniAiStore((s) => s.typing);
  const canSend = input.trim() === DEMO_PROMPT && !typing;

  return (
    <div className="relative z-10 border-t border-[var(--border)]/10 bg-[var(--card-bg)] px-4 pt-3 pb-4">
      <div className="relative flex items-end">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              trySend();
            }
          }}
          rows={1}
          placeholder="Type '/' for commands, or ask me anything..."
          className="max-h-[120px] min-h-[40px] w-full resize-none overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] py-2.5 pr-24 pl-3 font-sans text-[13px] text-[var(--text-primary)] shadow-sm transition-[border-color,background-color] placeholder:text-[var(--text-secondary)] focus:border-[var(--text-primary)] focus:bg-[var(--card-bg)] focus:outline-none"
        />
        <div className="absolute right-2 bottom-1.5 flex items-center gap-0.5">
          <button
            type="button"
            className="rounded-full p-2 text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
            aria-label="Voice input"
            title="Voice (preview)"
          >
            <Mic size={14} />
          </button>
          <button
            type="button"
            onClick={() => trySend()}
            disabled={!canSend}
            className="rounded-full p-2 text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] disabled:cursor-default disabled:opacity-35"
            title="Send"
            aria-label="Send"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

export function MiniExpandedChat() {
  useTypewriter(true);

  return (
    <div className="flex h-full min-h-0 flex-col bg-[var(--bg-secondary)]">
      <div className="flex items-center gap-2.5 border-b border-[var(--border)]/20 px-5 py-3">
        <img
          src="/kairo-ai.png"
          alt=""
          className="h-[1.35em] w-[1.35em] shrink-0 rounded-[5px] object-cover"
        />
        <div className="leading-none">
          <h2 className="font-sans translate-y-[0.04em] text-sm font-semibold text-[var(--text-primary)]">
            Kairo AI
          </h2>
          <p className="mt-1 font-sans text-[10px] text-[var(--text-secondary)]">Expanded chat</p>
        </div>
        <div className="ml-2 rounded-full border border-[var(--border)]/50 bg-[var(--bg-secondary)] px-2 py-0.5 text-[10px] font-medium text-[var(--text-secondary)]">
          No space selected
        </div>
      </div>
      <ChatThread expanded />
      <ChatComposer />
    </div>
  );
}

export default function MiniAiAssistant({ onExpand, hidden }: Props) {
  const open = useMiniAiStore((s) => s.open);
  const setOpen = useMiniAiStore((s) => s.setOpen);

  useTypewriter(open && !hidden);

  if (hidden) return null;

  const expandWithoutPageJump = () => {
    const y = window.scrollY;
    setOpen(false);
    onExpand();
    requestAnimationFrame(() => {
      window.scrollTo(0, y);
    });
  };

  return (
    <>
      <motion.button
        type="button"
        initial={false}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          const y = window.scrollY;
          setOpen(true);
          requestAnimationFrame(() => window.scrollTo(0, y));
        }}
        aria-label="Open Kairo AI"
        className={`absolute right-5 bottom-5 z-40 flex h-14 w-14 cursor-pointer items-center justify-center border-0 bg-transparent p-0 transition-opacity ${
          open ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        <img
          src="/kairo-ai.png"
          alt=""
          className="h-full w-full object-contain select-none"
          draggable={false}
        />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-4 bottom-4 z-50 flex h-[min(560px,78%)] w-[min(420px,calc(100%-1.5rem))] flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] shadow-2xl focus:outline-none"
          >
            <div className="relative z-10 flex items-center justify-between border-b border-[var(--border)]/20 bg-[var(--card-bg)] p-3 sm:p-4">
              <div className="flex min-w-0 items-center gap-2 font-sans text-sm leading-none font-semibold text-[var(--text-primary)] sm:gap-2.5">
                <img
                  src="/kairo-ai.png"
                  className="h-[1.35em] w-[1.35em] shrink-0 rounded-[5px] object-cover"
                  alt=""
                />
                <span className="shrink-0 translate-y-[0.04em]">Kairo AI</span>
                <div className="ml-0.5 hidden truncate rounded-full border border-[var(--border)]/50 bg-[var(--bg-secondary)] px-2 py-0.5 text-[10px] font-medium text-[var(--text-secondary)] sm:block">
                  No space selected
                </div>
              </div>
              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  title="History"
                  aria-label="History"
                  className="rounded-full p-2 text-[var(--text-secondary)]"
                >
                  <Clock size={16} />
                </button>
                <button
                  type="button"
                  title="New chat"
                  aria-label="New chat"
                  className="rounded-full p-2 text-[var(--text-secondary)]"
                >
                  <Plus size={18} />
                </button>
                <button
                  type="button"
                  title="Expand chat"
                  aria-label="Expand chat"
                  onClick={expandWithoutPageJump}
                  className="rounded-full p-2 text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
                >
                  <Maximize2 size={16} />
                </button>
                <button
                  type="button"
                  title="Close"
                  aria-label="Close"
                  onClick={() => setOpen(false)}
                  className="rounded-full p-2 text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <ChatThread />
            <ChatComposer />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
