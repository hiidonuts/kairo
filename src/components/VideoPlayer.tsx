import { useRef, useState } from "react";

type Props = {
  className?: string;
};

export default function VideoPlayer({ className = "" }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-charcoal ${className}`}>
      <video
        ref={videoRef}
        className="aspect-video w-full object-cover"
        poster="/media/kairo-poster.svg"
        playsInline
        preload="metadata"
        onEnded={() => setPlaying(false)}
      >
        {/* Replace src when real assets land */}
        <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyride.mp4" type="video/mp4" />
        <track kind="captions" srcLang="en" label="English" src="/media/kairo-captions.vtt" default />
      </video>

      {!playing && (
        <button
          type="button"
          onClick={toggle}
          className="absolute inset-0 flex items-center justify-center"
          aria-label="Play video: A minute with Kairo"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-ivory text-charcoal">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M8 5.5v13l11-6.5-11-6.5z" />
            </svg>
          </span>
        </button>
      )}

      {playing && (
        <button
          type="button"
          onClick={toggle}
          className="absolute bottom-4 right-4 rounded-lg bg-ivory/90 px-3 py-1.5 text-xs text-charcoal"
        >
          Pause
        </button>
      )}
    </div>
  );
}
