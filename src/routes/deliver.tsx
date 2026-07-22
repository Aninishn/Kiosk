import { createFileRoute, Link, useLocation } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/deliver")({
  head: () => ({ meta: [{ title: "Delivery — Photo Booth" }] }),
  component: DeliverPage,
});

type FrameId = "classic" | "noir" | "hearts" | "stars";

const FRAME_META: Record<
  FrameId,
  { bg: string; border: string; accent: string; decor: "hearts" | "stars" | "none" }
> = {
  classic: { bg: "#ffffff", border: "#111111", accent: "#111111", decor: "none" },
  noir: { bg: "#0a0a0a", border: "#0a0a0a", accent: "#f5f5f5", decor: "stars" },
  hearts: { bg: "#fbdce4", border: "#8a1f3a", accent: "#8a1f3a", decor: "hearts" },
  stars: { bg: "#111028", border: "#111028", accent: "#f6c453", decor: "stars" },
};

function playChime() {
  try {
    const Ctx = (window.AudioContext ||
      (window as Window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext) as typeof AudioContext;
    const ctx = new Ctx();
    [880, 1320].forEach((f, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.frequency.value = f;
      o.type = "triangle";
      g.gain.setValueAtTime(0.0001, ctx.currentTime + i * 0.12);
      g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + i * 0.12 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.12 + 0.45);
      o.connect(g).connect(ctx.destination);
      o.start(ctx.currentTime + i * 0.12);
      o.stop(ctx.currentTime + i * 0.12 + 0.5);
    });
  } catch (_) {
    // Audio not available in this environment
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function renderStrip(shots: string[], frameId: FrameId): Promise<string> {
  const meta = FRAME_META[frameId];
  const W = 600;
  const padX = 46;
  const padTop = 52;
  const gap = 24;
  const photoW = W - padX * 2;
  const photoH = photoW;
  const footer = 80;
  const H = padTop + (photoH + gap) * 4 - gap + footer;

  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;

  ctx.fillStyle = meta.bg;
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = meta.border;
  ctx.lineWidth = 6;
  ctx.strokeRect(3, 3, W - 6, H - 6);

  const imgs = await Promise.all(shots.map(loadImage));
  for (let i = 0; i < 4; i++) {
    const x = padX;
    const y = padTop + i * (photoH + gap);
    ctx.fillStyle = meta.decor === "hearts" || frameId === "classic" ? "#e9e6df" : "#1f1d3a";
    ctx.fillRect(x, y, photoW, photoH);
    const img = imgs[i];
    if (img) {
      const ir = img.width / img.height;
      const tr = photoW / photoH;
      let sx = 0,
        sy = 0,
        sw = img.width,
        sh = img.height;
      if (ir > tr) {
        sw = img.height * tr;
        sx = (img.width - sw) / 2;
      } else {
        sh = img.width / tr;
        sy = (img.height - sh) / 2;
      }
      ctx.drawImage(img, sx, sy, sw, sh, x, y, photoW, photoH);
    }
    ctx.strokeStyle = meta.border;
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, photoW, photoH);
  }

  ctx.fillStyle = meta.accent;
  if (meta.decor === "hearts") {
    const heart = (cx: number, cy: number, s: number) => {
      ctx.beginPath();
      ctx.moveTo(cx, cy + s * 0.3);
      ctx.bezierCurveTo(cx, cy, cx - s, cy, cx - s, cy + s * 0.3);
      ctx.bezierCurveTo(cx - s, cy + s * 0.7, cx, cy + s * 0.9, cx, cy + s * 1.1);
      ctx.bezierCurveTo(cx, cy + s * 0.9, cx + s, cy + s * 0.7, cx + s, cy + s * 0.3);
      ctx.bezierCurveTo(cx + s, cy, cx, cy, cx, cy + s * 0.3);
      ctx.fill();
    };
    heart(20, 20, 8);
    heart(W - 20, 30, 6);
    heart(18, H - 60, 7);
    heart(W - 22, H - 50, 8);
  } else if (meta.decor === "stars") {
    const star = (cx: number, cy: number, r: number) => {
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const a = (Math.PI / 5) * i - Math.PI / 2;
        const rad = i % 2 === 0 ? r : r / 2.3;
        ctx.lineTo(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad);
      }
      ctx.closePath();
      ctx.fill();
    };
    star(24, 26, 7);
    star(W - 26, 24, 6);
    star(20, H - 60, 6);
    star(W - 24, H - 56, 7);
  }

  ctx.fillStyle = meta.accent;
  ctx.font = "italic 22px Georgia, serif";
  ctx.textAlign = "center";
  ctx.fillText("Photo Booth", W / 2, H - 44);
  ctx.font = "10px Georgia, serif";
  ctx.fillText(
    new Date()
      .toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })
      .toUpperCase(),
    W / 2,
    H - 24,
  );

  return c.toDataURL("image/png");
}

function DeliverPage() {
  const location = useLocation();
  const [shots, setShots] = useState<string[]>([]);
  const [frameId, setFrameId] = useState<FrameId>("classic");
  const [stage, setStage] = useState<"printing" | "ready">("printing");
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const audioPlayed = useRef(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("booth_shots");
      const f = (sessionStorage.getItem("booth_frame") as FrameId) || "classic";
      if (raw) setShots(JSON.parse(raw));
      setFrameId(f);
    } catch (_) {
      // sessionStorage may be unavailable or contain invalid JSON
    }
  }, [location.key]);

  useEffect(() => {
    if (!shots.length) return;
    let mounted = true;
    let p = 0;

    setStage("printing");
    setProgress(0);
    setDataUrl(null);
    audioPlayed.current = false;

    const iv = setInterval(() => {
      p = Math.min(100, p + 4);
      if (mounted) setProgress(p);
    }, 80);

    renderStrip(shots, frameId).then((url) => {
      if (!mounted) return;
      setDataUrl(url);
      setTimeout(() => {
        if (!mounted) return;
        clearInterval(iv);
        setProgress(100);
        setStage("ready");
        if (!audioPlayed.current) {
          audioPlayed.current = true;
          playChime();
        }
      }, 2200);
    });

    return () => {
      mounted = false;
      clearInterval(iv);
    };
  }, [shots, frameId, location.key]);

  const download = () => {
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `photobooth-${Date.now()}.png`;
    a.click();
  };

  const secondsLeft = Math.max(1, Math.ceil((100 - progress) / 25));

  return (
    <div
      className="min-h-screen w-full bg-[#f3f0e8] text-[#111] flex flex-col"
      style={{ fontFamily: "Georgia, serif" }}
    >
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-5 border-b border-black/10">
        <Link
          to="/select"
          className="text-xs uppercase tracking-[0.25em] text-black/50 hover:text-black transition-colors"
        >
          ← Change frame
        </Link>
        <span className="text-[10px] uppercase tracking-[0.35em] text-black/40">
          Step 03 · Delivery
        </span>
        <Link
          to="/"
          className="text-xs uppercase tracking-[0.25em] text-black/50 hover:text-black transition-colors"
        >
          Home
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Status label */}
        <p className="text-[10px] uppercase tracking-[0.35em] text-black/40 mb-8">
          {stage === "printing" ? "Developing your strip…" : "Your strip is ready"}
        </p>

        {/* Strip preview card */}
        <div className="relative bg-white border border-black/12 shadow-[0_8px_40px_rgba(0,0,0,0.08)] w-full max-w-[280px]">
          {/* Slot notch at top */}
          <div className="absolute -top-px left-1/2 -translate-x-1/2 w-24 h-1 bg-black/80 rounded-b-sm" />

          {/* Corner rivets */}
          <span className="absolute top-2.5 left-2.5 w-1.5 h-1.5 rounded-full border border-black/20 bg-[#f3f0e8]" />
          <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full border border-black/20 bg-[#f3f0e8]" />
          <span className="absolute bottom-2.5 left-2.5 w-1.5 h-1.5 rounded-full border border-black/20 bg-[#f3f0e8]" />
          <span className="absolute bottom-2.5 right-2.5 w-1.5 h-1.5 rounded-full border border-black/20 bg-[#f3f0e8]" />

          <div className="p-5">
            {/* Inner bordered area */}
            <div
              className="border border-black/10 bg-[#f9f8f5] relative overflow-hidden"
              style={{ minHeight: 320 }}
            >
              {/* Sliding strip */}
              <div
                className="absolute left-1/2 -translate-x-1/2 transition-all duration-[2200ms] ease-out"
                style={{
                  top: stage === "printing" ? `${6 + (progress / 100) * 55}px` : "auto",
                  bottom: stage === "ready" ? "16px" : "auto",
                  width: "72%",
                }}
              >
                {dataUrl ? (
                  <img
                    src={dataUrl}
                    alt="Your photo strip"
                    className="w-full h-auto block shadow-lg"
                  />
                ) : (
                  <div
                    className="w-full bg-neutral-200 animate-pulse"
                    style={{ aspectRatio: "1/3" }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Progress / status */}
        <div className="mt-8 w-full max-w-[280px]">
          {stage === "printing" ? (
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase tracking-[0.3em] text-black/40">
                  Printing
                </span>
                <span className="text-[10px] uppercase tracking-[0.3em] text-black/40">
                  {secondsLeft}s
                </span>
              </div>
              <div className="w-full h-px bg-black/10 relative overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-black transition-all duration-100"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-5">
              <p className="text-[10px] uppercase tracking-[0.3em] text-black/50">
                Your memory is ready
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={download}
                  className="flex-1 py-3 bg-black text-white text-xs uppercase tracking-[0.3em] hover:bg-black/85 active:scale-95 transition border border-black"
                >
                  Download
                </button>
                <Link
                  to="/camera"
                  className="flex-1 py-3 border border-black text-black text-xs uppercase tracking-[0.3em] text-center hover:bg-black hover:text-white active:scale-95 transition"
                >
                  Retake
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
