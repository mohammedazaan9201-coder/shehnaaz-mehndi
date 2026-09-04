"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Building2, MessageCircleQuestion, Truck } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatINR, waLink } from "@/lib/utils";
import type { DeliveryMethod, PaymentMethod } from "@/lib/types";

export default function CheckoutPage() {
  const { items, subtotal, clearCart, hydrated } = useCart();
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("HOME_DELIVERY");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("UPI");
  const [transactionId, setTransactionId] = useState("");
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const upiId = process.env.NEXT_PUBLIC_UPI_ID;
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919666355002";

  useEffect(() => {
    if (hydrated && items.length === 0 && !submitting) {
      router.replace("/cart");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, items.length]);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      setError("Screenshot must be under 3MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setScreenshot(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (deliveryMethod === "HOME_DELIVERY" && (!fullAddress || !city || !state || !pincode)) {
      setError("Please complete your delivery address.");
      return;
    }
    if (!fullName || !phone) {
      setError("Full name and phone number are required.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          phone,
          email: email || undefined,
          fullAddress: deliveryMethod === "HOME_DELIVERY" ? fullAddress : undefined,
          city: deliveryMethod === "HOME_DELIVERY" ? city : undefined,
          state: deliveryMethod === "HOME_DELIVERY" ? state : undefined,
          pincode: deliveryMethod === "HOME_DELIVERY" ? pincode : undefined,
          deliveryMethod,
          paymentMethod,
          transactionId: transactionId || undefined,
          paymentScreenshotUrl: screenshot || undefined,
          items: items.map((i) => ({
            productId: i.productId,
            name: i.name,
            variant: i.variant,
            price: i.price,
            quantity: i.quantity,
            image: i.image,
          })),
          subtotal,
          total: subtotal,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Could not place order.");
      }

      const order = await res.json();
      clearCart();
      router.push(`/order-confirmation/${order.orderNumber}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  if (!hydrated) {
    return <div className="container-page py-20 text-center text-brown-400">Loading your cart…</div>;
  }
  if (items.length === 0) return null;

  return (
    <div className="container-page py-10 sm:py-14">
      <h1 className="font-display text-3xl sm:text-4xl text-mehndi-800">Checkout</h1>

      <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <section className="card p-6">
            <h2 className="font-display text-lg text-mehndi-800 mb-4">Contact Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label-field" htmlFor="fullName">
                  Full Name *
                </label>
                <input
                  id="fullName"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="label-field" htmlFor="phone">
                  Phone Number *
                </label>
                <input
                  id="phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input-field"
                  placeholder="10-digit mobile number"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="label-field" htmlFor="email">
                  Email (optional)
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>
          </section>

          <section className="card p-6">
            <h2 className="font-display text-lg text-mehndi-800 mb-4">Delivery Method</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition-colors ${
                  deliveryMethod === "HOME_DELIVERY"
                    ? "border-mehndi-600 bg-mehndi-50"
                    : "border-brown-200"
                }`}
              >
                <input
                  type="radio"
                  name="deliveryMethod"
                  className="mt-1"
                  checked={deliveryMethod === "HOME_DELIVERY"}
                  onChange={() => setDeliveryMethod("HOME_DELIVERY")}
                />
                <div>
                  <p className="flex items-center gap-1.5 font-medium text-ink">
                    <Truck className="h-4 w-4" /> Home Delivery
                  </p>
                  <p className="text-xs text-brown-500 mt-0.5">Delivered to your address.</p>
                </div>
              </label>
              <label
                className={`flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition-colors ${
                  deliveryMethod === "STORE_PICKUP"
                    ? "border-mehndi-600 bg-mehndi-50"
                    : "border-brown-200"
                }`}
              >
                <input
                  type="radio"
                  name="deliveryMethod"
                  className="mt-1"
                  checked={deliveryMethod === "STORE_PICKUP"}
                  onChange={() => setDeliveryMethod("STORE_PICKUP")}
                />
                <div>
                  <p className="flex items-center gap-1.5 font-medium text-ink">
                    <Building2 className="h-4 w-4" /> Store Pickup
                  </p>
                  <p className="text-xs text-brown-500 mt-0.5">Collect in Hyderabad, we&rsquo;ll confirm when ready.</p>
                </div>
              </label>
            </div>

            {deliveryMethod === "HOME_DELIVERY" && (
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="label-field" htmlFor="fullAddress">
                    Full Address *
                  </label>
                  <textarea
                    id="fullAddress"
                    required
                    rows={2}
                    value={fullAddress}
                    onChange={(e) => setFullAddress(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label-field" htmlFor="city">
                    City *
                  </label>
                  <input
                    id="city"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label-field" htmlFor="state">
                    State *
                  </label>
                  <input
                    id="state"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label-field" htmlFor="pincode">
                    Pincode *
                  </label>
                  <input
                    id="pincode"
                    required
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>
            )}
          </section>

          <section className="card p-6">
            <h2 className="font-display text-lg text-mehndi-800 mb-4">Payment Method</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`flex items-center gap-3 rounded-xl border p-4 cursor-pointer transition-colors ${
                  paymentMethod === "UPI" ? "border-mehndi-600 bg-mehndi-50" : "border-brown-200"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "UPI"}
                  onChange={() => setPaymentMethod("UPI")}
                />
                <span className="font-medium">UPI</span>
              </label>
              <label
                className={`flex items-center gap-3 rounded-xl border p-4 cursor-pointer transition-colors ${
                  paymentMethod === "BANK_TRANSFER"
                    ? "border-mehndi-600 bg-mehndi-50"
                    : "border-brown-200"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "BANK_TRANSFER"}
                  onChange={() => setPaymentMethod("BANK_TRANSFER")}
                />
                <span className="font-medium">Bank Transfer</span>
              </label>
            </div>

            <div className="mt-4 rounded-xl bg-gold-50 border border-gold-200 p-4 text-sm text-brown-600">
              {paymentMethod === "UPI" ? (
                upiId ? (
                  <p>
                    Pay via UPI to <span className="font-semibold">{upiId}</span>, then enter your
                    transaction ID or upload a screenshot below.
                  </p>
                ) : (
                  <p className="flex items-start gap-2">
                    <MessageCircleQuestion className="h-4 w-4 mt-0.5 shrink-0" />
                    Our UPI ID isn&rsquo;t set up on the site yet — after placing your order,
                    message us on{" "}
                    <a
                      href={waLink(whatsapp, "Hi! I've just placed an order and would like the UPI payment details.")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline font-medium"
                    >
                      WhatsApp
                    </a>{" "}
                    for payment details.
                  </p>
                )
              ) : (
                <p className="flex items-start gap-2">
                  <MessageCircleQuestion className="h-4 w-4 mt-0.5 shrink-0" />
                  We&rsquo;ll share our bank transfer details after your order is placed — message
                  us on{" "}
                  <a
                    href={waLink(whatsapp, "Hi! I've just placed an order and would like the bank transfer details.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-medium"
                  >
                    WhatsApp
                  </a>{" "}
                  if you don&rsquo;t hear from us shortly.
                </p>
              )}
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label-field" htmlFor="transactionId">
                  Transaction ID (optional)
                </label>
                <input
                  id="transactionId"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="label-field" htmlFor="screenshot">
                  Payment Screenshot (optional)
                </label>
                <input
                  id="screenshot"
                  type="file"
                  accept="image/*"
                  onChange={handleFile}
                  className="input-field file:mr-3 file:rounded-full file:border-0 file:bg-mehndi-100 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-mehndi-800"
                />
                {screenshot && <p className="mt-1 text-xs text-mehndi-700">Screenshot attached ✓</p>}
              </div>
            </div>
          </section>
        </div>

        <div className="card p-6 h-fit lg:sticky lg:top-24">
          <h2 className="font-display text-lg text-mehndi-800 mb-4">Order Summary</h2>
          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={`${item.productId}-${item.variant ?? ""}`} className="flex justify-between text-sm">
                <span className="text-brown-600 pr-2">
                  {item.name} <span className="text-brown-400">&times;{item.quantity}</span>
                </span>
                <span className="font-medium shrink-0">{formatINR(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t border-brown-100 pt-4 flex justify-between font-semibold text-mehndi-800">
            <span>Total</span>
            <span>{formatINR(subtotal)}</span>
          </div>

          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

          <button type="submit" disabled={submitting} className="btn-primary w-full mt-5">
            {submitting ? "Placing Order…" : "Place Order"}
          </button>
          <p className="mt-3 text-xs text-brown-400 text-center">
            By placing your order you agree to be contacted about delivery and payment
            confirmation.
          </p>
        </div>
      </form>
    </div>
  );
}
