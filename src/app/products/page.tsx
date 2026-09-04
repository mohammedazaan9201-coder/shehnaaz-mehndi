import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { categories } from "@/lib/products-data";
import { getActiveProducts } from "@/lib/db";
import { Product } from "@/lib/types";
import ProductGrid from "@/components/product/ProductGrid";
import SortSelect from "@/components/product/SortSelect";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Shop All Products",
  description:
    "Browse mehndi cones, stencils, herbal hair powders, skincare and more from Shehnaaz's Mehndi.",
};

function filterAndSort(
  all: Product[],
  q?: string,
  category?: string,
  sort?: string
): Product[] {
  let list = all.filter((p) => p.isActive);

  if (category) {
    list = list.filter((p) => p.categorySlug === category);
  }

  if (q) {
    const term = q.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.categorySlug.toLowerCase().includes(term)
    );
  }

  switch (sort) {
    case "price-asc":
      list = [...list].sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      list = [...list].sort((a, b) => b.price - a.price);
      break;
    case "name-asc":
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      list = [...list].sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
  }

  return list;
}

export default function ProductsPage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string; sort?: string };
}) {
  const { q, category, sort } = searchParams;
  const results = filterAndSort(getActiveProducts(), q, category, sort);

  return (
    <div className="container-page py-10 sm:py-14">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Shop</p>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl text-mehndi-800">
            {q ? `Results for "${q}"` : "All Products"}
          </h1>
          <p className="mt-2 text-sm text-brown-500">
            {results.length} product{results.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <Suspense fallback={null}>
          <SortSelect />
        </Suspense>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/products"
          className={cn(
            "rounded-full px-4 py-1.5 text-sm border transition-colors",
            !category
              ? "bg-mehndi-700 text-ivory border-mehndi-700"
              : "border-brown-200 text-brown-600 hover:border-mehndi-400"
          )}
        >
          All
        </Link>
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/products?category=${c.slug}`}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm border transition-colors",
              category === c.slug
                ? "bg-mehndi-700 text-ivory border-mehndi-700"
                : "border-brown-200 text-brown-600 hover:border-mehndi-400"
            )}
          >
            {c.name}
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <ProductGrid products={results} />
      </div>
    </div>
  );
}
