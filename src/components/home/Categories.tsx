import Link from "next/link";
import { categories } from "@/lib/products-data";
import SectionHeading from "@/components/ui/SectionHeading";

const CATEGORY_ICON_HINT: Record<string, string> = {
  "mehndi-cones": "🌿",
  "instant-products": "⚡",
  stencils: "✒️",
  "powders-hair-care": "🌾",
  skincare: "🧴",
  "fragrance-lifestyle": "☕",
};

export default function Categories() {
  return (
    <section className="container-page py-16 sm:py-20">
      <SectionHeading eyebrow="Explore" title="Shop by Category" />
      <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/category/${c.slug}`}
            className="group card p-6 flex flex-col items-start gap-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
          >
            <span className="text-3xl" aria-hidden="true">
              {CATEGORY_ICON_HINT[c.slug] ?? "✨"}
            </span>
            <h3 className="font-display text-lg text-mehndi-800">{c.name}</h3>
            <p className="text-sm text-brown-500 leading-snug">{c.blurb}</p>
            <span className="mt-1 text-xs font-semibold text-gold-600 group-hover:translate-x-1 transition-transform">
              Shop now →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
