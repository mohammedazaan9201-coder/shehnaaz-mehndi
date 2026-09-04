"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { Product } from "@/lib/types";
import { formatINR, cn } from "@/lib/utils";

export default function ProductsTable({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [busyId, setBusyId] = useState<string | null>(null);
  const router = useRouter();

  async function handleStockChange(id: string, stock: number) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: Math.max(0, stock) }),
      });
      if (res.ok) {
        const updated = await res.json();
        setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
      }
    } finally {
      setBusyId(null);
    }
  }

  async function handleToggleActive(id: string, isActive: boolean) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive }),
      });
      if (res.ok) {
        const updated = await res.json();
        setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
      }
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This can't be undone.`)) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        router.refresh();
      }
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="card overflow-x-auto">
      <table className="w-full text-sm min-w-[720px]">
        <thead className="bg-mehndi-50 text-left text-xs uppercase tracking-wide text-brown-500">
          <tr>
            <th className="px-4 py-3">Product</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Stock</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-brown-100">
          {products.map((p) => (
            <tr key={p.id} className={cn(busyId === p.id && "opacity-50")}>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-mehndi-50">
                    <Image src={p.images[0]} alt="" fill sizes="40px" className="object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-ink truncate max-w-[220px]">{p.name}</p>
                    {p.variantLabel && <p className="text-xs text-brown-400">{p.variantLabel}</p>}
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-brown-500">{p.categorySlug}</td>
              <td className="px-4 py-3 font-medium">{formatINR(p.price)}</td>
              <td className="px-4 py-3">
                <input
                  type="number"
                  min={0}
                  defaultValue={p.stock}
                  onBlur={(e) => {
                    const val = Number(e.target.value);
                    if (!Number.isNaN(val) && val !== p.stock) handleStockChange(p.id, val);
                  }}
                  className="w-16 rounded-lg border border-brown-200 px-2 py-1 text-sm"
                  aria-label={`Stock for ${p.name}`}
                />
              </td>
              <td className="px-4 py-3">
                <button
                  onClick={() => handleToggleActive(p.id, !p.isActive)}
                  className={cn(
                    "rounded-full px-2.5 py-1 text-xs font-medium",
                    p.isActive ? "bg-mehndi-50 text-mehndi-700" : "bg-brown-100 text-brown-500"
                  )}
                >
                  {p.isActive ? "Active" : "Hidden"}
                </button>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/admin/products/${p.id}/edit`}
                    className="rounded-full p-2 text-brown-500 hover:bg-mehndi-50 hover:text-mehndi-700"
                    aria-label={`Edit ${p.name}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(p.id, p.name)}
                    className="rounded-full p-2 text-brown-500 hover:bg-red-50 hover:text-red-600"
                    aria-label={`Delete ${p.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {products.length === 0 && (
        <p className="p-6 text-center text-sm text-brown-400">No products yet.</p>
      )}
    </div>
  );
}
