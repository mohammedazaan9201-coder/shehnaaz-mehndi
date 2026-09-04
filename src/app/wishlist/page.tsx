"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlist } from "@/lib/wishlist-context";
import { Product } from "@/lib/types";
import ProductGrid from "@/components/product/ProductGrid";

export default function WishlistPage() {
  const { productIds } = useWishlist();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setAllProducts(data))
      .finally(() => setLoading(false));
  }, []);

  const items = allProducts.filter((p) => productIds.includes(p.id));

  if (loading) {
    return <div className="container-page py-20 text-center text-brown-400">Loading…</div>;
  }

  if (items.length === 0) {
    return (
      <div className="container-page py-20 text-center">
        <Heart className="mx-auto h-12 w-12 text-brown-200" />
        <h1 className="mt-4 font-display text-2xl text-mehndi-800">Your wishlist is empty</h1>
        <p className="mt-2 text-brown-500">Save products you love by tapping the heart icon.</p>
        <Link href="/products" className="btn-primary mt-6 inline-flex">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-10 sm:py-14">
      <h1 className="font-display text-3xl sm:text-4xl text-mehndi-800">Your Wishlist</h1>
      <p className="mt-2 text-brown-500">
        {items.length} product{items.length !== 1 ? "s" : ""} saved
      </p>
      <div className="mt-8">
        <ProductGrid products={items} />
      </div>
    </div>
  );
}
