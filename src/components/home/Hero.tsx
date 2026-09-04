import Link from "next/link";
import { waLink } from "@/lib/utils";

export default function Hero() {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919666355002";

  return (
    <section className="relative overflow-hidden bg-mehndi-800">
      {/* Signature paisley line-art motif, faint, in the hero background */}
      <svg
        className="absolute -right-24 -top-24 h-[420px] w-[420px] text-gold-400/10 sm:h-[560px] sm:w-[560px]"
        viewBox="0 0 200 200"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M100 10 C 140 10 170 40 170 80 C 170 105 155 118 135 118 C 118 118 108 105 112 90 C 115 78 128 74 135 82 C 140 88 134 96 128 92 M100 10 C 60 10 30 40 30 80 C 30 130 70 160 100 190 C 130 160 170 130 170 80"
          stroke="currentColor"
          strokeWidth="1.2"
        />
      </svg>
      <svg
        className="absolute -left-16 bottom-0 h-64 w-64 text-gold-400/10 sm:h-80 sm:w-80"
        viewBox="0 0 200 200"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M20 180 C 60 180 60 140 40 130 C 25 122 15 135 25 145 C 32 152 42 145 38 135 M20 180 C 20 120 60 90 100 90 C 150 90 180 60 180 20"
          stroke="currentColor"
          strokeWidth="1.2"
        />
      </svg>

      <div className="container-page relative py-20 sm:py-28 lg:py-36 text-center">
        <p className="eyebrow text-gold-300 animate-fadeUp">Hyderabad &middot; Est. Handcrafted</p>
        <h1 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl leading-tight text-ivory animate-fadeUp [animation-delay:100ms]">
          Premium Mehndi &amp; Beauty Essentials
        </h1>
        <p className="mt-5 text-lg sm:text-xl text-gold-200 font-display italic animate-fadeUp [animation-delay:200ms]">
          Tradition in Every Design, Beauty in Every Detail
        </p>
        <p className="mt-4 max-w-xl mx-auto text-ivory/70 leading-relaxed animate-fadeUp [animation-delay:300ms]">
          Discover handcrafted mehndi products, beauty essentials, stencils, skincare, and
          more &mdash; made with care in Hyderabad.
        </p>
        <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3 animate-fadeUp [animation-delay:400ms]">
          <Link href="/products" className="btn-gold w-full sm:w-auto">
            Shop Now
          </Link>
          <a
            href={waLink(whatsapp, "Hi Shehnaaz's Mehndi, I have a question about your products.")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn w-full sm:w-auto border border-ivory/30 text-ivory hover:bg-ivory/10"
          >
            Contact Us
          </a>
        </div>
      </div>
    </section>
  );
}
