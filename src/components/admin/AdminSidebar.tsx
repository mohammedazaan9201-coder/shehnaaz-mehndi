"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, LogOut, Package, ShoppingCart, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="w-full sm:w-56 shrink-0 border-b sm:border-b-0 sm:border-r border-brown-100 bg-ivory-card">
      <div className="p-5">
        <p className="font-display text-lg text-mehndi-800">Shehnaaz&rsquo;s</p>
        <p className="text-[10px] uppercase tracking-widest text-gold-600">Admin Panel</p>
      </div>
      <nav className="flex sm:flex-col gap-1 px-3 pb-3 overflow-x-auto sm:overflow-visible">
        {links.map((link) => {
          const active = pathname?.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-colors",
                active ? "bg-mehndi-700 text-ivory" : "text-brown-600 hover:bg-mehndi-50"
              )}
            >
              <link.icon className="h-4 w-4 shrink-0" />
              {link.label}
            </Link>
          );
        })}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-brown-500 hover:bg-red-50 hover:text-red-600 transition-colors mt-0 sm:mt-4"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Log Out
        </button>
      </nav>
    </aside>
  );
}
