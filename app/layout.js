/**
 * Root layout – wraps every page in the app.
 * In the App Router, this file is required and wraps all pages.
 * We import global CSS here so it applies everywhere.
 */

import "./globals.css";

// "metadata" is used by Next.js to set the <title> and meta tags in the <head>.
export const metadata = {
  title: "Enter",
  description: "Pay 1€ to enter",
};

// "children" is the content of whichever page is being shown (e.g. the homepage or success page).
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
