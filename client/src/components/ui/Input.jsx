import { forwardRef, useId } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(
  (
    {
      label,
      error,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    id = id || generatedId;
    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-slate-700"
          >
            {label}
          </label>
        )}

        <input
          ref={ref}
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(
            "w-full rounded-xl border border-slate-300 bg-white px-4 py-3",
            "text-slate-900 placeholder:text-slate-400",
            "outline-none transition-all duration-200",
            "focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200",
            error &&
              "border-red-500 focus:border-red-500 focus:ring-red-200",
            className
          )}
          {...props}
        />

        {error && (
          <p
            id={`${id}-error`}
            className="text-sm text-red-500"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;