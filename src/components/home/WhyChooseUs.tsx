import { Clock, MapPin, ShieldCheck, Sparkles, Users } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

const points = [
  {
    icon: Sparkles,
    title: "Premium Quality Products",
    desc: "Hand-rolled henna cones and carefully formulated beauty essentials.",
  },
  {
    icon: Users,
    title: "Trusted by Customers",
    desc: "A growing community of customers who return for every festive season.",
  },
  {
    icon: Clock,
    title: "Fast Processing",
    desc: "Orders are processed quickly so your mehndi and beauty essentials reach you on time.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Ordering",
    desc: "A straightforward checkout with clear order tracking from placement to delivery.",
  },
  {
    icon: MapPin,
    title: "Hyderabad Based Business",
    desc: "Proudly rooted in Hyderabad, serving customers with a personal touch.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="container-page py-16 sm:py-20">
      <SectionHeading eyebrow="Why Shehnaaz's Mehndi" title="Why Choose Us" />
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {points.map((p) => (
          <div key={p.title} className="card p-6 flex flex-col items-start gap-3">
            <div className="rounded-full bg-mehndi-50 p-3">
              <p.icon className="h-5 w-5 text-mehndi-700" />
            </div>
            <h3 className="font-display text-base text-mehndi-800">{p.title}</h3>
            <p className="text-sm text-brown-500 leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
