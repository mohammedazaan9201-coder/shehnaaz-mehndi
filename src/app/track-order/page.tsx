"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Order } from "@/lib/types";
import { formatINR } from "@/lib/utils";
import OrderStatusTracker from "@/components/order/OrderStatusTracker";

function TrackOrderForm() {
  const searchParams = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(searchParams.get("orderNumber") ?? "");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setOrder(null);
    setLoading(true);
    try {
      const res = await fetch("/api/orders/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNumber, phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Order not found.");
      setOrder(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-page py-10 sm:py-14 max-w-2xl mx-auto">
      <p className="eyebrow text-center">Order Tracking</p>
      <h1 className="mt-1 text-center font-display text-3xl sm:text-4xl text-mehndi-800">
        Track Your Order
      </h1>
      <p className="mt-2 text-center text-brown-500">
        Enter your order number and the phone number used at checkout.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 card p-6 space-y-4">
        <div>
          <label className="label-field" htmlFor="orderNumber">
            Order Number
          </label>
          <input
            id="orderNumber"
            required
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="e.g. SM-20260824-0001"
            className="input-field"
          />
        </div>
        <div>
          <label className="label-field" htmlFor="phone">
            Phone Number
          </label>
          <input
            id="phone"
            required
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="10-digit mobile number"
            className="input-field"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full">
          <Search className="h-4 w-4" />
          {loading ? "Searching…" : "Track Order"}
        </button>
      </form>

      {order && (
        <div className="mt-8 card p-6">
          <div className="flex items-center justify-between">
            <p className="font-mono font-semibold text-mehndi-800">{order.orderNumber}</p>
            <p className="text-sm text-brown-400">
              {new Date(order.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>

          <div className="mt-6">
            <OrderStatusTracker
              status={order.status}
              isPickup={order.deliveryMethod === "STORE_PICKUP"}
            />
          </div>

          <div className="mt-6 divide-y divide-brown-100">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between py-2.5 text-sm">
                <span className="text-brown-600">
                  {item.name}
                  {item.variant ? ` — ${item.variant}` : ""}{" "}
                  <span className="text-brown-400">&times;{item.quantity}</span>
                </span>
                <span className="font-medium">{formatINR(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-brown-100 flex justify-between font-semibold text-mehndi-800">
            <span>Total</span>
            <span>{formatINR(order.total)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={null}>
      <TrackOrderForm />
    </Suspense>
  );
}
