import { cn } from "@/lib/utils";

export type BadgeVariant = "purple" | "teal" | "amber" | "red" | "gray";

const variants: Record<BadgeVariant, string> = {
  purple: "bg-brand-50 text-brand-600",
  teal: "bg-emerald-50 text-emerald-700",
  amber: "bg-amber-50 text-amber-700",
  red: "bg-red-50 text-red-700",
  gray: "bg-gray-100 text-gray-600",
};

export function Badge({
  children,
  variant = "gray",
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
}) {
  return (
    <span
      className={cn(
        "inline-block text-xs px-2 py-0.5 rounded-full font-medium",
        variants[variant]
      )}
    >
      {children}
    </span>
  );
}
