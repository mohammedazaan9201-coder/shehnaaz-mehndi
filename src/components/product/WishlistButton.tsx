"use client";

import { Heart } from "lucide-react";
import { useWishlist } from "@/lib/wishlist-context";
import { cn } from "@/lib/utils";

export default function WishlistButton({ productId }: { productId: string }) {
  const { toggle, isWishlisted } = useWishlist();
  const active = isWishlisted(productId);

  return (
    <button
      onClick={() => toggle(productId)}
      className="btn-secondary"
      aria-pressed={active}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart className={cn("h-4 w-4", active ? "fill-brown-600 text-brown-600" : "")} />
      {active ? "Wishlisted" : "Add to Wishlist"}
    </button>
  );
}
