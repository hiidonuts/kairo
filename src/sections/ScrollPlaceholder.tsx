/** Tall strip so Stage 1 scroll / graph fade can still be tested. */
export default function ScrollPlaceholder() {
  return (
    <section
      aria-label="More coming soon"
      className="relative z-10 border-t border-charcoal/8 bg-transparent"
      style={{ minHeight: "80vh" }}
    >
      <div className="page-grid py-24">
        <div className="col-span-12 md:col-span-8">
          <p className="text-sm text-charcoal/45">Placeholder</p>
          <h2 className="mt-4 font-display text-4xl tracking-tight text-charcoal md:text-5xl">
            Later sections land here.
          </h2>
          <p className="mt-4 max-w-md text-base text-charcoal/60">
            Keep scrolling to check page progress and the graph behind the hero.
          </p>
        </div>
      </div>
    </section>
  );
}
