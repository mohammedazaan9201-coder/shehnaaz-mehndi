import { Star } from "lucide-react";
import { getApprovedReviews } from "@/lib/db";
import SectionHeading from "@/components/ui/SectionHeading";
import ReviewForm from "./ReviewForm";

export default function Reviews() {
  const reviews = getApprovedReviews();

  return (
    <section className="bg-mehndi-50/50 py-16 sm:py-20">
      <div className="container-page">
        <SectionHeading
          eyebrow="Reviews"
          title="What Customers Are Saying"
          subtitle={
            reviews.length === 0
              ? "Be the first to share your experience with Shehnaaz's Mehndi."
              : undefined
          }
        />

        {reviews.length > 0 && (
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {reviews.map((r) => (
              <div key={r.id} className="card p-6">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < r.rating ? "fill-gold-400 text-gold-400" : "text-brown-200"
                      }`}
                    />
                  ))}
                </div>
                <p className="mt-3 text-sm text-brown-600 leading-relaxed">{r.comment}</p>
                <p className="mt-4 text-sm font-semibold text-mehndi-800">{r.customerName}</p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12">
          <ReviewForm />
        </div>
      </div>
    </section>
  );
}
