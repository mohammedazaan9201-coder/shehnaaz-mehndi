import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import { getCategoryBySlug } from "@/lib/products-data";
import { getProductBySlug, getProductsByCategory } from "@/lib/db";
import { formatINR } from "@/lib/utils";
import ProductGallery from "@/components/product/ProductGallery";
import AddToCartButton from "@/components/product/AddToCartButton";
import WishlistButton from "@/components/product/WishlistButton";
import ProductGrid from "@/components/product/ProductGrid";

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const product = getProductBySlug(params.slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images,
    },
  };
}

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();

  const category = getCategoryBySlug(product.categorySlug);
  const related = getProductsByCategory(product.categorySlug)
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="container-page py-8 sm:py-12">
      <nav className="flex items-center gap-1.5 text-xs text-brown-400 mb-6" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-mehndi-700">
          Home
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/products" className="hover:text-mehndi-700">
          Shop
        </Link>
        {category && (
          <>
            <ChevronRight className="h-3 w-3" />
            <Link href={`/category/${category.slug}`} className="hover:text-mehndi-700">
              {category.name}
            </Link>
          </>
        )}
        <ChevronRight className="h-3 w-3" />
        <span className="text-brown-600 truncate">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <ProductGallery images={product.images} name={product.name} />

        <div>
          {category && (
            <Link
              href={`/category/${category.slug}`}
              className="eyebrow hover:text-gold-700 transition-colors"
            >
              {category.name}
            </Link>
          )}
          <h1 className="mt-2 font-display text-3xl sm:text-4xl text-mehndi-800 leading-tight">
            {product.name}
          </h1>
          {product.variantLabel && (
            <p className="mt-1 text-sm text-brown-400">{product.variantLabel}</p>
          )}
          <p className="mt-4 text-2xl font-semibold text-mehndi-700">
            {formatINR(product.price)}
          </p>
          <p className="mt-5 text-brown-600 leading-relaxed">{product.description}</p>

          <div className="mt-7">
            <AddToCartButton product={product} />
          </div>
          <div className="mt-3">
            <WishlistButton productId={product.id} />
          </div>

          <div className="mt-8 rounded-xl2 border border-brown-100 bg-ivory-card p-5 text-sm text-brown-500 space-y-2">
            <p>&bull; Handled with care and packed securely from Hyderabad.</p>
            <p>&bull; Choose Home Delivery or Store Pickup at checkout.</p>
            <p>&bull; Need help deciding? Message us on WhatsApp from the Contact page.</p>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-16 sm:mt-20">
          <h2 className="font-display text-2xl text-mehndi-800 mb-6">You May Also Like</h2>
          <ProductGrid products={related} />
        </div>
      )}
    </div>
  );
}
