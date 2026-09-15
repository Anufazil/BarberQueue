import { Scissors } from "lucide-react";

const Logo = () => {
  return (
    <div className="flex items-center gap-3">
      {/* Logo Icon */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-200">
        <Scissors size={21} strokeWidth={2.5} />
      </div>

      {/* Brand */}
      <div className="min-w-0">
        <h1 className="text-lg font-bold tracking-tight text-slate-900">
          BarberQueue
        </h1>

        <p className="text-xs font-medium text-slate-500">
          Queue Management
        </p>
      </div>
    </div>
  );
};

export default Logo;