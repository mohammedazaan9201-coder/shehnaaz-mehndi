import Link from "next/link";
import { Plus } from "lucide-react";
import { getAllProducts } from "@/lib/db";
import ProductsTable from "@/components/admin/ProductsTable";

export default function AdminProductsPage() {
  const products = getAllProducts().sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl text-mehndi-800">Products</h1>
          <p className="mt-1 text-sm text-brown-400">{products.length} products in catalog</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary">
          <Plus className="h-4 w-4" />
          Add Product
        </Link>
      </div>

      <div className="mt-6">
        <ProductsTable initialProducts={products} />
      </div>
    </div>
  );
}
