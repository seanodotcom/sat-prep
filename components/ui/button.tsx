import Link from "next/link";
import type { Route } from "next";
import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  href?: Route;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  onClick?: () => void;
} & Pick<ButtonHTMLAttributes<HTMLButtonElement>, "type">;

const variants = {
  primary: "ui-button-primary",
  secondary: "ui-button-secondary",
  ghost: "ui-button-ghost"
};

export function Button({
  children,
  href,
  variant = "primary",
  className,
  onClick,
  type = "button"
}: ButtonProps) {
  const classes = cn(
    "ui-button inline-flex min-h-11 items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition",
    variants[variant],
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        <span>{children}</span>
      </Link>
    );
  }

  return (
    <button className={classes} onClick={onClick} type={type}>
      <span>{children}</span>
    </button>
  );
}
