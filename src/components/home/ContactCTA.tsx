import Link from "next/link";
import { MessageCircle } from "lucide-react";
import PatternDivider from "@/components/ui/PatternDivider";
import { waLink } from "@/lib/utils";

export default function ContactCTA() {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919666355002";

  return (
    <section className="bg-brown-700 py-16 sm:py-20">
      <div className="container-page text-center">
        <PatternDivider className="mb-8 max-w-xs mx-auto" />
        <h2 className="font-display text-3xl sm:text-4xl text-ivory">
          Have a Question, or Ready to Order?
        </h2>
        <p className="mt-4 max-w-lg mx-auto text-ivory/70">
          Browse the full collection or message us directly on WhatsApp — we're happy to help
          you find the right products.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/products" className="btn-gold w-full sm:w-auto">
            Shop Now
          </Link>
          <a
            href={waLink(whatsapp, "Hi Shehnaaz's Mehndi, I'd like to place an order.")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn w-full sm:w-auto border border-ivory/30 text-ivory hover:bg-ivory/10"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp Us
          </a>
        </div>
      </div>
    </section>
  );
}
