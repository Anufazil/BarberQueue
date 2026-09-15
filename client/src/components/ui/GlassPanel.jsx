import { cn } from "@/utils/cn";

const GlassPanel = ({ children, className }) => {
  return (
    <div
      className={cn(
        "rounded-2xl",
        "border border-white/20",
        "bg-white/10",
        "backdrop-blur-xl",
        "shadow-xl",
        className
      )}
    >
      {children}
    </div>
  );
};

export default GlassPanel;