/**
 * Cancel page – shown if the user cancels the Stripe Checkout (e.g. clicks "Back" or closes the tab).
 * We redirect them here via cancel_url so they don't end up on the success page.
 *
 * For simplicity we show a minimal message and a link back to the homepage.
 * You could also redirect straight to home; this gives a clear "you cancelled" state.
 */

import Link from "next/link";

export default function CancelPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        backgroundColor: "#fafafa",
      }}
    >
      <p style={{ marginBottom: "1rem", color: "#333" }}>Payment was cancelled.</p>
      <Link
        href="/"
        style={{
          color: "#0066cc",
          textDecoration: "underline",
        }}
      >
        Return to homepage
      </Link>
    </main>
  );
}
