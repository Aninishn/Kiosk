# Photo Kiosk

A private, on-device photo booth experience built for the web. Capture four frames using your webcam, choose a decorative film strip theme, and download a professionally composed photo strip — all without any data leaving your device.

---

## Features

- **Live camera capture** — Four sequential shots with a 3-second countdown and shutter sound for each frame
- **Black & White / Colour filter toggle** — Switch filter modes before capturing
- **Eight film strip themes** — Classic White, Midnight Noir, Valentine, New Year's Eve, Formula 1, Disney Magic, Stardust, and Summer Beach
- **Canvas-rendered photo strips** — Each strip is composited on an HTML5 Canvas with decorative borders, corner accents, and a dated caption
- **Upload from device** — Select up to four existing images instead of using the camera; supports JPG, PNG, and WebP
- **Instant download** — Save your strip as a high-resolution PNG with one click
- **Fully private** — No backend, no uploads, no tracking; everything runs in the browser
- **Responsive design** — Works on desktop, tablet, and mobile browsers

---

## Technologies

| Layer | Technology |
|---|---|
| Framework | [TanStack Start](https://tanstack.com/start) (React 19, file-based routing) |
| Build tool | [Vite 8](https://vite.dev) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| Routing | [TanStack Router](https://tanstack.com/router) |
| Server runtime | [Nitro](https://nitro.unjs.io) |
| Language | TypeScript 5 |
| Image compositing | HTML5 Canvas API |
| Audio | Web Audio API |
| State persistence | `sessionStorage` |

---

## Installation

**Prerequisites:** Node.js 20+ and npm 10+.

```bash
# Clone the repository
git clone <repository-url>
cd photo-kiosk

# Install dependencies
npm install
```

---

## Running Locally

```bash
npm run dev
```

The development server starts at `http://localhost:3000`. The app requires a webcam for the capture flow; camera permission will be requested on the `/camera` page.

> **Note:** `getUserMedia` requires a secure context. On localhost this works automatically. If testing on a local network device, use HTTPS or a tunnelling tool.

---

## Build

```bash
# Production build
npm run build

# Preview the production build locally
npm run preview
```

The output is placed in `dist/`. The application is server-side rendered by default via TanStack Start + Nitro.

---

## Project Structure

```
photo-kiosk/
├── src/
│   ├── assets/            # Static assets (images)
│   ├── components/
│   │   └── ui/            # Shared UI primitives (Radix-based)
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utilities and server configuration
│   ├── routes/            # File-based page routes
│   │   ├── __root.tsx     # Root layout, SEO metadata, error boundaries
│   │   ├── index.tsx      # Home / landing page
│   │   ├── camera.tsx     # Camera capture & file upload
│   │   ├── select.tsx     # Frame selection carousel
│   │   ├── deliver.tsx    # Strip rendering & download
│   │   ├── about-me.tsx   # About page
│   │   ├── contact-me.tsx # Contact page
│   │   ├── faq.tsx        # Frequently asked questions
│   │   └── privacy-policy.tsx
│   ├── styles.css         # Global styles and Tailwind theme tokens
│   ├── router.tsx         # Router initialisation
│   └── start.ts           # Server entry point
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## Main Pages & Components

### `/` — Home
Landing page featuring the photo booth illustration and the entry button.

### `/camera` — Camera
Activates the device webcam and guides the user through four sequential captures. Supports a Black & White or Colour filter and an "Upload existing file" fallback for selecting images from disk.

### `/select` — Choose Frame
A full-screen carousel showing eight themed film strip frames with a live preview of the captured shots applied to each template. Navigate with arrow buttons or dot indicators.

### `/deliver` — Download
Renders the final photo strip on an HTML5 Canvas using the selected frame's colour palette, border style, decorative elements, and a dated caption. Provides Download and Retake actions.

### Supporting pages
`/about-me`, `/contact-me`, `/faq`, `/privacy-policy` — informational pages accessible from the footer.

---

## Future Improvements

- **Print support** — Direct browser print layout optimised for thermal printers
- **Additional frames** — Seasonal and event-specific themes (e.g., Halloween, Graduation)
- **QR code sharing** — Generate a temporary shareable link to the strip image
- **Sticker overlays** — Drag-and-drop emoji and text stickers on the preview
- **Multi-photo layout options** — Horizontal strips, 2×2 grids, and single large prints
- **PWA support** — Offline capability and home screen installation
- **Localisation** — Multi-language interface support
