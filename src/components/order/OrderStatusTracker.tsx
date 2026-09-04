import { Check } from "lucide-react";
import { OrderStatus, ORDER_STATUS_LABELS } from "@/lib/types";

const FLOW: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
];

const PICKUP_FLOW: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "READY_FOR_PICKUP",
  "DELIVERED",
];

export default function OrderStatusTracker({
  status,
  isPickup,
}: {
  status: OrderStatus;
  isPickup: boolean;
}) {
  if (status === "CANCELLED") {
    return (
      <div className="rounded-xl bg-red-50 border border-red-100 p-4 text-center text-red-600 font-medium">
        This order was cancelled.
      </div>
    );
  }

  const flow = isPickup ? PICKUP_FLOW : FLOW;
  const currentIndex = flow.indexOf(status);

  return (
    <div className="flex items-start justify-between overflow-x-auto pb-2">
      {flow.map((step, i) => {
        const done = i <= currentIndex;
        return (
          <div key={step} className="flex flex-1 flex-col items-center min-w-[70px]">
            <div className="flex w-full items-center">
              <div className={`h-0.5 flex-1 ${i === 0 ? "invisible" : done ? "bg-mehndi-600" : "bg-brown-100"}`} />
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold ${
                  done
                    ? "border-mehndi-600 bg-mehndi-600 text-ivory"
                    : "border-brown-200 text-brown-300"
                }`}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </div>
              <div
                className={`h-0.5 flex-1 ${
                  i === flow.length - 1 ? "invisible" : i < currentIndex ? "bg-mehndi-600" : "bg-brown-100"
                }`}
              />
            </div>
            <p
              className={`mt-2 text-center text-[11px] sm:text-xs ${
                done ? "text-mehndi-700 font-medium" : "text-brown-400"
              }`}
            >
              {ORDER_STATUS_LABELS[step]}
            </p>
          </div>
        );
      })}
    </div>
  );
}
