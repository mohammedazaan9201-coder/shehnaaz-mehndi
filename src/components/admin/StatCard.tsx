import { LucideIcon } from "lucide-react";

export default function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
}) {
  return (
    <div className="card p-5 flex items-center gap-4">
      <span className="rounded-full bg-mehndi-50 p-3">
        <Icon className="h-5 w-5 text-mehndi-700" />
      </span>
      <div>
        <p className="text-xs text-brown-400">{label}</p>
        <p className="text-xl font-semibold text-mehndi-800">{value}</p>
      </div>
    </div>
  );
}
