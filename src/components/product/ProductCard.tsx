"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { Product } from "@/lib/types";
import { formatINR, cn } from "@/lib/utils";
import { useWishlist } from "@/lib/wishlist-context";
import { useCart } from "@/lib/cart-context";

export default function ProductCard({ product }: { product: Product }) {
  const { toggle, isWishlisted } = useWishlist();
  const { addItem, openCart } = useCart();
  const wishlisted = isWishlisted(product.id);
  const outOfStock = product.stock <= 0;

  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault();
    if (outOfStock) return;
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      variant: product.variantLabel,
      price: product.price,
      quantity: 1,
      image: product.images[0],
      maxStock: product.stock,
    });
    openCart();
  }

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group card overflow-hidden flex flex-col transition-transform duration-300 hover:-translate-y-1 hover:shadow-lift"
    >
      <div className="relative aspect-square bg-mehndi-50 overflow-hidden">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            toggle(product.id);
          }}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute top-2.5 right-2.5 rounded-full bg-ivory/90 p-2 shadow-soft hover:scale-110 transition-transform"
        >
          <Heart
            className={cn("h-4 w-4", wishlisted ? "fill-brown-600 text-brown-600" : "text-brown-400")}
          />
        </button>
        {outOfStock && (
          <span className="absolute bottom-2.5 left-2.5 rounded-full bg-ink/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-ivory">
            Out of Stock
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-sm font-medium text-ink leading-snug line-clamp-2">{product.name}</p>
        {product.variantLabel && (
          <p className="mt-0.5 text-xs text-brown-400">{product.variantLabel}</p>
        )}
        <div className="mt-auto pt-3 flex items-center justify-between gap-2">
          <span className="text-base font-semibold text-mehndi-700">
            {formatINR(product.price)}
          </span>
          <button
            onClick={handleQuickAdd}
            disabled={outOfStock}
            className="rounded-full bg-mehndi-700 px-3.5 py-1.5 text-xs font-semibold text-ivory hover:bg-mehndi-800 transition-colors disabled:opacity-40"
          >
            Add
          </button>
        </div>
      </div>
    </Link>
  );
}
