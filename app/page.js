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

  function fetchCount() {
    fetch(`/api/count?t=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => setCount(data.count))
      .catch(() => setCount(0));
  }

  useEffect(() => {
    fetchCount();
    // Refetch when user comes back to the tab (e.g. after paying and returning)
    const onFocus = () => fetchCount();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
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
      <p
        style={{
          fontSize: "1.25rem",
          fontWeight: 600,
          color: "#111",
          marginTop: "3rem",
          textAlign: "center",
        }}
      >
        Number of people who entered: {count === null ? "…" : count}
      </p>
    </main>
  );
}
