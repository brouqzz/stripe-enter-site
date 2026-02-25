# 🎓 Complete Beginner's Guide: Your First Paid Website

Welcome! This guide will teach you everything you need to build a simple website where users click "Enter" and pay 1€ with Stripe. No prior knowledge assumed.

---

## Part 1: What We Are Going To Build (Simple Terms)

### The big picture

1. **Homepage**  
   A single page with a clean look and one button: **"Enter"**.

2. **When the user clicks "Enter"**  
   Your website talks to Stripe (a payment company). Stripe shows a secure payment page where the user can enter their card details. The amount is **1€** (100 cents).

3. **After the user pays**  
   Stripe sends them back to your site. You will show a **blank white page** (nothing else).

4. **If the user cancels**  
   They come back to your homepage (or a cancel page—we'll keep it simple and can send them to the homepage).

So in one sentence: **One page with an "Enter" button → Stripe payment (1€) → then a blank white page.**

### Why we use these tools

- **Next.js** – A framework that makes it easy to build pages and "API routes" (small programs that run on your server and can talk to Stripe).
- **Stripe** – Handles all payment security and card processing. You don't see or store card numbers.
- **Environment variables** – A safe way to store your secret Stripe key so it never appears in your code or on the front end.
- **Vercel** – A place on the internet where you can put your Next.js site so anyone can visit it.

---

## Part 2: Folder Structure (What You Will Have)

After we finish, your project will look like this:

```
stripe-enter-website/
├── app/                    ← Next.js App Router (all pages and routes live here)
│   ├── layout.js           ← Wraps every page (e.g. HTML structure, fonts)
│   ├── page.js             ← Your HOMEPAGE (the one with the "Enter" button)
│   ├── success/
│   │   └── page.js         ← The BLANK white page after payment
│   ├── cancel/
│   │   └── page.js         ← Page shown if user cancels payment (optional)
│   └── api/                ← "API routes" = small server-side programs
│       └── checkout/
│           └── route.js    ← Creates the Stripe payment session when user clicks "Enter"
├── .env.local              ← YOUR SECRET KEYS (you create this, never commit to Git!)
├── .env.example            ← Example of what keys you need (safe to share)
├── package.json            ← List of dependencies (e.g. Next.js, Stripe)
├── next.config.js          ← Next.js configuration
└── TEACHING_GUIDE.md       ← This file
```

### Quick explanations

- **app/page.js** – The first page people see (homepage).
- **app/success/page.js** – The blank page after successful payment.
- **app/api/checkout/route.js** – When the user clicks "Enter", the front end calls this. This file runs on the server, uses your secret Stripe key, and asks Stripe to create a "Checkout Session" (the payment page). It returns a URL; the browser then redirects the user to that URL.
- **.env.local** – Where you put `STRIPE_SECRET_KEY=sk_test_...`. Next.js reads this only on the server, so the key never gets sent to the browser.

---

## Part 3: Terminal Commands Step by Step

Run these in order in your terminal. I'll explain after each block.

### Step 1: Open the project and install dependencies

The project is already set up with Next.js (App Router) and JavaScript. Open your terminal and run:

```bash
cd "/Users/chekurdan/Documents/Documents - Nikita's MacBook Air/stripe-enter-website"
npm install
```

**What just happened?**  
`npm install` reads `package.json` and installs Next.js, React, and Stripe into the `node_modules` folder. You only need to do this once (or when dependencies change). The Stripe library is already in `package.json`, so you don't need to run `npm install stripe` separately.

---

### Step 2: Create your Stripe account and get test keys

1. Go to [https://stripe.com](https://stripe.com) and sign up (free).
2. Log in and open the **Developers** section: [https://dashboard.stripe.com/test/apikeys](https://dashboard.stripe.com/test/apikeys).
3. Make sure you're in **Test mode** (toggle in the dashboard, usually top right).
4. You will see:
   - **Publishable key** – starts with `pk_test_...` (safe to use in the browser).
   - **Secret key** – click "Reveal" to see it; starts with `sk_test_...` (must stay on the server only).

We will use:
- **Secret key** in `.env.local` (only for the API route).
- **Publishable key** in `.env.local` as well, and we can use it in the front end if we need it (e.g. for Stripe.js later). For this minimal example we only need the secret key on the server; the API route will create the session and return the redirect URL.

---

### Step 3: Create the `.env.local` file

In the **root** of your project (inside `stripe-enter-website`), create a file named exactly:

`.env.local`

Put this inside (replace with your real keys from the Stripe dashboard):

```
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

**Rules:**
- No spaces around the `=` sign.
- No quotes around the values (unless Stripe gives you quoted values).
- Never commit `.env.local` to Git (it should be in `.gitignore`).

**What are environment variables?**  
They are key–value pairs that your app reads at runtime. Next.js automatically loads `.env.local` and makes them available:
- Variables starting with `NEXT_PUBLIC_` can be used in the browser.
- Variables without that prefix (like `STRIPE_SECRET_KEY`) are only available on the server (e.g. in API routes), so your secret key is never exposed.

---

### Step 4: Run the project locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. You should see your app.  
Stopping the server: press `Ctrl+C` in the terminal.

**What just happened?**  
`npm run dev` starts the Next.js development server. Your app runs only on your computer; nobody else on the internet can access it yet.

---

## Part 4: Stripe Test Mode and Test Cards

In Test mode, no real money is charged. Stripe provides test card numbers:

- **Success:** `4242 4242 4242 4242`
- **Decline:** `4000 0000 0000 0002`
- Use any future expiry date (e.g. 12/34) and any 3-digit CVC.
- Use any postal code.

You can find more test cards here: [Stripe Testing – Test card numbers](https://docs.stripe.com/testing#cards).

---

## Part 5: Success and Cancel URLs

When we create a Stripe Checkout Session, we tell Stripe:

- **success_url** – Where to send the user after they complete payment. We will set this to your site’s `/success` page (the blank white page).
- **cancel_url** – Where to send the user if they close the payment page or click "Back". We can use the homepage or a `/cancel` page.

These URLs must be full URLs (e.g. `http://localhost:3000/success` for local testing, and `https://your-site.vercel.app/success` for production).

---

## Part 6: Deploy to Vercel (Step by Step)

1. Push your code to **GitHub** (create a repo and push your project; do **not** push `.env.local`).
2. Go to [https://vercel.com](https://vercel.com) and sign up / log in (e.g. with GitHub).
3. Click **Add New** → **Project** and import your GitHub repository.
4. In **Environment Variables**, add:
   - `STRIPE_SECRET_KEY` = your `sk_test_...` (or `sk_live_...` when you go live)
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = your `pk_test_...` (or `pk_live_...`)
5. Deploy. Vercel will build and give you a URL like `https://your-project.vercel.app`.
6. **Important:** In Stripe Dashboard → **Developers** → **Webhooks** (or in the Checkout Session), the success/cancel URLs must use this Vercel URL (e.g. `https://your-project.vercel.app/success`). For Checkout, we set these in code, so as long as your app knows its own URL (e.g. from `VERCEL_URL` or your domain), it will work.

We'll set the success and cancel URLs in the API route using the current site origin (so it works on localhost and on Vercel).

---

## Part 7: Summary – How Everything Works Together

1. User opens your **homepage** (`app/page.js`).
2. User clicks **"Enter"**. The front end sends a request to **your** API route: `POST /api/checkout`.
3. The **API route** (`app/api/checkout/route.js`) runs on the server. It has access to `STRIPE_SECRET_KEY` from `.env.local`. It uses the Stripe library to create a **Checkout Session** with:
   - amount: 100 cents (1€),
   - success_url: your site’s `/success` (blank page),
   - cancel_url: your site’s `/` or `/cancel`.
4. Stripe returns a **session URL**. Your API route sends this URL back to the browser.
5. The browser **redirects** the user to Stripe’s payment page.
6. User pays (or cancels). Stripe then redirects the user to **success_url** or **cancel_url**.
7. Your **success** page (`app/success/page.js`) is a minimal page that shows nothing (blank white screen).

So: **Homepage → Click "Enter" → Your API creates Stripe session → User pays on Stripe → Redirect to blank success page.**

---

## Part 8: Checklist Before You Say "Done"

- [ ] Next.js project created with JavaScript (no TypeScript).
- [ ] Stripe installed (`npm install stripe`).
- [ ] Stripe account created, Test mode on.
- [ ] `.env.local` created with `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
- [ ] `.env.local` is in `.gitignore` (it usually is by default for create-next-app).
- [ ] Homepage shows an "Enter" button.
- [ ] Clicking "Enter" opens Stripe Checkout for 1€ (100 cents).
- [ ] After paying with test card `4242 4242 4242 4242`, you are redirected to a blank white page.
- [ ] For deployment: repo on GitHub, project on Vercel, same env vars added in Vercel, and success/cancel URLs use your Vercel URL.

---

You’re ready to implement. The next sections of this guide assume you’ve run the terminal commands above. The code in the project will have comments in every file explaining what each part does.
