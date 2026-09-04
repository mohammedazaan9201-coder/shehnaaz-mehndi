import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Copy } from "lucide-react";
import { getOrderByNumber } from "@/lib/db";
import { formatINR } from "@/lib/utils";
import { ORDER_STATUS_LABELS } from "@/lib/types";

export default function OrderConfirmationPage({
  params,
}: {
  params: { orderNumber: string };
}) {
  const order = getOrderByNumber(params.orderNumber);
  if (!order) notFound();

  return (
    <div className="container-page py-14 sm:py-20 max-w-2xl mx-auto text-center">
      <CheckCircle2 className="mx-auto h-14 w-14 text-mehndi-600" />
      <h1 className="mt-5 font-display text-3xl sm:text-4xl text-mehndi-800">
        Thank you, {order.fullName.split(" ")[0]}!
      </h1>
      <p className="mt-2 text-brown-500">
        Your order has been placed and is currently{" "}
        <span className="font-semibold text-mehndi-700">
          {ORDER_STATUS_LABELS[order.status]}
        </span>
        .
      </p>

      <div className="mt-8 card p-6 text-left">
        <div className="flex items-center justify-between">
          <p className="text-sm text-brown-500">Order Number</p>
          <p className="font-mono font-semibold text-mehndi-800">{order.orderNumber}</p>
        </div>
        <div className="mt-4 divide-y divide-brown-100">
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
        <div className="mt-4 text-sm text-brown-500 space-y-1">
          <p>
            <span className="text-brown-400">Delivery: </span>
            {order.deliveryMethod === "HOME_DELIVERY" ? "Home Delivery" : "Store Pickup"}
          </p>
          <p>
            <span className="text-brown-400">Payment: </span>
            {order.paymentMethod === "UPI" ? "UPI" : "Bank Transfer"}
          </p>
        </div>
      </div>

      <p className="mt-6 text-sm text-brown-500 flex items-center justify-center gap-1.5">
        <Copy className="h-3.5 w-3.5" />
        Save your order number and phone number to track your order.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link href={`/track-order?orderNumber=${order.orderNumber}`} className="btn-primary w-full sm:w-auto">
          Track This Order
        </Link>
        <Link href="/products" className="btn-secondary w-full sm:w-auto">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
