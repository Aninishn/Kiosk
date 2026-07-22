import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/contact-me")({
  head: () => ({ meta: [{ title: "Contact Me — Photo Kiosk" }] }),
  component: ContactMe,
});

function ContactMe() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-between py-6 px-4"
      style={{ backgroundColor: "#f3f0e8", color: "#1a1a1a", fontFamily: "Georgia, serif" }}
    >
      <main className="w-full max-w-4xl">
        <h1 className="text-3xl font-semibold tracking-[0.2em] uppercase text-center mb-8">
          Contact Me
        </h1>
        <div className="space-y-4 text-sm leading-7">
          <p>Have a question, feedback, or suggestion? I'd love to hear from you!</p>
          <p>
            <strong>Get in touch</strong>
          </p>
          <p>
            Email:{" "}
            <a href="mailto:aninishnianidze3@gmail.com" className="underline">
              aninishnianidze3@gmail.com
            </a>
          </p>
          <p>
            Instagram:{" "}
            <a
              href="https://www.instagram.com/a.nishnn/"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              📷 @a.nishnn
            </a>
          </p>
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
