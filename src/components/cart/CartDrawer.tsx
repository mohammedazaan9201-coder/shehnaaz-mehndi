"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatINR } from "@/lib/utils";

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, subtotal } = useCart();

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-ink/40 transition-opacity ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeCart}
        aria-hidden="true"
      />
      <aside
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-md bg-ivory shadow-lift transition-transform duration-300 flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between border-b border-brown-100 px-5 py-4">
          <h2 className="font-display text-xl text-mehndi-800">Your Cart</h2>
          <button
            onClick={closeCart}
            className="rounded-full p-2 hover:bg-mehndi-50 transition-colors"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <ShoppingBag className="h-10 w-10 text-brown-200" />
            <p className="text-brown-500">Your cart is empty.</p>
            <Link href="/products" onClick={closeCart} className="btn-primary mt-2">
              Start Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {items.map((item) => (
                <div key={`${item.productId}-${item.variant ?? ""}`} className="flex gap-3">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-mehndi-50">
                    {item.image && (
                      <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink truncate">{item.name}</p>
                    {item.variant && <p className="text-xs text-brown-400">{item.variant}</p>}
                    <p className="text-sm text-mehndi-700 font-semibold mt-1">
                      {formatINR(item.price)}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="rounded-full border border-brown-200 p-1 hover:bg-mehndi-50"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-6 text-center text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        disabled={item.quantity >= item.maxStock}
                        className="rounded-full border border-brown-200 p-1 hover:bg-mehndi-50 disabled:opacity-40"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="ml-auto rounded-full p-1.5 text-brown-400 hover:bg-red-50 hover:text-red-500"
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-brown-100 px-5 py-4 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-brown-500">Subtotal</span>
                <span className="text-lg font-semibold text-mehndi-800">
                  {formatINR(subtotal)}
                </span>
              </div>
              <p className="text-xs text-brown-400">Shipping & delivery method chosen at checkout.</p>
              <Link href="/checkout" onClick={closeCart} className="btn-primary w-full">
                Proceed to Checkout
              </Link>
              <Link
                href="/cart"
                onClick={closeCart}
                className="btn-secondary w-full"
              >
                View Cart
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
