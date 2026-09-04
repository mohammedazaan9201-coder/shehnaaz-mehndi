import Link from "next/link";
import { Instagram, MapPin, MessageCircle } from "lucide-react";
import { categories } from "@/lib/products-data";
import { waLink } from "@/lib/utils";

export default function Footer() {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919666355002";
  const instagram = process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE || "Shehnaaz_mehndi1";

  return (
    <footer className="bg-mehndi-800 text-ivory/90 mt-24">
      <div className="container-page py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <h3 className="font-display text-2xl text-ivory">Shehnaaz&rsquo;s Mehndi</h3>
          <p className="mt-3 text-sm text-ivory/70 leading-relaxed max-w-xs">
            Handcrafted mehndi, skincare and beauty essentials, made with tradition and
            care in Hyderabad.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <a
              href={`https://instagram.com/${instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-ivory/20 p-2 hover:bg-ivory/10 transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href={waLink(whatsapp, "Hi Shehnaaz's Mehndi, I'd like to know more about your products.")}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-ivory/20 p-2 hover:bg-ivory/10 transition-colors"
              aria-label="WhatsApp"
            >
              <MessageCircle className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-gold-300">Shop</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-ivory/70">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/category/${c.slug}`} className="hover:text-ivory transition-colors">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-gold-300">Support</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-ivory/70">
            <li>
              <Link href="/track-order" className="hover:text-ivory transition-colors">
                Track Your Order
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-ivory transition-colors">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/#faq" className="hover:text-ivory transition-colors">
                FAQs
              </Link>
            </li>
            <li>
              <Link href="/wishlist" className="hover:text-ivory transition-colors">
                Wishlist
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-gold-300">
            Get in Touch
          </h4>
          <ul className="mt-4 space-y-3 text-sm text-ivory/70">
            <li className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-gold-300" />
              <span>Hyderabad, India</span>
            </li>
            <li className="flex items-start gap-2">
              <MessageCircle className="h-4 w-4 mt-0.5 shrink-0 text-gold-300" />
              <a
                href={waLink(whatsapp, "Hi Shehnaaz's Mehndi!")}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-ivory transition-colors"
              >
                +91 96663 55002
              </a>
            </li>
            <li className="flex items-start gap-2">
              <Instagram className="h-4 w-4 mt-0.5 shrink-0 text-gold-300" />
              <a
                href={`https://instagram.com/${instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-ivory transition-colors"
              >
                @{instagram}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ivory/10">
        <div className="container-page py-5 text-xs text-ivory/50 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>&copy; {new Date().getFullYear()} Shehnaaz&rsquo;s Mehndi. All rights reserved.</p>
          <p>Hyderabad, India</p>
        </div>
      </div>
    </footer>
  );
}
