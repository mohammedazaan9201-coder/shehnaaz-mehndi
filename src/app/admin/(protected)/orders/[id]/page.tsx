import { notFound } from "next/navigation";
import Image from "next/image";
import { getOrderById } from "@/lib/db";
import { formatINR } from "@/lib/utils";
import { ORDER_STATUS_LABELS } from "@/lib/types";
import OrderStatusForm from "@/components/admin/OrderStatusForm";

export default function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const order = getOrderById(params.id);
  if (!order) notFound();

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <p className="eyebrow">Order</p>
          <h1 className="font-display text-2xl sm:text-3xl text-mehndi-800 font-mono">
            {order.orderNumber}
          </h1>
        </div>
        <span className="rounded-full bg-mehndi-50 px-3 py-1.5 text-sm font-medium text-mehndi-700">
          {ORDER_STATUS_LABELS[order.status]}
        </span>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-5">
            <h2 className="font-display text-lg text-mehndi-800 mb-3">Customer Details</h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-brown-400">Name</dt>
                <dd className="font-medium">{order.fullName}</dd>
              </div>
              <div>
                <dt className="text-brown-400">Phone</dt>
                <dd className="font-medium">{order.phone}</dd>
              </div>
              {order.email && (
                <div>
                  <dt className="text-brown-400">Email</dt>
                  <dd className="font-medium">{order.email}</dd>
                </div>
              )}
              <div>
                <dt className="text-brown-400">Delivery Method</dt>
                <dd className="font-medium">
                  {order.deliveryMethod === "HOME_DELIVERY" ? "Home Delivery" : "Store Pickup"}
                </dd>
              </div>
              {order.deliveryMethod === "HOME_DELIVERY" && (
                <div className="sm:col-span-2">
                  <dt className="text-brown-400">Address</dt>
                  <dd className="font-medium">
                    {order.fullAddress}, {order.city}, {order.state} - {order.pincode}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          <div className="card p-5">
            <h2 className="font-display text-lg text-mehndi-800 mb-3">Items</h2>
            <div className="divide-y divide-brown-100">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between py-2.5 text-sm">
                  <span className="text-brown-600">
                    {item.name}
                    {item.variant ? ` — ${item.variant}` : ""}{" "}
                    <span className="text-brown-400">&times;{item.quantity}</span>
                  </span>
                  <span className="font-medium">{formatINR(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-brown-100 flex justify-between font-semibold text-mehndi-800">
              <span>Total</span>
              <span>{formatINR(order.total)}</span>
            </div>
          </div>

          <div className="card p-5">
            <h2 className="font-display text-lg text-mehndi-800 mb-3">Payment</h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-brown-400">Method</dt>
                <dd className="font-medium">{order.paymentMethod === "UPI" ? "UPI" : "Bank Transfer"}</dd>
              </div>
              {order.transactionId && (
                <div>
                  <dt className="text-brown-400">Transaction ID</dt>
                  <dd className="font-medium">{order.transactionId}</dd>
                </div>
              )}
            </dl>
            {order.paymentScreenshotUrl && (
              <div className="mt-4">
                <p className="text-xs text-brown-400 mb-2">Payment Screenshot</p>
                <div className="relative h-56 w-full max-w-xs overflow-hidden rounded-xl border border-brown-100">
                  <Image
                    src={order.paymentScreenshotUrl}
                    alt="Payment screenshot"
                    fill
                    sizes="320px"
                    className="object-contain bg-ivory"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="card p-5">
            <h2 className="font-display text-lg text-mehndi-800 mb-3">Status History</h2>
            <ul className="space-y-2 text-sm">
              {order.statusHistory
                .slice()
                .reverse()
                .map((h, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-mehndi-600 shrink-0" />
                    <span>
                      <span className="font-medium text-ink">{ORDER_STATUS_LABELS[h.status]}</span>
                      {h.note && <span className="text-brown-500"> — {h.note}</span>}
                      <span className="block text-xs text-brown-400">
                        {new Date(h.createdAt).toLocaleString("en-IN")}
                      </span>
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        </div>

        <div className="card p-5 h-fit lg:sticky lg:top-24">
          <h2 className="font-display text-lg text-mehndi-800 mb-3">Update Status</h2>
          <OrderStatusForm order={order} />
        </div>
      </div>
    </div>
  );
}
