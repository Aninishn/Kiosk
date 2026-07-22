import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({ meta: [{ title: "Privacy Policy — Photo Kiosk" }] }),
  component: PrivacyPolicy,
});

function PrivacyPolicy() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-between py-6 px-4"
      style={{ backgroundColor: "#f3f0e8", color: "#1a1a1a", fontFamily: "Georgia, serif" }}
    >
      <main className="w-full max-w-4xl">
        <h1 className="text-3xl font-semibold tracking-[0.2em] uppercase text-center mb-8">
          Privacy Policy
        </h1>
        <div className="space-y-4 text-sm leading-7">
          <p>
            Your privacy is important to us. This Privacy Policy explains how our Photo Kiosk
            handles your information when you use our service.
          </p>
          <p>
            <strong>Camera and Photos</strong>
          </p>
          <p>
            Our Photo Kiosk requires access to your device camera only to capture photos during your
            session.
          </p>
          <p>
            Photos are processed directly in your browser and are not uploaded, stored, or collected
            by us. We do not have access to your camera feed or the photos you create.
          </p>
          <p>
            <strong>Photo Processing</strong>
          </p>
          <p>
            After taking your photos, you can choose from available frames and create your final
            photo design.
          </p>
          <p>
            The frame selection and photo processing happen locally on your device. Your images
            remain on your device unless you choose to download or share the final result.
          </p>
          <p>
            <strong>Data Collection</strong>
          </p>
          <p>We do not require registration or account creation.</p>
          <p>
            We do not collect personal information such as your name, email address, or private
            photos.
          </p>
          <p>
            <strong>Downloading Photos</strong>
          </p>
          <p>Once your photo is created, you can download it directly to your device.</p>
          <p>
            After downloading, you are responsible for storing and sharing your photo. We do not
            access or control downloaded files.
          </p>
          <p>
            <strong>Camera Permissions</strong>
          </p>
          <p>Camera permission is required only while using the Photo Kiosk feature.</p>
          <p>You can remove camera access at any time through your browser or device settings.</p>
          <p>
            <strong>Cookies and Analytics</strong>
          </p>
          <p>
            If analytics tools are used, they may collect anonymous technical information such as
            browser type, device type, and general usage statistics to help improve the service.
          </p>
          <p>No personal images or identifying information are collected.</p>
          <p>
            <strong>Third-Party Services</strong>
          </p>
          <p>
            The Photo Kiosk may use third-party services such as website hosting providers. These
            services only provide the infrastructure needed for the website to function and do not
            receive your photos.
          </p>
          <p>
            <strong>Updates to This Policy</strong>
          </p>
          <p>
            We may update this Privacy Policy occasionally. Any changes will be posted on this page
            with an updated date.
          </p>
          <p>
            <strong>Contact</strong>
          </p>
          <p>
            If you have questions about this Privacy Policy, contact us:{" "}
            <a href="mailto:aninishnianidze3@gmail.com" className="underline">
              aninishnianidze3@gmail.com
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
