import { cn } from "@/utils/cn";

const Badge = ({
  children,
  variant = "indigo",
  className,
}) => {
  const variants = {
    indigo:
      "bg-indigo-100 text-indigo-700",

    green:
      "bg-emerald-100 text-emerald-700",

    red:
      "bg-red-100 text-red-700",

    amber:
      "bg-amber-100 text-amber-700",

    slate:
      "bg-slate-100 text-slate-700",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-sm font-medium",
        variants[variant] || variants.indigo,
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;