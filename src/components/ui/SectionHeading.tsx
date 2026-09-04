interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: SectionHeadingProps) {
  return (
    <div className={align === "center" ? "text-center mx-auto max-w-2xl" : "text-left"}>
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h2 className="text-3xl sm:text-4xl font-medium text-mehndi-800 leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-brown-500 text-base sm:text-lg leading-relaxed">{subtitle}</p>
      )}
    </div>
  );
}
