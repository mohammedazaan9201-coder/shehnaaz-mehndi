"use client";

import { useEffect, useState } from "react";
import { Star, Check, X, Trash2 } from "lucide-react";
import { Review } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/reviews?admin=1")
      .then((res) => res.json())
      .then((data) => setReviews(data))
      .finally(() => setLoading(false));
  }, []);

  async function setApproval(id: string, isApproved: boolean) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/reviews/${id}/approve`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved }),
      });
      if (res.ok) {
        const updated = await res.json();
        setReviews((prev) => prev.map((r) => (r.id === id ? updated : r)));
      }
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this review permanently?")) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/reviews/${id}`, { method: "DELETE" });
      if (res.ok) setReviews((prev) => prev.filter((r) => r.id !== id));
    } finally {
      setBusyId(null);
    }
  }

  const pending = reviews.filter((r) => !r.isApproved);
  const approved = reviews.filter((r) => r.isApproved);

  return (
    <div>
      <h1 className="font-display text-2xl sm:text-3xl text-mehndi-800">Reviews</h1>
      <p className="mt-1 text-sm text-brown-400">
        {pending.length} pending &middot; {approved.length} approved
      </p>

      {loading ? (
        <p className="mt-6 text-sm text-brown-400">Loading…</p>
      ) : reviews.length === 0 ? (
        <p className="mt-6 text-sm text-brown-400">No reviews submitted yet.</p>
      ) : (
        <div className="mt-6 space-y-8">
          {pending.length > 0 && (
            <div>
              <h2 className="font-display text-lg text-mehndi-800 mb-3">Pending Approval</h2>
              <div className="space-y-3">
                {pending.map((r) => (
                  <ReviewRow
                    key={r.id}
                    review={r}
                    busy={busyId === r.id}
                    onApprove={() => setApproval(r.id, true)}
                    onReject={() => setApproval(r.id, false)}
                    onDelete={() => handleDelete(r.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {approved.length > 0 && (
            <div>
              <h2 className="font-display text-lg text-mehndi-800 mb-3">Approved &amp; Live</h2>
              <div className="space-y-3">
                {approved.map((r) => (
                  <ReviewRow
                    key={r.id}
                    review={r}
                    busy={busyId === r.id}
                    onReject={() => setApproval(r.id, false)}
                    onDelete={() => handleDelete(r.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ReviewRow({
  review,
  busy,
  onApprove,
  onReject,
  onDelete,
}: {
  review: Review;
  busy: boolean;
  onApprove?: () => void;
  onReject: () => void;
  onDelete: () => void;
}) {
  return (
    <div className={cn("card p-5 flex flex-col sm:flex-row sm:items-start gap-4", busy && "opacity-50")}>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="font-medium text-ink">{review.customerName}</p>
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-3.5 w-3.5",
                  i < review.rating ? "fill-gold-400 text-gold-400" : "text-brown-200"
                )}
              />
            ))}
          </div>
        </div>
        <p className="mt-1.5 text-sm text-brown-600 leading-relaxed">{review.comment}</p>
        <p className="mt-2 text-xs text-brown-400">
          {new Date(review.createdAt).toLocaleString("en-IN")}
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {onApprove && (
          <button
            onClick={onApprove}
            className="rounded-full bg-mehndi-700 p-2 text-ivory hover:bg-mehndi-800"
            aria-label="Approve review"
          >
            <Check className="h-4 w-4" />
          </button>
        )}
        {review.isApproved && (
          <button
            onClick={onReject}
            className="rounded-full border border-brown-200 p-2 text-brown-500 hover:bg-brown-50"
            aria-label="Unpublish review"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <button
          onClick={onDelete}
          className="rounded-full p-2 text-brown-400 hover:bg-red-50 hover:text-red-600"
          aria-label="Delete review"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
