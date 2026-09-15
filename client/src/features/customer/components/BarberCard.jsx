import {
  Scissors,
  Clock3,
  Users,
  Star,
  ArrowRight,
} from "lucide-react";

import Card from "@/components/ui/Card";
import JoinQueueModal from "./JoinQueueModal";

const statusConfig = {
  AVAILABLE: {
    label: "Available",
    className: "bg-emerald-100 text-emerald-700",
    dot: "bg-emerald-500",
  },
  BUSY: {
    label: "Busy",
    className: "bg-orange-100 text-orange-700",
    dot: "bg-orange-500",
  },
  BREAK: {
    label: "On Break",
    className: "bg-yellow-100 text-yellow-700",
    dot: "bg-yellow-500",
  },
  OFFLINE: {
    label: "Offline",
    className: "bg-red-100 text-red-700",
    dot: "bg-red-500",
  },
};

const BarberCard = ({ barber }) => {
  const status = statusConfig[barber.status] || {
    label: barber.status || "Unknown",
    className: "bg-slate-100 text-slate-600",
    dot: "bg-slate-400",
  };

  const canJoinQueue =
    barber.status === "AVAILABLE" || barber.status === "BUSY";

  const metrics = [
    {
      label: "Chair",
      value: `#${barber.chairNumber}`,
      icon: Scissors,
    },
    {
      label: "Experience",
      value: `${barber.experience ?? 0} yrs`,
      icon: Star,
    },
    {
      label: "Queue",
      value: `${barber.queueLength ?? 0} people`,
      icon: Users,
    },
    {
      label: "Est. Wait",
      value: `${barber.estimatedWait ?? 0} min`,
      icon: Clock3,
    },
  ];

  return (
    <Card className="group flex h-full flex-col overflow-hidden p-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-br from-indigo-50 via-white to-emerald-50 p-6">
        <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-indigo-200/30 blur-2xl transition-transform duration-500 group-hover:scale-125" />

        <div className="relative flex items-start justify-between gap-4">
          {/* Avatar */}
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-xl font-bold text-indigo-600 shadow-sm ring-4 ring-white">
            {barber.displayName?.charAt(0)?.toUpperCase() || "B"}
          </div>

          {/* Status */}
          <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${status.className}`}
          >
            <span
              className={`h-2 w-2 rounded-full ${status.dot}`}
            />
            {status.label}
          </span>
        </div>

        {/* Barber Info */}
        <div className="relative mt-5">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            {barber.displayName}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {barber.specialization || "Professional Barber"}
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {/* Metrics */}
        <div className="grid grid-cols-2 gap-3">
          {metrics.map((metric) => {
            const Icon = metric.icon;

            return (
              <div
                key={metric.label}
                className="rounded-xl border border-slate-100 bg-slate-50/80 p-3.5 transition-colors duration-200 group-hover:bg-slate-50"
              >
                <div className="flex items-center gap-2 text-slate-500">
                  <Icon className="h-4 w-4 text-indigo-600" />

                  <span className="text-xs font-medium">
                    {metric.label}
                  </span>
                </div>

                <p className="mt-2 truncate text-sm font-bold text-slate-900">
                  {metric.value}
                </p>
              </div>
            );
          })}
        </div>

        {/* Queue indicator */}
        <div className="mt-5 rounded-xl border border-slate-100 bg-white p-3.5">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-medium text-slate-500">
              Queue status
            </span>

            <span className="text-xs font-semibold text-slate-700">
              {barber.queueLength ?? 0} waiting
            </span>
          </div>

          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-indigo-500 transition-all duration-500"
              style={{
                width: `${Math.min(
                  Math.max((barber.queueLength ?? 0) * 10, 5),
                  100
                )}%`,
              }}
            />
          </div>
        </div>

        {/* Action */}
        <div className="mt-5">
          {canJoinQueue ? (
            <div className="relative">
              <JoinQueueModal barber={barber} />
            </div>
          ) : (
            <button
              type="button"
              disabled
              className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-400"
            >
              Currently Unavailable
            </button>
          )}

          {canJoinQueue && (
            <p className="mt-2 flex items-center justify-center gap-1 text-center text-xs text-slate-400">
              Join the queue and track your position
              <ArrowRight className="h-3 w-3" />
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default BarberCard;