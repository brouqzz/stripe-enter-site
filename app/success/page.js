/**
 * Success page – shown AFTER the user completes payment on Stripe.
 * Stripe redirects the user here using the success_url we set in the checkout session.
 *
 * You asked for a completely blank page: just an empty white screen.
 * So this component returns nothing visible – only a minimal wrapper so Next.js is happy.
 */

export default function SuccessPage() {
  // Return a minimal fragment. The layout still gives us <html> and <body>.
  // We don't render any text, images, or buttons – just a blank white screen.
  return null;
}
