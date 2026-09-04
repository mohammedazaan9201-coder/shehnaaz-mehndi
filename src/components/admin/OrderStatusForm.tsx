"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Order, ORDER_STATUSES, ORDER_STATUS_LABELS } from "@/lib/types";

export default function OrderStatusForm({ order }: { order: Order }) {
  const router = useRouter();
  const [status, setStatus] = useState(order.status);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, note: note || undefined }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Could not update order.");
      }
      setNote("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="label-field" htmlFor="status">
          Order Status
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as Order["status"])}
          className="input-field"
        >
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {ORDER_STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="label-field" htmlFor="note">
          Note (optional)
        </label>
        <input
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="e.g. Packed and handed to courier"
          className="input-field"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={submitting} className="btn-primary w-full">
        {submitting ? "Updating…" : "Update Status"}
      </button>
      {status === "CANCELLED" && order.status !== "CANCELLED" && (
        <p className="text-xs text-brown-400">
          Cancelling will restore the reserved stock for this order&rsquo;s items.
        </p>
      )}
    </form>
  );
}
