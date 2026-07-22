import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/faq")({
  head: () => ({ meta: [{ title: "FAQ — Photo Kiosk" }] }),
  component: FAQPage,
});

function FAQPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-between py-6 px-4"
      style={{ backgroundColor: "#f3f0e8", color: "#1a1a1a", fontFamily: "Georgia, serif" }}
    >
      <main className="w-full max-w-4xl">
        <h1 className="text-3xl font-semibold tracking-[0.2em] uppercase text-center mb-8">FAQ</h1>
        <div className="space-y-4 text-sm leading-7">
          <p>
            <strong>Q: How does the Photo Kiosk work?</strong>
          </p>
          <p>
            <strong>A:</strong> Open the Photo Kiosk, allow camera access, and follow the
            instructions to take your photos. After capturing your images, you can select a frame
            and create your final photo.
          </p>
          <p>
            <strong>Q: Do I need to create an account?</strong>
          </p>
          <p>
            <strong>A:</strong> No. The Photo Kiosk does not require registration, login, or any
            personal information.
          </p>
          <p>
            <strong>Q: Are my photos stored anywhere?</strong>
          </p>
          <p>
            <strong>A:</strong> No. Your photos are not uploaded or stored on our servers. They are
            processed directly on your device and only exist there unless you choose to download
            them.
          </p>
          <p>
            <strong>Q: Can anyone see my photos?</strong>
          </p>
          <p>
            <strong>A:</strong> No. We do not have access to your camera, photos, or created photo
            designs.
          </p>
          <p>
            <strong>Q: What happens after I download my photo?</strong>
          </p>
          <p>
            <strong>A:</strong> After downloading, the photo is saved directly to your device. You
            can print it or share it wherever you want.
          </p>
          <p>
            <strong>Q: What devices are supported?</strong>
          </p>
          <p>
            <strong>A:</strong> The Photo Kiosk works on modern smartphones, tablets, and computers
            with a supported browser and camera access.
          </p>
          <p>
            <strong>Q: Why is my camera not working?</strong>
          </p>
          <p>
            <strong>A:</strong> Make sure you have granted camera permission in your browser. If the
            issue continues, try refreshing the page or using another browser.
          </p>
          <p>
            <strong>Q: Can I use the Photo Kiosk multiple times?</strong>
          </p>
          <p>
            <strong>A:</strong> Yes. There is no limit to how many photo sessions you can create.
          </p>
          <p>
            <strong>Q: Is the Photo Kiosk free?</strong>
          </p>
          <p>
            <strong>A:</strong> Yes. The Photo Kiosk is available for users to create and download
            their photos.
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
