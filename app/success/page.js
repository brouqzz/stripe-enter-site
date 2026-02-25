"use client";

/**
 * Success page – shown AFTER the user completes payment on Stripe.
 * Stripe redirects here with ?session_id=... so we can count this entry once (no double count on refresh).
 * We call /api/register-entry with the session_id, then show a blank page.
 */

import { useEffect } from "react";

export default function SuccessPage() {
  useEffect(() => {
    const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
    const sessionId = params.get("session_id");
    if (sessionId) {
      fetch("/api/register-entry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId }),
      }).catch(() => {});
    }
  }, []);

  return null;
}
