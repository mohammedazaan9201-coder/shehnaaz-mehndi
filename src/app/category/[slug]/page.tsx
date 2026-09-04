import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategoryBySlug, categories } from "@/lib/products-data";
import { getProductsByCategory } from "@/lib/db";
import ProductGrid from "@/components/product/ProductGrid";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const category = getCategoryBySlug(params.slug);
  if (!category) return {};
  return {
    title: category.name,
    description: category.blurb,
  };
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const category = getCategoryBySlug(params.slug);
  if (!category) notFound();

  const items = getProductsByCategory(category.slug);

  return (
    <div className="container-page py-10 sm:py-14">
      <p className="eyebrow">Category</p>
      <h1 className="mt-1 font-display text-3xl sm:text-4xl text-mehndi-800">{category.name}</h1>
      <p className="mt-2 max-w-xl text-brown-500">{category.blurb}</p>
      <p className="mt-4 text-sm text-brown-400">
        {items.length} product{items.length !== 1 ? "s" : ""}
      </p>
      <div className="mt-8">
        <ProductGrid products={items} />
      </div>
    </div>
  );
}
