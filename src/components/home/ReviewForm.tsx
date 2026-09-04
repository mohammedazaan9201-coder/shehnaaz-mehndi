"use client";

import { useState } from "react";
import { Star } from "lucide-react";

export default function ReviewForm() {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;
    setStatus("submitting");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerName: name.trim(), rating, comment: comment.trim() }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("done");
      setName("");
      setComment("");
      setRating(5);
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="card p-6 text-center max-w-lg mx-auto">
        <p className="font-display text-lg text-mehndi-800">Thank you for your review!</p>
        <p className="mt-1 text-sm text-brown-500">
          It&apos;s been submitted and will appear here once approved by our team.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6 max-w-lg mx-auto space-y-4">
      <h3 className="font-display text-lg text-mehndi-800">Share Your Experience</h3>
      <div>
        <label className="label-field" htmlFor="reviewer-name">
          Your name
        </label>
        <input
          id="reviewer-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="input-field"
          placeholder="e.g. Ayesha K."
        />
      </div>
      <div>
        <label className="label-field">Rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              type="button"
              key={n}
              onClick={() => setRating(n)}
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
              className="p-0.5"
            >
              <Star
                className={`h-6 w-6 ${
                  n <= rating ? "fill-gold-400 text-gold-400" : "text-brown-200"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="label-field" htmlFor="reviewer-comment">
          Your review
        </label>
        <textarea
          id="reviewer-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          rows={4}
          className="input-field"
          placeholder="Tell us about your experience…"
        />
      </div>
      {status === "error" && (
        <p className="text-sm text-red-600">Something went wrong. Please try again.</p>
      )}
      <button type="submit" disabled={status === "submitting"} className="btn-primary w-full">
        {status === "submitting" ? "Submitting…" : "Submit Review"}
      </button>
      <p className="text-xs text-brown-400 text-center">
        Reviews are moderated and appear publicly once approved.
      </p>
    </form>
  );
}
