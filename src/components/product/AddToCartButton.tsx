"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { Product } from "@/lib/types";
import { useCart } from "@/lib/cart-context";

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem, openCart } = useCart();
  const [qty, setQty] = useState(1);
  const outOfStock = product.stock <= 0;
  const lowStock = !outOfStock && product.stock <= 5;

  function handleAdd() {
    if (outOfStock) return;
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      variant: product.variantLabel,
      price: product.price,
      quantity: qty,
      image: product.images[0],
      maxStock: product.stock,
    });
    openCart();
  }

  return (
    <div className="space-y-4">
      <div>
        {outOfStock ? (
          <span className="inline-flex items-center rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
            Out of Stock
          </span>
        ) : lowStock ? (
          <span className="inline-flex items-center rounded-full bg-gold-50 px-3 py-1 text-xs font-semibold text-gold-700">
            Only {product.stock} left in stock
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full bg-mehndi-50 px-3 py-1 text-xs font-semibold text-mehndi-700">
            In Stock
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-full border border-brown-200">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="p-3 hover:bg-mehndi-50 rounded-full"
            aria-label="Decrease quantity"
            disabled={outOfStock}
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-8 text-center text-sm font-medium">{qty}</span>
          <button
            onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
            className="p-3 hover:bg-mehndi-50 rounded-full"
            aria-label="Increase quantity"
            disabled={outOfStock}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <button onClick={handleAdd} disabled={outOfStock} className="btn-primary flex-1">
          <ShoppingBag className="h-4 w-4" />
          Add to Cart
        </button>
      </div>
    </div>
  );
}
