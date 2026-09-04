import { cn } from "@/lib/utils";
import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";

interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  variant?: ButtonVariant;
  href?: string;
  size?: "sm" | "md" | "lg";
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-primary to-secondary text-white shadow-md shadow-primary/30 hover:shadow-xl hover:shadow-secondary/30 hover:scale-[1.03]",
  secondary:
    "bg-gradient-to-r from-secondary to-secondary/80 text-white shadow-md shadow-secondary/30 hover:shadow-xl hover:scale-[1.03]",
  outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white",
  ghost: "text-primary hover:bg-primary/10",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-2.5 text-sm",
  lg: "px-8 py-3 text-base",
};

export default function Button({
  variant = "primary",
  size = "md",
  href,
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center rounded-full font-sans font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:shadow-none",
    variants[variant],
    sizes[size],
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  );
}
