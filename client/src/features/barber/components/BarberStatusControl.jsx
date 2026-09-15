import {
  CheckCircle2,
  CircleOff,
  Coffee,
  Scissors,
} from "lucide-react";

import { useUpdateMyStatus } from "../hooks/useUpdateMyStatus";

const statuses = [
  {
    value: "AVAILABLE",
    label: "Available",
    description: "Ready for customers",
    icon: CheckCircle2,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
  {
    value: "BUSY",
    label: "Busy",
    description: "Currently serving",
    icon: Scissors,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
  },
  {
    value: "BREAK",
    label: "On Break",
    description: "Temporarily unavailable",
    icon: Coffee,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  {
    value: "OFFLINE",
    label: "Offline",
    description: "Not accepting customers",
    icon: CircleOff,
    color: "text-slate-500",
    bg: "bg-slate-100",
    border: "border-slate-200",
  },
];

const BarberStatusControl = ({ barber }) => {
  const { mutate, isPending } = useUpdateMyStatus();

  const currentStatus =
    statuses.find((status) => status.value === barber.status) ||
    statuses[0];

  const CurrentIcon = currentStatus.icon;

  const handleChange = (event) => {
    const status = event.target.value;

    mutate({
      barberId: barber._id,
      status,
    });
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="p-5 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          {/* Current Status */}
          <div className="flex items-center gap-4">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${currentStatus.bg} ${currentStatus.color}`}
            >
              <CurrentIcon size={23} strokeWidth={2} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Your Current Status
              </p>

              <div className="mt-1 flex items-center gap-2">
                <span className="text-lg font-bold text-slate-900">
                  {currentStatus.label}
                </span>

                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    barber.status === "AVAILABLE"
                      ? "bg-emerald-500"
                      : barber.status === "BUSY"
                        ? "bg-indigo-500"
                        : barber.status === "BREAK"
                          ? "bg-amber-500"
                          : "bg-slate-400"
                  }`}
                />
              </div>

              <p className="mt-0.5 text-sm text-slate-500">
                {currentStatus.description}
              </p>
            </div>
          </div>

          {/* Status Selector */}
          <div className="w-full lg:w-auto">
            <label
              htmlFor="barber-status"
              className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-400"
            >
              Change Status
            </label>

            <select
              id="barber-status"
              value={barber.status}
              onChange={handleChange}
              disabled={isPending}
              className={`w-full min-w-[190px] rounded-xl border bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto ${currentStatus.border}`}
            >
              {statuses.map((status) => (
                <option
                  key={status.value}
                  value={status.value}
                >
                  {status.label}
                </option>
              ))}
            </select>

            {isPending && (
              <p className="mt-2 text-right text-xs font-medium text-indigo-600">
                Updating status...
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Status Indicator */}
      <div
        className={`border-t px-5 py-2.5 sm:px-6 ${currentStatus.bg} ${currentStatus.border}`}
      >
        <p className={`text-xs font-medium ${currentStatus.color}`}>
          {currentStatus.label} — queue availability is updated automatically.
        </p>
      </div>
    </div>
  );
};

export default BarberStatusControl;