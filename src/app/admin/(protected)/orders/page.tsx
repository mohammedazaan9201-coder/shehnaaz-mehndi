import Link from "next/link";
import { getAllOrders } from "@/lib/db";
import { formatINR, cn } from "@/lib/utils";
import { ORDER_STATUS_LABELS, ORDER_STATUSES, OrderStatus } from "@/lib/types";

export default function AdminOrdersPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const allOrders = getAllOrders();
  const status = searchParams.status as OrderStatus | undefined;
  const orders = status ? allOrders.filter((o) => o.status === status) : allOrders;

  return (
    <div>
      <h1 className="font-display text-2xl sm:text-3xl text-mehndi-800">Orders</h1>
      <p className="mt-1 text-sm text-brown-400">{allOrders.length} orders total</p>

      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          href="/admin/orders"
          className={cn(
            "rounded-full px-3.5 py-1.5 text-xs font-medium border",
            !status ? "bg-mehndi-700 text-ivory border-mehndi-700" : "border-brown-200 text-brown-600"
          )}
        >
          All
        </Link>
        {ORDER_STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin/orders?status=${s}`}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-xs font-medium border",
              status === s ? "bg-mehndi-700 text-ivory border-mehndi-700" : "border-brown-200 text-brown-600"
            )}
          >
            {ORDER_STATUS_LABELS[s]}
          </Link>
        ))}
      </div>

      <div className="mt-6 card overflow-x-auto">
        <table className="w-full text-sm min-w-[720px]">
          <thead className="bg-mehndi-50 text-left text-xs uppercase tracking-wide text-brown-500">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Delivery</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Total</th>
              <th className="px-4 py-3 text-right">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brown-100">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-mehndi-50/40">
                <td className="px-4 py-3">
                  <Link href={`/admin/orders/${o.id}`} className="font-mono text-mehndi-700 hover:underline">
                    {o.orderNumber}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-ink">{o.fullName}</p>
                  <p className="text-xs text-brown-400">{o.phone}</p>
                </td>
                <td className="px-4 py-3 text-brown-500">
                  {o.deliveryMethod === "HOME_DELIVERY" ? "Home Delivery" : "Store Pickup"}
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-mehndi-50 px-2.5 py-1 text-xs font-medium text-mehndi-700">
                    {ORDER_STATUS_LABELS[o.status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-medium">{formatINR(o.total)}</td>
                <td className="px-4 py-3 text-right text-xs text-brown-400">
                  {new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <p className="p-6 text-center text-sm text-brown-400">No orders found.</p>
        )}
      </div>
    </div>
  );
}
