import { notFound } from "next/navigation";
import { getProductById } from "@/lib/db";
import ProductForm from "@/components/admin/ProductForm";

export default function EditProductPage({ params }: { params: { id: string } }) {
  const product = getProductById(params.id);
  if (!product) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl sm:text-3xl text-mehndi-800">Edit Product</h1>
      <p className="mt-1 text-sm text-brown-400">{product.name}</p>
      <div className="mt-6">
        <ProductForm product={product} />
      </div>
    </div>
  );
}
