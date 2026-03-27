import { cn, getInitials } from "@/lib/utils";

const colors = [
  "bg-brand-50 text-brand-600",
  "bg-emerald-50 text-emerald-700",
  "bg-rose-50 text-rose-700",
  "bg-blue-50 text-blue-700",
];

export function Avatar({
  name,
  size = "md",
}: {
  name: string;
  size?: "sm" | "md" | "lg";
}) {
  const colorIdx = name.charCodeAt(0) % colors.length;
  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-medium flex-shrink-0",
        colors[colorIdx],
        {
          "w-8 h-8 text-xs": size === "sm",
          "w-11 h-11 text-sm": size === "md",
          "w-16 h-16 text-lg": size === "lg",
        }
      )}
    >
      {getInitials(name)}
    </div>
  );
}
