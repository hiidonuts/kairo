import { useId, useRef, useState } from "react";
import { useSectionReveal } from "../hooks/useSectionReveal";

const faqs = [
  {
    q: "What can Kairo AI do?",
    a: "It can explain topics based on your study materials, schedule study plans, help with research tasks, and so much more, even when you're offline.",
  },
  {
    q: "Is my study data private?",
    a: "Yes. Kairo does not keep your study materials on the cloud, only on your device.",
  },
  {
    q: "How does pricing work?",
    a: "Kairo is completely free to use. Don't worry about subscriptions!",
  },
] as const;

function FaqItem({
  q,
  a,
  open,
  onToggle,
}: {
  q: string;
  a: string;
  open: boolean;
  onToggle: () => void;
}) {
  const panelId = useId();
  const buttonId = useId();

  return (
    <div className="border-b border-dashed border-[var(--line)]">
      <h3>
        <button
          type="button"
          id={buttonId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="group flex w-full items-start justify-between gap-3 py-5 text-left min-[520px]:gap-6 min-[520px]:py-6 md:py-7"
        >
          <span className="font-display text-lg tracking-tight text-balance text-charcoal transition-colors group-hover:text-maroon min-[520px]:text-xl md:text-[1.3rem]">
            {q}
          </span>
          <span
            className={`font-mono mt-1.5 shrink-0 text-sm text-charcoal/35 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              open ? "rotate-45 text-maroon" : ""
            }`}
            aria-hidden
          >
            +
          </span>
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        aria-hidden={!open}
        className="grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <p className="max-w-2xl pb-6 text-[15px] leading-relaxed text-[var(--muted)] md:pb-7">
            {a}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FaqSection() {
  const root = useRef<HTMLElement>(null);
  useSectionReveal(root);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      ref={root}
      aria-labelledby="faq-heading"
      className="relative z-10 border-t border-[var(--line)]"
    >
      <div className="page-grid py-[var(--space-section)]">
        <div className="col-span-12">
          <h2
            id="faq-heading"
            data-reveal
            className="display-md text-charcoal"
          >
            FAQs
          </h2>
        </div>

        <div
          data-reveal
          className="col-span-12 mt-10 border-t border-[var(--line)]"
        >
          {faqs.map((item, i) => (
            <FaqItem
              key={item.q}
              q={item.q}
              a={item.a}
              open={openIndex === i}
              onToggle={() => setOpenIndex((prev) => (prev === i ? null : i))}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
