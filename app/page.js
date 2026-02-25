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
      <button
        onClick={handleEnterClick}
        disabled={loading}
        style={{
          padding: "0.75rem 2rem",
          fontSize: "1rem",
          fontWeight: 500,
          color: "#fff",
          backgroundColor: loading ? "#999" : "#000",
          border: "none",
          borderRadius: "6px",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Please wait..." : "Enter"}
      </button>
    </main>
  );
}
