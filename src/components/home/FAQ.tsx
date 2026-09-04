"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

const faqs = [
  {
    q: "How long does natural henna take to darken?",
    a: "Natural henna typically deepens in colour over 24–48 hours after application. Keep the paste on as long as comfortable and avoid water for the first few hours for the best stain.",
  },
  {
    q: "What delivery options do you offer?",
    a: "You can choose Home Delivery or Store Pickup in Hyderabad at checkout. Your order confirmation will show the expected next steps for whichever option you pick.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We currently accept UPI and Bank Transfer. After placing your order, you can upload a payment screenshot or enter your transaction ID so we can confirm it quickly.",
  },
  {
    q: "How can I track my order?",
    a: "Use the Track Order page with your order number and the phone number used at checkout to see live status updates, from Pending through to Delivered.",
  },
  {
    q: "Can I pick up my order in person?",
    a: "Yes — select Store Pickup at checkout and we'll let you know once your order is ready for collection in Hyderabad.",
  },
  {
    q: "Do you offer bridal mehndi stencils and cones?",
    a: "Yes, we carry Bridal Full Hands and Semi Bridal stencils, plus a dedicated Bridal Hand Cone for fine detailing.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="container-page py-16 sm:py-20 scroll-mt-20">
      <SectionHeading eyebrow="Questions" title="Frequently Asked Questions" />
      <div className="mt-10 max-w-2xl mx-auto divide-y divide-brown-100 rounded-xl2 border border-brown-100 bg-ivory-card">
        {faqs.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={item.q}>
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                aria-expanded={isOpen}
              >
                <span className="font-medium text-ink">{item.q}</span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-mehndi-700 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isOpen && (
                <p className="px-5 pb-4 text-sm text-brown-500 leading-relaxed">{item.a}</p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
