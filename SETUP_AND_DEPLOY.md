# Setup and deployment – step by step

Follow this after you have the project files. Everything is in order.

---

## 1. Install dependencies

Open a terminal, go to the project folder, and run:

```bash
cd "/Users/chekurdan/Documents/Documents - Nikita's MacBook Air/stripe-enter-website"
npm install
```

**What this does:** Downloads Next.js, React, and Stripe into the `node_modules` folder. You only need to do this once (or after adding new packages).

**Warnings you might see:**  
`npm install` can show messages like "Unsupported engine" (if your Node version is old) or "deprecated". The project should still run. If you get errors when running `npm run dev`, try installing a newer Node (e.g. 20 or 22) from [nodejs.org](https://nodejs.org). For learning, you can ignore deprecation warnings.

---

## 2. Create a Stripe account and get test keys

1. Go to **[https://stripe.com](https://stripe.com)** and click **Sign up** (free).
2. Complete registration and log in.
3. Open **Developers → API keys**:  
   **[https://dashboard.stripe.com/test/apikeys](https://dashboard.stripe.com/test/apikeys)**
4. Ensure you're in **Test mode** (toggle in the top right – it should say "Test mode").
5. You'll see:
   - **Publishable key** (starts with `pk_test_...`) – you can use this in the browser.
   - **Secret key** (starts with `sk_test_...`) – click **Reveal** and copy it.  
   **Never share the secret key or put it in front-end code.**

---

## 3. Create `.env.local` and paste your keys

In the **root** of the project (same folder as `package.json`), create a new file named exactly:

**`.env.local`**

Put these two lines inside, and replace the placeholders with your real keys from the Stripe dashboard:

```
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxx
```

**Rules:**

- No spaces around the `=` sign.
- No quotes (unless your key actually contains quotes).
- One variable per line.
- **Do not commit this file to Git** (it’s already in `.gitignore`).

**If you forget this file or the secret key:** When you click "Enter", the app will show an error like "Server configuration error: Stripe key missing".

---

## 4. Run the project locally

In the project folder, run:

```bash
npm run dev
```

Then open **[http://localhost:3000](http://localhost:3000)** in your browser.

You should see the homepage with the "Enter" button.  
To stop the server: press **Ctrl+C** in the terminal.

---

## 5. Test the payment (test mode)

1. On the homepage, click **Enter**.
2. You should be redirected to Stripe’s payment page (Stripe Checkout).
3. Use Stripe’s test card:
   - **Card number:** `4242 4242 4242 4242`
   - **Expiry:** any future date (e.g. `12/34`)
   - **CVC:** any 3 digits (e.g. `123`)
   - **Country / postal code:** any valid value
4. Complete the payment. You should be redirected to **your** site’s `/success` page – a blank white screen.
5. To test cancel: click Enter again, then click "Back" or close the Stripe tab. You should land on `/cancel`.

No real money is charged in test mode.

---

## 6. Deploy to Vercel (step by step)

### 6.1 Put your code on GitHub

1. Create a new repository on [GitHub](https://github.com) (e.g. `stripe-enter-website`). Do **not** add a README or .gitignore (you already have them).
2. In your project folder, run:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your GitHub username and repo name.  
**Important:** `.env.local` is in `.gitignore`, so it will **not** be pushed. That’s correct – you’ll add secrets in Vercel instead.

### 6.2 Create a Vercel project and add env vars

1. Go to **[https://vercel.com](https://vercel.com)** and sign up or log in (e.g. with GitHub).
2. Click **Add New → Project**.
3. Import your GitHub repository (e.g. `stripe-enter-website`).
4. Before clicking **Deploy**, open **Environment Variables**.
5. Add two variables (use the same names and values as in `.env.local`):

   - **Name:** `STRIPE_SECRET_KEY`  
     **Value:** your `sk_test_...` key

   - **Name:** `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`  
     **Value:** your `pk_test_...` key

6. Click **Deploy**. Vercel will build and give you a URL like `https://stripe-enter-website-xxx.vercel.app`.

### 6.3 Test the deployed site

1. Open the Vercel URL. You should see the same homepage.
2. Click **Enter** and complete a test payment. You should be redirected to `https://your-project.vercel.app/success` (blank white page).

Success and cancel URLs are built in code from the request origin, so they work on both localhost and Vercel without extra configuration.

---

## 7. Going live with real payments (later)

When you’re ready to accept real money:

1. In the Stripe dashboard, switch to **Live mode** and get your **live** API keys (`pk_live_...` and `sk_live_...`).
2. In Vercel, update the environment variables to use the live keys (or add new env vars for production).
3. Redeploy.  
Never use live keys in development or commit them to Git.

---

## Quick checklist

- [ ] Ran `npm install` in the project folder.
- [ ] Created Stripe account and copied test API keys.
- [ ] Created `.env.local` with `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
- [ ] Ran `npm run dev` and opened http://localhost:3000.
- [ ] Clicked "Enter", paid with `4242 4242 4242 4242`, and saw the blank success page.
- [ ] Pushed code to GitHub (without `.env.local`).
- [ ] Deployed on Vercel and added the same two env vars.
- [ ] Tested the Vercel URL with a test payment.
