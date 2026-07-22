import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about-me")({
  head: () => ({ meta: [{ title: "About Me — Photo Kiosk" }] }),
  component: AboutMe,
});

function AboutMe() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-between py-6 px-4"
      style={{ backgroundColor: "#f3f0e8", color: "#1a1a1a", fontFamily: "Georgia, serif" }}
    >
      <main className="w-full max-w-4xl">
        <h1 className="text-3xl font-semibold tracking-[0.2em] uppercase text-center mb-8">
          About Me
        </h1>
        <div className="space-y-4 text-sm leading-7">
          <p>
            Hi! I'm Ani, and I created this photo kiosk as a small creative project to bring the fun
            experience of a real photobooth into a digital space.
          </p>
          <p>
            I’ve always loved the idea of capturing special moments in a unique and memorable way,
            so I decided to build my own version where people can take photos, choose their favorite
            frames, and create their own personalized photo memories.
          </p>
          <p>
            This project is a passion project that I created and continue improving in my free time.
            It may not be perfect, but I’m constantly working on adding new features, improving the
            experience, and making it more enjoyable for everyone who uses it.
          </p>
          <p>
            Thank you for trying out my photo kiosk! I hope it helps you create fun memories and
            enjoy the process as much as I enjoyed building it.
          </p>
          <p>
            If you have any feedback, suggestions, or find any issues, feel free to reach out - I’d
            love to hear from you.
          </p>
          <p>Stay tuned for future updates and new features! ✨💌</p>
        </div>
      </main>
      <footer className="flex flex-col items-center gap-2 text-sm mt-8">
        <Link to="/" className="underline underline-offset-4">
          Back to home
        </Link>
      </footer>
    </div>
  );
}
