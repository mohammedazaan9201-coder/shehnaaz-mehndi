import Link from "next/link";
import { DollarSign, Package, ShoppingCart, Star, Users } from "lucide-react";
import { getAllOrders, getAllProducts, getAllReviews } from "@/lib/db";
import { formatINR } from "@/lib/utils";
import StatCard from "@/components/admin/StatCard";
import { ORDER_STATUS_LABELS } from "@/lib/types";

export default function AdminDashboardPage() {
  const orders = getAllOrders();
  const products = getAllProducts();
  const reviews = getAllReviews();

  const revenue = orders
    .filter((o) => o.status !== "CANCELLED")
    .reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter((o) => o.status === "PENDING").length;
  const uniqueCustomers = new Set(orders.map((o) => o.phone)).size;
  const pendingReviews = reviews.filter((r) => !r.isApproved).length;
  const lowStock = products.filter((p) => p.isActive && p.stock > 0 && p.stock <= 5).length;
  const outOfStock = products.filter((p) => p.isActive && p.stock <= 0).length;

  const recentOrders = orders.slice(0, 6);

  return (
    <div>
      <h1 className="font-display text-2xl sm:text-3xl text-mehndi-800">Dashboard</h1>
      <p className="mt-1 text-sm text-brown-400">An overview of your store.</p>

      <div className="mt-6 grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="Total Orders" value={orders.length} icon={ShoppingCart} />
        <StatCard label="Revenue" value={formatINR(revenue)} icon={DollarSign} />
        <StatCard label="Pending Orders" value={pendingOrders} icon={ShoppingCart} />
        <StatCard label="Products" value={products.length} icon={Package} />
        <StatCard label="Customers" value={uniqueCustomers} icon={Users} />
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-5">
          <p className="text-xs text-brown-400">Pending Reviews</p>
          <p className="mt-1 text-lg font-semibold text-mehndi-800">{pendingReviews}</p>
          <Link href="/admin/reviews" className="mt-2 inline-block text-xs font-semibold text-gold-600">
            Moderate reviews →
          </Link>
        </div>
        <div className="card p-5">
          <p className="text-xs text-brown-400">Low Stock (&le;5)</p>
          <p className="mt-1 text-lg font-semibold text-gold-700">{lowStock}</p>
          <Link href="/admin/products" className="mt-2 inline-block text-xs font-semibold text-gold-600">
            Manage stock →
          </Link>
        </div>
        <div className="card p-5">
          <p className="text-xs text-brown-400">Out of Stock</p>
          <p className="mt-1 text-lg font-semibold text-red-600">{outOfStock}</p>
          <Link href="/admin/products" className="mt-2 inline-block text-xs font-semibold text-gold-600">
            Restock now →
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg text-mehndi-800">Recent Orders</h2>
          <Link href="/admin/orders" className="text-xs font-semibold text-gold-600">
            View all →
          </Link>
        </div>
        <div className="mt-4 card overflow-hidden">
          {recentOrders.length === 0 ? (
            <p className="p-6 text-center text-sm text-brown-400">No orders yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-mehndi-50 text-left text-xs uppercase tracking-wide text-brown-500">
                <tr>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3 hidden sm:table-cell">Customer</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brown-100">
                {recentOrders.map((o) => (
                  <tr key={o.id}>
                    <td className="px-4 py-3">
                      <Link href={`/admin/orders/${o.id}`} className="font-mono text-mehndi-700 hover:underline">
                        {o.orderNumber}
                      </Link>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">{o.fullName}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-mehndi-50 px-2.5 py-1 text-xs font-medium text-mehndi-700">
                        {ORDER_STATUS_LABELS[o.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium">{formatINR(o.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
