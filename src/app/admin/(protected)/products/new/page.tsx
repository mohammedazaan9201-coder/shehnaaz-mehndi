import ProductForm from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="font-display text-2xl sm:text-3xl text-mehndi-800">Add Product</h1>
      <p className="mt-1 text-sm text-brown-400">Add a new item to the catalog.</p>
      <div className="mt-6">
        <ProductForm />
      </div>
    </div>
  );
}
