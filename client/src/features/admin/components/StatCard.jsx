import Card from "@/components/ui/Card";

const StatCard = ({
  title,
  value,
  icon: Icon,
  color = "text-indigo-600",
}) => {
  return (
    <Card className="group relative overflow-hidden border-slate-200/80 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-6">
      {/* Decorative background */}
      <div
        className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-current opacity-[0.04] ${color}`}
      />

      <div className="relative flex items-center justify-between gap-4">
        {/* Content */}
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {value}
          </h2>
        </div>

        {/* Icon */}
        {Icon && (
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-50 ${color}`}
          >
            <Icon size={24} strokeWidth={2} />
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatCard;