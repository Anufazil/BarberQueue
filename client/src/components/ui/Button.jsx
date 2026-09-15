import { cn } from "@/utils/cn";

const variants = {
  primary:
    "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm hover:shadow-md",

  secondary:
    "border border-white/20 bg-white/10 text-white hover:bg-white/20",

  success:
    "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm hover:shadow-md",

  danger:
    "bg-red-600 text-white hover:bg-red-700 shadow-sm hover:shadow-md",

  outline:
    "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100",
};

const sizes = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-2",
  lg: "px-6 py-3 text-lg",
};

const Button = ({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  className,
  ...props
}) => {
  return (
    <button
      type={type}
      className={cn(
        "rounded-xl font-medium transition-all duration-200",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
        variants[variant] || variants.primary,
        sizes[size] || sizes.md,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;