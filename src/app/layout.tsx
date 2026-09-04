import type { Metadata } from "next";
import { Marcellus, Jost } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import { CartProvider } from "@/lib/cart-context";
import { WishlistProvider } from "@/lib/wishlist-context";

const display = Marcellus({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

const body = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.shehnaazsmehndi.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Shehnaaz's Mehndi — Premium Mehndi & Beauty Essentials",
    template: "%s | Shehnaaz's Mehndi",
  },
  description:
    "Hyderabad-based mehndi and beauty brand offering handcrafted henna cones, stencils, herbal hair powders and skincare. Tradition in every design, beauty in every detail.",
  keywords: [
    "mehndi",
    "henna cones",
    "mehndi stencils",
    "herbal hair powder",
    "skincare Hyderabad",
    "Shehnaaz's Mehndi",
  ],
  openGraph: {
    title: "Shehnaaz's Mehndi — Premium Mehndi & Beauty Essentials",
    description: "Handcrafted mehndi, skincare and beauty essentials from Hyderabad.",
    url: siteUrl,
    siteName: "Shehnaaz's Mehndi",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shehnaaz's Mehndi",
    description: "Handcrafted mehndi, skincare and beauty essentials from Hyderabad.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="min-h-screen flex flex-col">
        <CartProvider>
          <WishlistProvider>
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:rounded-full focus:bg-mehndi-700 focus:px-4 focus:py-2 focus:text-ivory"
            >
              Skip to content
            </a>
            <Header />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <Footer />
            <CartDrawer />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
