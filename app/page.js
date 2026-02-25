"use client";

/**
 * Homepage – the first page users see.
 * "use client" means this runs in the browser so we can use onClick and fetch.
 *
 * When the user clicks "Enter", we call our API route to create a Stripe Checkout session,
 * then redirect the user to Stripe's payment page.
 */

import { useState } from "react";

export default function HomePage() {
  // "loading" state: true while we're creating the checkout session (button shows "Please wait...")
  const [loading, setLoading] = useState(false);

  async function handleEnterClick() {
    setLoading(true);

    try {
      // Call OUR server: the API route at /api/checkout (see app/api/checkout/route.js).
      // That route talks to Stripe with the SECRET key and returns a URL to Stripe Checkout.
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (!res.ok) {
        // Something went wrong (e.g. missing STRIPE_SECRET_KEY). Show error in console and alert.
        console.error("Checkout error:", data.error || data);
        alert(data.error || "Something went wrong. Check the console.");
        setLoading(false);
        return;
      }

      // Success: our API returned { url: "https://checkout.stripe.com/..." }
      // Redirect the user to Stripe's payment page.
      if (data.url) {
        window.location.href = data.url;
        // We don't set loading to false here because the page is navigating away.
        return;
      }

      throw new Error("No redirect URL received");
    } catch (err) {
      console.error(err);
      alert("Failed to start checkout. Check the console.");
      setLoading(false);
    }
  }

  return (
    <main
      onClick={loading ? undefined : handleEnterClick}
      onKeyDown={(e) => {
        if (!loading && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          handleEnterClick();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label="Pay to see what everyone else is paying for"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        backgroundColor: "#fafafa",
        cursor: loading ? "wait" : "pointer",
      }}
    >
      <p
        style={{
          fontSize: "1.5rem",
          fontWeight: 500,
          color: "#111",
          textAlign: "center",
          whiteSpace: "nowrap",
        }}
      >
        {loading ? "..." : "click to see what everyone else is paying for"}
      </p>
    </main>
  );
}
