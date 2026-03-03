import Link from "next/link";

interface ButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "gold" | "ghost" | "purple" | "ghost-light";
  size?: "lg" | "md";
  className?: string;
}

export default function Button({
  href,
  children,
  variant = "gold",
  size = "lg",
  className = "",
}: ButtonProps) {
  const base =
    "inline-block font-semibold tracking-wide text-center transition-all duration-300 rounded-xl";

  const sizes = {
    lg: "px-10 py-4 text-base md:text-lg",
    md: "px-8 py-3 text-sm md:text-base",
  };

  const variants = {
    gold: "bg-gradient-to-r from-gold via-gold-light to-gold text-void btn-shimmer hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(201,162,62,0.3)]",
    ghost:
      "border border-gold/40 text-gold hover:bg-gold/10 hover:border-gold",
    purple:
      "bg-gradient-to-r from-[#7c5cbf] via-[#9b7fd4] to-[#7c5cbf] text-white btn-shimmer hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(124,92,191,0.3)]",
    "ghost-light":
      "border border-[#7c5cbf]/40 text-[#7c5cbf] hover:bg-[#7c5cbf]/10 hover:border-[#7c5cbf]",
  };

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
