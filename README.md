# Stripe Enter – Pay 1€ to enter

A minimal Next.js site: one "Enter" button → Stripe Checkout (1€) → blank success page.

## For beginners – start here

1. **Read the guide:** Open [TEACHING_GUIDE.md](./TEACHING_GUIDE.md) to understand what we built and how it works.
2. **Setup and deploy:** Follow [SETUP_AND_DEPLOY.md](./SETUP_AND_DEPLOY.md) for:
   - Installing dependencies
   - Creating a Stripe account and getting test keys
   - Creating `.env.local` and running the app locally
   - Testing with Stripe test cards
   - Deploying to Vercel

## Quick start (after you have Stripe keys)

```bash
npm install
# Create .env.local with STRIPE_SECRET_KEY and NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (see .env.example)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), click **Enter**, and pay with test card `4242 4242 4242 4242`.

## Tech

- Next.js 14 (App Router), JavaScript
- Stripe Checkout (1€ = 100 cents)
- Environment variables for keys; deploy on Vercel
