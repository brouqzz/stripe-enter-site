/**
 * API Route: GET /api/count
 * Returns the number of people who have completed payment (entered).
 * Uses Stripe as the source of truth: we count completed checkout sessions.
 * No Redis needed – the count updates as soon as someone pays.
 */

import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function GET() {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json({ count: 0 });
    }

    const stripe = new Stripe(secretKey);
    const sessions = await stripe.checkout.sessions.list({
      status: "complete",
      limit: 100,
    });

    const count = sessions.data?.length ?? 0;
    return NextResponse.json({ count }, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (err) {
    console.error("Count error:", err);
    return NextResponse.json({ count: 0 }, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  }
}
