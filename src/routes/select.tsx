import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/select")({
  head: () => ({ meta: [{ title: "Choose a Frame — Photo Booth" }] }),
  component: SelectPage,
});

type FrameId =
  "classic" | "noir" | "valentine" | "newyear" | "formula1" | "disney" | "stardust" | "summer";

type Frame = {
  id: FrameId;
  name: string;
  tagline: string;
  bg: string;
  border: string;
  accent: string;
  caption: string;
  decor: DecorType;
};

type DecorType = "none" | "hearts" | "confetti" | "checker" | "mickey" | "stars" | "palms";

const FRAMES: Frame[] = [
  {
    id: "classic",
    name: "Classic White",
    tagline: "Timeless · Minimal",
    bg: "#ffffff",
    border: "#111111",
    accent: "#111111",
    caption: "Photo Booth",
    decor: "none",
  },
  {
    id: "noir",
    name: "Midnight Noir",
    tagline: "Editorial · Bold",
    bg: "#0a0a0a",
    border: "#0a0a0a",
    accent: "#f5f5f5",
    caption: "Midnight Memories",
    decor: "stars",
  },
  {
    id: "valentine",
    name: "Valentine",
    tagline: "Love · Romance",
    bg: "#fde2e7",
    border: "#9b1c3a",
    accent: "#9b1c3a",
    caption: "Be Mine",
    decor: "hearts",
  },
  {
    id: "newyear",
    name: "New Year's Eve",
    tagline: "Confetti · Champagne",
    bg: "#0b0b1f",
    border: "#d4af37",
    accent: "#d4af37",
    caption: "Happy New Year",
    decor: "confetti",
  },
  {
    id: "formula1",
    name: "Formula 1",
    tagline: "Speed · Grid",
    bg: "#e10600",
    border: "#0a0a0a",
    accent: "#ffffff",
    caption: "Pole Position",
    decor: "checker",
  },
  {
    id: "disney",
    name: "Disney Magic",
    tagline: "Whimsy · Sparkle",
    bg: "#1a2a6c",
    border: "#f7c948",
    accent: "#f7c948",
    caption: "A Magical Day",
    decor: "mickey",
  },
  {
    id: "stardust",
    name: "Stardust",
    tagline: "Dreamy · Cosmic",
    bg: "#111028",
    border: "#111028",
    accent: "#f6c453",
    caption: "Among the Stars",
    decor: "stars",
  },
  {
    id: "summer",
    name: "Summer Beach",
    tagline: "Sun · Salt",
    bg: "#fef3c7",
    border: "#0d6b6b",
    accent: "#0d6b6b",
    caption: "Endless Summer",
    decor: "palms",
  },
];

function HeartIcon({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="currentColor">
      <path d="M12 21s-7-4.35-9.5-9.05C.84 8.78 2.6 5 6.2 5c2.05 0 3.4 1.05 4.3 2.4l1.5 2 1.5-2C14.4 6.05 15.75 5 17.8 5c3.6 0 5.36 3.78 3.7 6.95C19 16.65 12 21 12 21z" />
    </svg>
  );
}

function StarIcon({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="currentColor">
      <path d="M12 2l2.6 6.6L22 9.3l-5.5 4.7L18.2 22 12 18.1 5.8 22l1.7-8L2 9.3l7.4-.7L12 2z" />
    </svg>
  );
}

function MickeyIcon({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="currentColor">
      <circle cx="12" cy="14" r="6" />
      <circle cx="5" cy="6" r="3.4" />
      <circle cx="19" cy="6" r="3.4" />
    </svg>
  );
}

function PalmIcon({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="currentColor">
      <path
        d="M12 22V10M12 10c-3-4-7-3-8-1 2-1 5 0 7 2-3-2-7 0-8 3 3-2 6-1 8 1-2-3-1-7 2-8-1 3 0 6 2 8-3 0-6 2-7 5 2-3 5-3 7-3-4 1-6 4-6 7"
        stroke="currentColor"
        strokeWidth="0.8"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Decorations({ decor, accent }: { decor: DecorType; accent: string }) {
  if (decor === "none") return null;
  if (decor === "hearts") {
    return (
      <>
        <HeartIcon
          className="absolute top-2 left-3 w-3 h-3"
          style={{ color: accent, opacity: 0.7 }}
        />
        <HeartIcon
          className="absolute top-6 right-3 w-2.5 h-2.5"
          style={{ color: accent, opacity: 0.5 }}
        />
        <HeartIcon
          className="absolute bottom-12 left-3 w-2.5 h-2.5"
          style={{ color: accent, opacity: 0.6 }}
        />
        <HeartIcon
          className="absolute bottom-16 right-3 w-3 h-3"
          style={{ color: accent, opacity: 0.7 }}
        />
      </>
    );
  }
  if (decor === "stars") {
    return (
      <>
        <StarIcon
          className="absolute top-2 left-3 w-2.5 h-2.5"
          style={{ color: accent, opacity: 0.85 }}
        />
        <StarIcon
          className="absolute top-4 right-4 w-2 h-2"
          style={{ color: accent, opacity: 0.6 }}
        />
        <StarIcon
          className="absolute bottom-14 left-2 w-2 h-2"
          style={{ color: accent, opacity: 0.6 }}
        />
        <StarIcon
          className="absolute bottom-10 right-3 w-2.5 h-2.5"
          style={{ color: accent, opacity: 0.85 }}
        />
      </>
    );
  }
  if (decor === "confetti") {
    const pieces = [
      { top: "4px", left: "10px", rot: -15, c: "#d4af37" },
      { top: "12px", left: "60%", rot: 25, c: "#ffffff" },
      { top: "30px", left: "20%", rot: 10, c: "#e94560" },
      { bottom: "60px", left: "12px", rot: -30, c: "#ffffff" },
      { bottom: "80px", right: "10px", rot: 40, c: "#d4af37" },
      { bottom: "40px", left: "55%", rot: -20, c: "#5ac8fa" },
    ];
    return (
      <>
        {pieces.map((p, i) => (
          <span
            key={i}
            className="absolute w-1.5 h-3"
            style={{
              top: p.top,
              bottom: p.bottom,
              left: p.left,
              right: p.right,
              background: p.c,
              transform: `rotate(${p.rot}deg)`,
            }}
          />
        ))}
      </>
    );
  }
  if (decor === "checker") {
    return (
      <>
        <div
          className="absolute top-1 left-1 right-1 h-2"
          style={{
            backgroundImage: "repeating-linear-gradient(90deg, #000 0 8px, #fff 8px 16px)",
          }}
        />
        <div
          className="absolute bottom-14 left-1 right-1 h-2"
          style={{
            backgroundImage: "repeating-linear-gradient(90deg, #000 0 8px, #fff 8px 16px)",
          }}
        />
      </>
    );
  }
  if (decor === "mickey") {
    return (
      <>
        <MickeyIcon
          className="absolute top-2 left-2 w-3 h-3"
          style={{ color: accent, opacity: 0.9 }}
        />
        <MickeyIcon
          className="absolute top-3 right-2 w-2.5 h-2.5"
          style={{ color: accent, opacity: 0.7 }}
        />
        <MickeyIcon
          className="absolute bottom-12 left-2 w-2.5 h-2.5"
          style={{ color: accent, opacity: 0.7 }}
        />
        <StarIcon
          className="absolute bottom-16 right-3 w-2 h-2"
          style={{ color: accent, opacity: 0.85 }}
        />
      </>
    );
  }
  if (decor === "palms") {
    return (
      <>
        <PalmIcon
          className="absolute top-1 left-2 w-4 h-4"
          style={{ color: accent, opacity: 0.7 }}
        />
        <PalmIcon
          className="absolute top-2 right-2 w-3.5 h-3.5 -scale-x-100"
          style={{ color: accent, opacity: 0.6 }}
        />
        <PalmIcon
          className="absolute bottom-12 left-2 w-3.5 h-3.5"
          style={{ color: accent, opacity: 0.6 }}
        />
        <PalmIcon
          className="absolute bottom-14 right-2 w-3.5 h-3.5 -scale-x-100"
          style={{ color: accent, opacity: 0.7 }}
        />
      </>
    );
  }
  return null;
}

function FramePreview({ frame, shots }: { frame: Frame; shots: string[] }) {
  const placeholder = !shots.length;
  const items = placeholder ? Array.from({ length: 4 }) : shots;
  const isLight = ["classic", "valentine", "summer", "formula1"].includes(frame.id);

  return (
    <div
      className="relative mx-auto shadow-2xl"
      style={{
        background: frame.bg,
        border: `2px solid ${frame.border}`,
        padding: "14px 12px 24px",
        width: 150,
      }}
    >
      <Decorations decor={frame.decor} accent={frame.accent} />

      <div className="flex flex-col gap-2 relative">
        {items.map((src, i) => (
          <div
            key={i}
            className="relative w-full overflow-hidden"
            style={{
              aspectRatio: "1/1",
              background: isLight ? "#e9e6df" : "#1f1d3a",
              border: `1px solid ${frame.border}`,
            }}
          >
            {typeof src === "string" && (
              <img src={src} alt={`shot ${i + 1}`} className="w-full h-full object-cover" />
            )}
          </div>
        ))}
      </div>

      <p
        className="text-center mt-3 text-[8px] uppercase tracking-[0.25em]"
        style={{ color: frame.accent, fontFamily: "Georgia, serif" }}
      >
        {frame.caption}
      </p>
    </div>
  );
}

function SelectPage() {
  const [shots, setShots] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("booth_shots");
      if (raw) setShots(JSON.parse(raw));
    } catch (_) {
      // sessionStorage may be unavailable or contain invalid JSON
    }
  }, []);

  const current = FRAMES[index];
  const prev = () => setIndex((i) => (i - 1 + FRAMES.length) % FRAMES.length);
  const next = () => setIndex((i) => (i + 1) % FRAMES.length);

  const confirm = () => {
    sessionStorage.setItem("booth_frame", current.id);
    navigate({ to: "/deliver" });
  };

  return (
    <div
      className="min-h-screen w-full bg-[#f3f0e8] text-[#111] flex flex-col"
      style={{ fontFamily: "Georgia, serif" }}
    >
      <header className="flex justify-between items-center px-8 py-5 border-b border-black/10">
        <Link
          to="/camera"
          className="text-xs uppercase tracking-[0.25em] text-black/50 hover:text-black transition-colors"
        >
          ← Retake
        </Link>
        <span className="text-[10px] uppercase tracking-[0.35em] text-black/40">
          Step 02 · Choose Frame
        </span>
        <span className="text-[10px] uppercase tracking-[0.35em] text-black/40">
          {String(index + 1).padStart(2, "0")} / {String(FRAMES.length).padStart(2, "0")}
        </span>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl italic tracking-tight">{current.name}</h1>
          <p className="text-xs uppercase tracking-[0.3em] text-black/40 mt-2">{current.tagline}</p>
        </div>

        <div className="flex items-center justify-center gap-6 md:gap-12">
          <button
            onClick={prev}
            aria-label="Previous frame"
            className="w-10 h-10 flex items-center justify-center text-black/40 hover:text-black text-3xl font-light active:scale-90 transition"
          >
            ‹
          </button>

          <div className="bg-white p-4 border-2 border-black shadow-[8px_8px_0_0_rgba(0,0,0,0.08)]">
            <FramePreview frame={current} shots={shots} />
          </div>

          <button
            onClick={next}
            aria-label="Next frame"
            className="w-10 h-10 flex items-center justify-center text-black/40 hover:text-black text-3xl font-light active:scale-90 transition"
          >
            ›
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mt-8 max-w-xs">
          {FRAMES.map((f, i) => (
            <button
              key={f.id}
              onClick={() => setIndex(i)}
              aria-label={f.name}
              className={`w-2 h-2 rounded-full transition ${
                i === index ? "bg-black scale-125" : "bg-black/20 hover:bg-black/40"
              }`}
            />
          ))}
        </div>

        <button
          onClick={confirm}
          className="mt-10 px-10 py-3 bg-black text-white text-xs uppercase tracking-[0.3em] hover:bg-black/85 active:scale-95 transition"
        >
          Use this frame
        </button>
      </main>
    </div>
  );
}
