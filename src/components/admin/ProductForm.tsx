"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { Product } from "@/lib/types";
import { categories } from "@/lib/products-data";

interface ProductFormProps {
  product?: Product;
}

export default function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const isEdit = Boolean(product);

  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product?.price?.toString() ?? "");
  const [compareAtPrice, setCompareAtPrice] = useState(product?.compareAtPrice?.toString() ?? "");
  const [categorySlug, setCategorySlug] = useState(product?.categorySlug ?? categories[0].slug);
  const [variantLabel, setVariantLabel] = useState(product?.variantLabel ?? "");
  const [stock, setStock] = useState(product?.stock?.toString() ?? "0");
  const [isFeatured, setIsFeatured] = useState(product?.isFeatured ?? false);
  const [isActive, setIsActive] = useState(product?.isActive ?? true);
  const [images, setImages] = useState<string[]>(product?.images?.length ? product.images : [""]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function updateImage(i: number, value: string) {
    setImages((prev) => prev.map((img, idx) => (idx === i ? value : img)));
  }

  function handleFile(i: number, file: File | undefined) {
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      setError("Images must be under 3MB each.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => updateImage(i, reader.result as string);
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const cleanImages = images.map((i) => i.trim()).filter(Boolean);
    if (cleanImages.length === 0) {
      setError("Add at least one product image (URL or upload).");
      return;
    }
    const priceNum = Number(price);
    const stockNum = Number(stock);
    if (!name.trim() || !description.trim() || Number.isNaN(priceNum) || Number.isNaN(stockNum)) {
      setError("Please fill in all required fields with valid values.");
      return;
    }

    setSubmitting(true);
    const payload = {
      name: name.trim(),
      description: description.trim(),
      price: priceNum,
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
      categorySlug,
      variantLabel: variantLabel.trim() || undefined,
      stock: stockNum,
      isFeatured,
      isActive,
      images: cleanImages,
    };

    try {
      const res = await fetch(isEdit ? `/api/products/${product!.id}` : "/api/products", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Could not save product.");
      }
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6 space-y-5 max-w-2xl">
      <div>
        <label className="label-field" htmlFor="name">
          Product Name *
        </label>
        <input id="name" required value={name} onChange={(e) => setName(e.target.value)} className="input-field" />
      </div>

      <div>
        <label className="label-field" htmlFor="description">
          Description *
        </label>
        <textarea
          id="description"
          required
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input-field"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label-field" htmlFor="price">
            Price (₹) *
          </label>
          <input
            id="price"
            type="number"
            min={0}
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label className="label-field" htmlFor="compareAtPrice">
            Compare-at Price (optional)
          </label>
          <input
            id="compareAtPrice"
            type="number"
            min={0}
            value={compareAtPrice}
            onChange={(e) => setCompareAtPrice(e.target.value)}
            className="input-field"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label-field" htmlFor="category">
            Category *
          </label>
          <select
            id="category"
            value={categorySlug}
            onChange={(e) => setCategorySlug(e.target.value)}
            className="input-field"
          >
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label-field" htmlFor="stock">
            Stock Quantity *
          </label>
          <input
            id="stock"
            type="number"
            min={0}
            required
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="input-field"
          />
        </div>
      </div>

      <div>
        <label className="label-field" htmlFor="variantLabel">
          Variant Label (optional)
        </label>
        <input
          id="variantLabel"
          value={variantLabel}
          onChange={(e) => setVariantLabel(e.target.value)}
          placeholder="e.g. 12 pcs, Medium, Red/Maroon/Brown"
          className="input-field"
        />
      </div>

      <div>
        <label className="label-field">Product Images *</label>
        <div className="space-y-2">
          {images.map((img, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                value={img}
                onChange={(e) => updateImage(i, e.target.value)}
                placeholder="/products/example.jpg or paste an image URL"
                className="input-field flex-1"
              />
              <label className="btn-secondary cursor-pointer whitespace-nowrap px-3 py-2 text-xs">
                Upload
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFile(i, e.target.files?.[0])}
                />
              </label>
              {images.length > 1 && (
                <button
                  type="button"
                  onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                  className="rounded-full p-2 text-brown-400 hover:bg-red-50 hover:text-red-600"
                  aria-label="Remove image"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setImages((prev) => [...prev, ""])}
          className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-gold-600"
        >
          <Plus className="h-3.5 w-3.5" /> Add another image
        </button>
      </div>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
          Featured on homepage
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
          Active (visible to customers)
        </label>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center gap-3 pt-2">
        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting ? "Saving…" : isEdit ? "Save Changes" : "Add Product"}
        </button>
        <button type="button" onClick={() => router.push("/admin/products")} className="btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  );
}
