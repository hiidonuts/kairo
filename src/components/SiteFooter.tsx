import {
  WINDOWS_DOWNLOAD_LABEL,
  WINDOWS_DOWNLOAD_URL,
} from "../config/downloads";

const productLinks = [
  ["Features", "#features"],
  ["Try the demo", "#product"],
  ["FAQs", "#faq"],
] as const;

const getKairoLinks = [[WINDOWS_DOWNLOAD_LABEL, WINDOWS_DOWNLOAD_URL]] as const;

export default function SiteFooter() {
  return (
    <footer className="band-ink band-animated relative z-10">
      <div className="page-grid band-content pt-12 md:pt-14">
        <div className="col-span-12 grid gap-10 min-[520px]:gap-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5 lg:col-span-6">
            <a
              href="#kairo"
              aria-label="Kairo"
              className="inline-flex items-center"
            >
              <img
                src="/kairo-ai.png"
                alt=""
                width={36}
                height={36}
                className="h-9 w-9 rounded-[8px] object-cover"
              />
            </a>
            <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-ivory/45">
              Your private study companion
            </p>
          </div>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-10 sm:gap-14 md:col-span-7 md:justify-items-end lg:col-span-6 lg:grid-cols-[auto_auto] lg:gap-20"
          >
            <div>
              <p className="font-mono text-[11px] tracking-[0.14em] text-ivory/35 uppercase">
                Product
              </p>
              <ul className="mt-4 space-y-3">
                {productLinks.map(([label, href]) => (
                  <li key={href + label}>
                    <a
                      href={href}
                      className="font-nav text-[14px] font-medium text-ivory/60 transition-colors hover:text-ivory"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-mono text-[11px] tracking-[0.14em] text-ivory/35 uppercase">
                Get Kairo
              </p>
              <ul className="mt-4 space-y-3">
                {getKairoLinks.map(([label, href]) => (
                  <li key={label}>
                    <a
                      href={href}
                      download
                      className="font-nav text-[14px] font-medium text-ivory/60 transition-colors hover:text-ivory"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>
      </div>

      <div className="page-grid band-content mt-16 pt-6 pb-4 md:mt-20 md:pt-8 md:pb-5">
        <p
          aria-hidden
          className="col-span-12 select-none overflow-hidden text-center font-display text-[clamp(3.5rem,14vw,8rem)] leading-none tracking-tight text-ivory/[0.06]"
        >
          Kairo
        </p>

        <div className="col-span-12 mt-4 border-t border-white/10 pt-4 md:mt-5 md:pt-5">
          <p className="font-mono text-[11px] text-ivory/35">
            © {new Date().getFullYear()} Kairo
          </p>
        </div>
      </div>
    </footer>
  );
}
