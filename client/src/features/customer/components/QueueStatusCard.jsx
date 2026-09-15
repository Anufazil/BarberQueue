import {
  Clock3,
  Scissors,
  CheckCircle2,
  XCircle,
  Users,
  Ticket,
} from "lucide-react";

import Card from "@/components/ui/Card";

const statusConfig = {
  WAITING: {
    label: "Waiting",
    className: "bg-yellow-100 text-yellow-700",
    dot: "bg-yellow-500",
  },
  SERVING: {
    label: "Your Turn",
    className: "bg-blue-100 text-blue-700",
    dot: "bg-blue-500",
  },
  COMPLETED: {
    label: "Completed",
    className: "bg-emerald-100 text-emerald-700",
    dot: "bg-emerald-500",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-red-100 text-red-700",
    dot: "bg-red-500",
  },
};

const QueueStatusCard = ({ queue }) => {
  if (!queue) {
    return null;
  }

  const status = statusConfig[queue.status] || {
    label: queue.status || "Unknown",
    className: "bg-slate-100 text-slate-700",
    dot: "bg-slate-400",
  };

  const statistics = [
    {
      label: "Token Number",
      value: `#${queue.tokenNumber ?? "—"}`,
      icon: Ticket,
      iconClass: "bg-indigo-100 text-indigo-600",
    },
    {
      label: "Queue Position",
      value: queue.queuePosition ?? "—",
      icon: Users,
      iconClass: "bg-blue-100 text-blue-600",
    },
    {
      label: "Customers Ahead",
      value: queue.customersAhead ?? 0,
      icon: Users,
      iconClass: "bg-orange-100 text-orange-600",
    },
    {
      label: "Estimated Wait",
      value: `${queue.estimatedWait ?? 0} min`,
      icon: Clock3,
      iconClass: "bg-emerald-100 text-emerald-600",
    },
  ];

  return (
    <Card className="overflow-hidden p-0">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-br from-indigo-50 via-white to-emerald-50 px-5 py-7 text-center sm:px-8">
        <div className="absolute -left-12 -top-12 h-32 w-32 rounded-full bg-indigo-200/30 blur-3xl" />
        <div className="absolute -bottom-16 -right-10 h-36 w-36 rounded-full bg-emerald-200/30 blur-3xl" />

        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
            Live Queue
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Your Queue Status
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Keep an eye on your position while you wait.
          </p>

          {/* Status */}
          <div className="mt-5 flex justify-center">
            <span
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${status.className}`}
            >
              <span
                className={`h-2.5 w-2.5 rounded-full ${status.dot}`}
              />
              {status.label}
            </span>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-3 p-5 sm:gap-4 sm:p-8 lg:grid-cols-4">
        {statistics.map((statistic) => {
          const Icon = statistic.icon;

          return (
            <div
              key={statistic.label}
              className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4 text-center transition-colors hover:bg-slate-50 sm:p-5"
            >
              <div
                className={`mx-auto flex h-10 w-10 items-center justify-center rounded-xl ${statistic.iconClass}`}
              >
                <Icon className="h-5 w-5" />
              </div>

              <p className="mt-3 text-xs font-medium text-slate-500 sm:text-sm">
                {statistic.label}
              </p>

              <p className="mt-1 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                {statistic.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Barber Information */}
      <div className="border-t border-slate-100 px-5 py-6 sm:px-8">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
              Your Barber
            </p>

            <h3 className="mt-1 text-lg font-bold text-slate-900">
              Service Details
            </h3>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 sm:flex-row sm:items-center sm:p-5">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
              <Scissors className="h-6 w-6" />
            </div>

            <div className="min-w-0">
              <p className="truncate font-semibold text-slate-900">
                {queue.barber?.displayName || "Your Barber"}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Professional Barber
              </p>
            </div>
          </div>

          <div className="sm:ml-auto">
            <span className="inline-flex rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm">
              Chair #{queue.barber?.chairNumber ?? "—"}
            </span>
          </div>
        </div>
      </div>

      {/* Currently Serving */}
      {queue.currentServing && (
        <div className="border-t border-indigo-100 bg-indigo-50 px-5 py-6 text-center sm:px-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
            <Scissors className="h-6 w-6 text-indigo-600" />
          </div>

          <h3 className="mt-3 font-bold text-indigo-900">
            Currently Serving
          </h3>

          <p className="mt-1 text-sm text-indigo-700">
            Token #{queue.currentServing.tokenNumber}
          </p>
        </div>
      )}

      {/* Waiting */}
      {queue.status === "WAITING" && (
        <div className="border-t border-yellow-100 bg-yellow-50 px-5 py-6 text-center sm:px-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
            <Clock3 className="h-6 w-6 text-yellow-600" />
          </div>

          <p className="mt-3 font-bold text-yellow-800">
            You are in the queue
          </p>

          <p className="mt-1 text-sm text-yellow-700">
            Please wait for your turn. Your position will update as the queue
            moves.
          </p>
        </div>
      )}

      {/* Serving */}
      {queue.status === "SERVING" && (
        <div className="border-t border-blue-100 bg-blue-50 px-5 py-6 text-center sm:px-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <Scissors className="h-6 w-6 text-blue-600" />
          </div>

          <p className="mt-3 text-lg font-bold text-blue-800">
            It is your turn!
          </p>

          <p className="mt-1 text-sm text-blue-700">
            Please proceed to your barber.
          </p>
        </div>
      )}

      {/* Completed */}
      {queue.status === "COMPLETED" && (
        <div className="border-t border-emerald-100 bg-emerald-50 px-5 py-6 text-center sm:px-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 className="h-7 w-7 text-emerald-600" />
          </div>

          <p className="mt-3 font-bold text-emerald-800">
            Your service has been completed
          </p>

          <p className="mt-1 text-sm text-emerald-700">
            Thank you for visiting us!
          </p>
        </div>
      )}

      {/* Cancelled */}
      {queue.status === "CANCELLED" && (
        <div className="border-t border-red-100 bg-red-50 px-5 py-6 text-center sm:px-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-7 w-7 text-red-600" />
          </div>

          <p className="mt-3 font-bold text-red-800">
            Queue cancelled
          </p>

          <p className="mt-1 text-sm text-red-700">
            This queue entry is no longer active.
          </p>
        </div>
      )}
      {['SKIPPED', 'NO_SHOW'].includes(queue.status) && <div className="border-t bg-amber-50 p-6 text-center"><p className="font-bold text-amber-900">This queue entry was skipped</p><p className="mt-2 text-amber-800">You can join a new queue when you are ready.</p></div>}
    </Card>
  );
};

export default QueueStatusCard;