import Link from "next/link";
import { getFeaturedProducts } from "@/lib/db";
import SectionHeading from "@/components/ui/SectionHeading";
import ProductGrid from "@/components/product/ProductGrid";

export default function FeaturedProducts() {
  const featured = getFeaturedProducts();
  if (featured.length === 0) return null;

  return (
    <section className="bg-mehndi-50/50 py-16 sm:py-20">
      <div className="container-page">
        <SectionHeading eyebrow="Customer Favourites" title="Featured Products" />
        <div className="mt-10">
          <ProductGrid products={featured} />
        </div>
        <div className="mt-10 text-center">
          <Link href="/products" className="btn-secondary">
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
