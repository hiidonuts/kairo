import { useRef } from "react";
import FeatureParallaxFrame from "../components/FeatureParallaxFrame";
import { useSectionReveal } from "../hooks/useSectionReveal";

const features = [
  {
    label: "1. Assist",
    title: "Study companion",
    body: "AI that explains topics, schedules routines, and remembers your preference.",
    image: "/media/features/feature-01.png",
    width: 1024,
    height: 713,
  },
  {
    label: "2. Organise",
    title: "Keep your materials",
    body: "Drop study materials and documents into subject libraries.",
    image: "/media/features/feature-02.png",
    width: 1024,
    height: 712,
  },
  {
    label: "3. Write",
    title: "Jot down ideas",
    body: "Type in your study notes and organise them effortlessly.",
    image: "/media/features/feature-03.png",
    width: 1024,
    height: 713,
  },
  {
    label: "4. Practice",
    title: "Curate assessments",
    body: "Create quizzes and flashcards based on your materials.",
    image: "/media/features/feature-04.png",
    width: 540,
    height: 380,
  },
  {
    label: "5. Focus",
    title: "Quiet study room",
    body: "Manage your study time, tasks and deadlines in one place.",
    image: "/media/features/feature-05.png",
    width: 540,
    height: 380,
  },
  {
    label: "6. Connect",
    title: "Visualise",
    body: "Gain insights on subject topics through the knowledge graph.",
    image: "/media/features/feature-06.png",
    width: 540,
    height: 383,
  },
] as const;

export default function FeaturesSection() {
  const root = useRef<HTMLElement>(null);
  useSectionReveal(root);

  return (
    <section
      id="features"
      ref={root}
      aria-labelledby="features-heading"
      className="band-ink band-animated relative z-10"
    >
      <div className="page-grid band-content py-[var(--space-section)]">
        <div className="col-span-12">
          <h2
            id="features-heading"
            data-reveal
            className="display-md text-ivory"
          >
            Features
          </h2>
        </div>

        <ol className="col-span-12 mt-6 grid grid-cols-1 border-t border-white/12 md:mt-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <li
              key={f.title}
              data-reveal
              className="border-b border-white/12 py-10 md:border-r md:border-white/12 md:px-6 md:py-12 md:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(3n)]:border-r-0"
            >
              <p className="micro-label micro-label-on-dark">{f.label}</p>
              <h3 className="display-sm mt-3 truncate text-ivory">{f.title}</h3>
              <p className="mt-3 line-clamp-2 max-w-sm text-[15px] leading-relaxed text-ivory/55">
                {f.body}
              </p>
              <FeatureParallaxFrame
                src={f.image}
                alt={f.title}
                width={f.width}
                height={f.height}
              />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
