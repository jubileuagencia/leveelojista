import Link from "next/link";

interface CostarButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  size?: "lg" | "md";
  className?: string;
}

export default function CostarButton({
  href,
  children,
  variant = "primary",
  size = "lg",
  className = "",
}: CostarButtonProps) {
  const base =
    "inline-block font-mono text-center tracking-[2px] uppercase transition-all duration-300";

  const sizes = {
    lg: "px-12 py-4 text-xs md:text-sm",
    md: "px-8 py-3 text-xs",
  };

  const variants = {
    primary:
      "bg-white text-black hover:bg-gray-200 active:bg-gray-300",
    ghost:
      "border border-white/40 text-white hover:bg-white/5 hover:border-white/80",
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
