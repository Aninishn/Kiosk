import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";

export const Route = createFileRoute("/camera")({
  head: () => ({ meta: [{ title: "Camera — Photo Booth" }] }),
  component: CameraPage,
});

function playShutter() {
  try {
    const Ctx = (window.AudioContext ||
      (window as Window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext) as typeof AudioContext;
    const ctx = new Ctx();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "square";
    o.frequency.setValueAtTime(1200, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.08);
    g.gain.setValueAtTime(0.25, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);
    o.connect(g).connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + 0.13);
  } catch (_) {
    // Audio not available in this environment
  }
}

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
      g.gain.setValueAtTime(0.0001, ctx.currentTime + i * 0.1);
      g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + i * 0.1 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.1 + 0.4);
      o.connect(g).connect(ctx.destination);
      o.start(ctx.currentTime + i * 0.1);
      o.stop(ctx.currentTime + i * 0.1 + 0.5);
    });
  } catch (_) {
    // Audio not available in this environment
  }
}

const SHOTS = 4;

function CameraPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [flash, setFlash] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [shots, setShots] = useState<string[]>([]);
  const [shooting, setShooting] = useState(false);
  const [filter, setFilter] = useState<"color" | "bw">("color");
  const navigate = useNavigate();

  const sessionId = useMemo(() => String(Math.floor(Math.random() * 9000) + 1000), []);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let mounted = true;

    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720, facingMode: "user" },
          audio: false,
        });

        if (!mounted) {
          // Component unmounted while waiting for camera permission — stop tracks immediately
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          try {
            await videoRef.current.play();
            if (mounted) setReady(true);
          } catch (playErr) {
            // AbortError means play() was interrupted by a new load (e.g. React Strict Mode
            // double-invocation). This is not a real failure — the second effect run will
            // succeed. Any other error (e.g. NotAllowedError) should surface normally.
            if ((playErr as DOMException)?.name !== "AbortError" && mounted) {
              setError((playErr as Error)?.message ?? "Camera unavailable");
            }
          }
        }
      } catch (err) {
        if (mounted) setError((err as Error)?.message ?? "Camera unavailable");
      }
    })();

    const videoEl = videoRef.current;
    return () => {
      mounted = false;
      stream?.getTracks().forEach((t) => t.stop());
      if (videoEl) {
        videoEl.srcObject = null;
      }
    };
  }, []);

  async function captureOne(): Promise<string> {
    return new Promise((resolve) => {
      let n = 3;
      setCountdown(n);
      const iv = setInterval(() => {
        n -= 1;
        if (n <= 0) {
          clearInterval(iv);
          setCountdown(null);
          setFlash(true);
          playShutter();
          setTimeout(() => setFlash(false), 180);

          const v = videoRef.current!;
          const c = canvasRef.current!;
          const vw = v.videoWidth;
          const vh = v.videoHeight;
          const size = Math.min(vw, vh);
          const sx = (vw - size) / 2;
          const sy = (vh - size) / 2;

          c.width = size;
          c.height = size;
          const ctx = c.getContext("2d")!;
          ctx.translate(c.width, 0);
          ctx.scale(-1, 1);
          ctx.drawImage(v, sx, sy, size, size, 0, 0, size, size);
          if (filter === "bw") {
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            const img = ctx.getImageData(0, 0, c.width, c.height);
            const d = img.data;
            for (let i = 0; i < d.length; i += 4) {
              const g = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
              d[i] = d[i + 1] = d[i + 2] = g;
            }
            ctx.putImageData(img, 0, 0);
          }
          resolve(c.toDataURL("image/jpeg", 0.92));
        } else {
          setCountdown(n);
        }
      }, 1000);
    });
  }

  async function startSession() {
    if (!ready || shooting) return;
    setShooting(true);
    setShots([]);
    const taken: string[] = [];
    for (let i = 0; i < SHOTS; i++) {
      const img = await captureOne();
      taken.push(img);
      setShots([...taken]);
      await new Promise((r) => setTimeout(r, 600));
    }
    playChime();
    setShooting(false);
    sessionStorage.setItem("booth_shots", JSON.stringify(taken));
    setTimeout(() => navigate({ to: "/select" }), 900);
  }

  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

  function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const allFiles = Array.from(e.target.files ?? []);
    // Reset so the same file can be re-selected next time
    e.target.value = "";

    const files = allFiles.filter((f) => ALLOWED_TYPES.includes(f.type)).slice(0, SHOTS);

    if (!files.length) {
      setError("Please select a JPG, PNG, or WebP image.");
      setTimeout(() => setError(null), 3000);
      return;
    }

    Promise.all(
      files.map(
        (f) =>
          new Promise<string>((res, rej) => {
            const r = new FileReader();
            r.onload = () => res(r.result as string);
            r.onerror = () => rej(new Error("Failed to read file"));
            r.readAsDataURL(f);
          }),
      ),
    )
      .then((urls) => {
        const padded = [...urls];
        while (padded.length < SHOTS) padded.push(urls[urls.length - 1]);
        setShots(padded);
        sessionStorage.setItem("booth_shots", JSON.stringify(padded));
        playChime();
        setTimeout(() => navigate({ to: "/select" }), 500);
      })
      .catch(() => {
        setError("Could not read the selected file. Please try another image.");
        setTimeout(() => setError(null), 3000);
      });
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-6 select-none text-[#1a1a1a]"
      style={{ backgroundColor: "#f3f0e8", fontFamily: "Georgia, serif" }}
    >
      <div className="max-w-lg w-full flex flex-col">
        {/* Navigation */}
        <div className="mb-12 flex justify-between items-center">
          <Link
            to="/"
            className="group text-xs tracking-[0.2em] uppercase text-neutral-500 hover:text-black transition-colors flex items-center gap-2"
          >
            <span className="h-px w-4 bg-neutral-400 group-hover:bg-black transition-colors" />
            Back
          </Link>
          <div className="text-[10px] tracking-[0.3em] uppercase text-neutral-400">
            Session {sessionId}
          </div>
        </div>

        {/* Camera Section */}
        <div className="relative">
          {/* Shot counter above */}
          <div className="absolute -top-6 right-0">
            <span className="text-xs tracking-[0.2em] text-neutral-400">
              POSES{" "}
              <span className="text-black ml-2">
                {shots.length} / {SHOTS}
              </span>
            </span>
          </div>

          {/* Viewfinder */}
          <div className="aspect-square w-full bg-[#121212] flex items-center justify-center relative overflow-hidden ring-1 ring-neutral-200 shadow-sm">
            <video
              ref={videoRef}
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                transform: "scaleX(-1)",
                filter:
                  filter === "bw"
                    ? "grayscale(1) contrast(1.06) brightness(0.98)"
                    : "saturate(0.92) contrast(1.02)",
              }}
            />

            {/* Corner accents */}
            <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-white/20" />
            <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-white/20" />
            <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-white/20" />
            <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-white/20" />

            {!ready && !error && (
              <div className="relative text-neutral-500 text-xs tracking-widest uppercase">
                Warming
              </div>
            )}

            {countdown !== null && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span
                  key={countdown}
                  className="text-white text-8xl italic font-light leading-none animate-scale-in"
                >
                  {countdown}
                </span>
              </div>
            )}

            {flash && <div className="absolute inset-0 bg-white animate-fade-out" />}

            {error && (
              <div className="absolute inset-0 flex items-center justify-center text-white/70 text-[10px] tracking-widest uppercase p-6 text-center">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="mt-10 flex flex-col items-center gap-8">
          {/* Filter Toggle */}
          <div className="flex p-1 bg-neutral-200/50 rounded-full w-full max-w-[240px]">
            <button
              onClick={() => setFilter("bw")}
              className={`flex-1 py-1.5 text-[10px] tracking-[0.2em] uppercase rounded-full transition-colors ${
                filter === "bw" ? "bg-white shadow-sm text-black" : "text-neutral-500"
              }`}
            >
              Black & White
            </button>
            <button
              onClick={() => setFilter("color")}
              className={`flex-1 py-1.5 text-[10px] tracking-[0.2em] uppercase rounded-full transition-colors ${
                filter === "color" ? "bg-white shadow-sm text-black" : "text-neutral-500"
              }`}
            >
              Color
            </button>
          </div>

          {/* Primary Action */}
          <div className="flex flex-col items-center gap-4 w-full">
            <button
              onClick={startSession}
              disabled={!ready || shooting || !!error}
              className="w-20 h-20 rounded-full border border-neutral-300 p-1 hover:border-black transition-colors duration-500 group disabled:opacity-40 disabled:hover:border-neutral-300"
            >
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-white text-[10px] tracking-[0.2em] uppercase group-active:scale-95 transition-transform">
                {shooting ? "•••" : "Start"}
              </div>
            </button>
            <p className="text-xs italic text-neutral-400 tracking-wide">
              Four frames, developed instantly.
            </p>
          </div>

          {/* Fallback */}
          <div className="mt-2">
            <label
              className={`text-[10px] tracking-[0.2em] uppercase text-neutral-400 hover:text-black border-b border-transparent hover:border-black transition-all pb-0.5 cursor-pointer select-none ${
                shooting ? "opacity-40 pointer-events-none" : ""
              }`}
            >
              Upload existing file
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                className="hidden"
                onChange={onUpload}
                disabled={shooting}
              />
            </label>
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
