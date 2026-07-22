import { createFileRoute, Link } from "@tanstack/react-router";
import boothImg from "@/assets/photo-booth.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Photo Kiosk" },
      {
        name: "description",
        content: "Create photo memories with our private on-device photo kiosk.",
      },
    ],
  }),
  component: Index,
});

function NavLinks() {
  const links = [
    { label: "privacy policy", to: "/privacy-policy" },
    { label: "faq", to: "/faq" },
    { label: "about me", to: "/about-me" },
    { label: "contact me", to: "/contact-me" },
  ];

  return (
    <nav className="flex justify-center gap-6 text-sm flex-wrap">
      {links.map((link) => (
        <Link
          key={link.label}
          to={link.to}
          className="underline underline-offset-4 hover:opacity-60 transition-opacity"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

function Index() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-between py-6 px-4"
      style={{ backgroundColor: "#f3f0e8", color: "#1a1a1a", fontFamily: "Georgia, serif" }}
    >
      <div />

      <main className="flex flex-col items-center gap-6 w-full max-w-4xl">
        <img src={boothImg} alt="Photo booth" className="max-h-[65vh] w-auto object-contain" />
        <Link
          to="/camera"
          className="px-8 py-2 rounded-full border border-black/70 bg-transparent hover:bg-black hover:text-[#f3f0e8] transition-colors text-sm tracking-wide"
        >
          enter
        </Link>
      </main>

      <footer className="flex flex-col items-center gap-2 text-sm">
        <NavLinks />
        <a
          href="https://www.instagram.com/a.nishnn/"
          target="_blank"
          rel="noreferrer"
          className="text-xs opacity-70 hover:underline underline-offset-4"
        >
          made by @aninishnn
        </a>
      </footer>
    </div>
  );
}
