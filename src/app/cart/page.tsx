"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatINR } from "@/lib/utils";

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal, hydrated } = useCart();

  if (!hydrated) {
    return <div className="container-page py-20 text-center text-brown-400">Loading your cart…</div>;
  }

  if (items.length === 0) {
    return (
      <div className="container-page py-20 text-center">
        <ShoppingBag className="mx-auto h-12 w-12 text-brown-200" />
        <h1 className="mt-4 font-display text-2xl text-mehndi-800">Your cart is empty</h1>
        <p className="mt-2 text-brown-500">Looks like you haven&rsquo;t added anything yet.</p>
        <Link href="/products" className="btn-primary mt-6 inline-flex">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-10 sm:py-14">
      <h1 className="font-display text-3xl sm:text-4xl text-mehndi-800">Your Cart</h1>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={`${item.productId}-${item.variant ?? ""}`}
              className="card flex gap-4 p-4"
            >
              <div className="relative h-24 w-24 sm:h-28 sm:w-28 shrink-0 overflow-hidden rounded-xl bg-mehndi-50">
                {item.image && (
                  <Image src={item.image} alt={item.name} fill sizes="112px" className="object-cover" />
                )}
              </div>
              <div className="flex-1 min-w-0 flex flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link
                      href={`/products/${item.slug}`}
                      className="font-medium text-ink hover:text-mehndi-700 transition-colors"
                    >
                      {item.name}
                    </Link>
                    {item.variant && <p className="text-xs text-brown-400 mt-0.5">{item.variant}</p>}
                  </div>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="rounded-full p-1.5 text-brown-400 hover:bg-red-50 hover:text-red-500 shrink-0"
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="flex items-center rounded-full border border-brown-200">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="p-2 hover:bg-mehndi-50 rounded-full"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-7 text-center text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      disabled={item.quantity >= item.maxStock}
                      className="p-2 hover:bg-mehndi-50 rounded-full disabled:opacity-40"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <span className="font-semibold text-mehndi-700">
                    {formatINR(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card p-6 h-fit lg:sticky lg:top-24">
          <h2 className="font-display text-lg text-mehndi-800">Order Summary</h2>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-brown-500">Subtotal</span>
            <span className="font-medium">{formatINR(subtotal)}</span>
          </div>
          <p className="mt-1 text-xs text-brown-400">
            Delivery charges (if any) are calculated at checkout.
          </p>
          <Link href="/checkout" className="btn-primary w-full mt-5">
            Proceed to Checkout
          </Link>
          <Link href="/products" className="btn-secondary w-full mt-2.5">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
