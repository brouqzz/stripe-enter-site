/**
 * API Route: POST /api/checkout
 *
 * This file runs ONLY on the server. The browser never sees this code.
 * That's why it's safe to use your STRIPE_SECRET_KEY here.
 *
 * What is an API route?
 * In Next.js App Router, any file named route.js inside app/api/... creates an "endpoint".
 * When the front end does fetch("/api/checkout", { method: "POST" }), Next.js runs this function.
 * We return JSON; the front end uses that (e.g. the redirect URL).
 */

import { NextResponse } from "next/server";
import Stripe from "stripe";

// POST is the HTTP method we use when the user clicks "Enter" (we're "posting" a request to create a session).
export async function POST(request) {
  // Read the secret key from environment variables (set in .env.local).
  // WARNING: If you forget to create .env.local or misspell the key, this will be undefined and Stripe will throw.
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    console.error("STRIPE_SECRET_KEY is missing. Add it to .env.local");
    return NextResponse.json(
      { error: "Server configuration error: Stripe key missing" },
      { status: 500 }
    );
  }

  // Create a Stripe client. We use the secret key so we can create Checkout Sessions.
  const stripe = new Stripe(secretKey);

  // We need the full URL of our site to tell Stripe where to redirect after payment.
  // On localhost it's http://localhost:3000; on Vercel it's https://your-project.vercel.app.
  const origin = request.headers.get("origin") || request.nextUrl?.origin || "http://localhost:3000";

  try {
    // Create a Stripe Checkout Session: this is the "payment page" the user will see.
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Enter",
              description: "One-time payment to enter",
            },
            unit_amount: 100, // 100 cents = 1€ (Stripe uses the smallest currency unit).
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/success`,
      cancel_url: `${origin}/cancel`,
    });

    // Stripe gives us a URL where the user can complete payment. We send it back to the browser.
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe error:", err.message);
    return NextResponse.json(
      { error: err.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
  
