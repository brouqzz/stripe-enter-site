"use client";

/**
 * Homepage – the first page users see.
 * "use client" means this runs in the browser so we can use onClick and fetch.
 *
 * When the user clicks, we call our API route to create a Stripe Checkout session,
 * then redirect to Stripe's payment page.
 * We also show a counter of how many people have entered (from /api/count).
 */

import { useState, useEffect } from "react";

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(null);

  useEffect(() => {
    fetch("/api/count")
      .then((res) => res.json())
      .then((data) => setCount(data.count))
      .catch(() => setCount(0));
  }, []);

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
      <h1
        style={{
          fontSize: "1.5rem",
          fontWeight: 600,
          marginBottom: "2rem",
          color: "#111",
        }}
      >
        Welcome
      </h1>
      <p
        style={{
          fontSize: "1.5rem",
          fontWeight: 500,
          color: "#111",
          marginBottom: "2.5rem",
          textAlign: "center",
          whiteSpace: "nowrap",
        }}
      >
        click to see what everyone else is paying for
      </p>
      <button
        onClick={handleEnterClick}
        disabled={loading}
        style={{
          width: "56px",
          height: "56px",
          padding: 0,
          backgroundColor: loading ? "#999" : "#000",
          border: "none",
          borderRadius: "50%",
          cursor: loading ? "not-allowed" : "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}
        title={loading ? "Please wait..." : "Pay to enter"}
        aria-label={loading ? "Please wait..." : "Pay to enter"}
      >
        {loading ? "..." : ""}
      </button>
      <p
        style={{
          fontSize: "1rem",
          fontWeight: 500,
          color: "#333",
          marginTop: "2.5rem",
          textAlign: "center",
        }}
      >
        Number of people who entered: {count === null ? "…" : count}
      </p>
    </main>
  );
}
