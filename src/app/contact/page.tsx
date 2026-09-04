import type { Metadata } from "next";
import { Instagram, MapPin, MessageCircle } from "lucide-react";
import { waLink } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Shehnaaz's Mehndi via WhatsApp or Instagram.",
};

export default function ContactPage() {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919666355002";
  const instagram = process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE || "Shehnaaz_mehndi1";

  return (
    <div className="container-page py-14 sm:py-20 max-w-xl mx-auto text-center">
      <p className="eyebrow">Get in Touch</p>
      <h1 className="mt-1 font-display text-3xl sm:text-4xl text-mehndi-800">
        Shehnaaz&rsquo;s Mehndi
      </h1>
      <p className="mt-4 text-brown-500 leading-relaxed">
        Have a question about an order or a product? Reach out to us directly — we&rsquo;re
        based in Hyderabad and happy to help.
      </p>

      <div className="mt-10 space-y-4">
        <a
          href={waLink(whatsapp, "Hi Shehnaaz's Mehndi, I have a question.")}
          target="_blank"
          rel="noopener noreferrer"
          className="card flex items-center gap-4 p-5 text-left hover:shadow-lift transition-shadow"
        >
          <span className="rounded-full bg-mehndi-50 p-3">
            <MessageCircle className="h-5 w-5 text-mehndi-700" />
          </span>
          <span>
            <span className="block text-sm text-brown-400">WhatsApp</span>
            <span className="block font-medium text-ink">+91 96663 55002</span>
          </span>
        </a>

        <a
          href={`https://instagram.com/${instagram}`}
          target="_blank"
          rel="noopener noreferrer"
          className="card flex items-center gap-4 p-5 text-left hover:shadow-lift transition-shadow"
        >
          <span className="rounded-full bg-mehndi-50 p-3">
            <Instagram className="h-5 w-5 text-mehndi-700" />
          </span>
          <span>
            <span className="block text-sm text-brown-400">Instagram</span>
            <span className="block font-medium text-ink">@{instagram}</span>
          </span>
        </a>

        <div className="card flex items-center gap-4 p-5 text-left">
          <span className="rounded-full bg-mehndi-50 p-3">
            <MapPin className="h-5 w-5 text-mehndi-700" />
          </span>
          <span>
            <span className="block text-sm text-brown-400">Location</span>
            <span className="block font-medium text-ink">Hyderabad, India</span>
          </span>
        </div>
      </div>

      <p className="mt-8 text-xs text-brown-400">
        For your privacy and ours, we don&rsquo;t publish our exact residential address online —
        message us on WhatsApp for pickup coordination.
      </p>
    </div>
  );
}
