"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Menu, Search, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import { categories } from "@/lib/products-data";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { itemCount, openCart } = useCart();
  const { productIds } = useWishlist();
  const router = useRouter();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/products?q=${encodeURIComponent(query.trim())}`);
    setMobileOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-brown-100/60 bg-ivory/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
       <Link href="/" className="flex flex-col leading-none shrink-0">
  <span className="font-display text-xl sm:text-2xl text-mehndi-800 tracking-wide">
    Shehnaaz&rsquo;s
  </span>
  <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-gold-600">
    Mehndi
  </span>
</Link>        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-brown-700">
          <Link href="/products" className="hover:text-mehndi-700 transition-colors">
            Shop All
          </Link>
          {categories.slice(0, 4).map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className="hover:text-mehndi-700 transition-colors"
            >
              {c.name}
            </Link>
          ))}
          <Link href="/track-order" className="hover:text-mehndi-700 transition-colors">
            Track Order
          </Link>
          <Link href="/contact" className="hover:text-mehndi-700 transition-colors">
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <form onSubmit={handleSearch} className="hidden md:flex items-center relative">
            <Search className="absolute left-3 h-4 w-4 text-brown-300" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="search"
              placeholder="Search products…"
              className="w-48 rounded-full border border-brown-200 bg-ivory-card py-2 pl-9 pr-3 text-sm focus:border-mehndi-500 focus:outline-none focus:ring-2 focus:ring-mehndi-100 transition-colors"
              aria-label="Search products"
            />
          </form>

          <Link
            href="/wishlist"
            className="relative rounded-full p-2 text-brown-700 hover:bg-mehndi-50 transition-colors"
            aria-label="Wishlist"
          >
            <Heart className="h-5 w-5" />
            {productIds.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold-400 px-1 text-[10px] font-bold text-brown-800">
                {productIds.length}
              </span>
            )}
          </Link>

          <button
            onClick={openCart}
            className="relative rounded-full p-2 text-brown-700 hover:bg-mehndi-50 transition-colors"
            aria-label="Open cart"
          >
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-mehndi-700 px-1 text-[10px] font-bold text-ivory">
                {itemCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="rounded-full p-2 text-brown-700 hover:bg-mehndi-50 transition-colors lg:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-brown-100/60 bg-ivory">
          <div className="container-page py-4 flex flex-col gap-1">
            <form onSubmit={handleSearch} className="relative mb-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brown-300" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="search"
                placeholder="Search products…"
                className="input-field pl-9"
                aria-label="Search products"
              />
            </form>
            <Link
              href="/products"
              onClick={() => setMobileOpen(false)}
              className="py-2.5 text-brown-700 border-b border-brown-100/60"
            >
              Shop All
            </Link>
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                onClick={() => setMobileOpen(false)}
                className="py-2.5 text-brown-700 border-b border-brown-100/60"
              >
                {c.name}
              </Link>
            ))}
            <Link
              href="/track-order"
              onClick={() => setMobileOpen(false)}
              className="py-2.5 text-brown-700 border-b border-brown-100/60"
            >
              Track Order
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="py-2.5 text-brown-700"
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
