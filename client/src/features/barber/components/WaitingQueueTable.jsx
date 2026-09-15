import {
  Users,
  UserRound,
  Ticket,
  Phone,
  XCircle,
  Clock3,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useCancelCustomer } from "../hooks/useQueueMutations";

const WaitingQueueTable = ({ queue = [] }) => {
  const [highlightedCustomer, setHighlightedCustomer] = useState(null);
  const previousQueueRef = useRef([]);

  const { mutate: cancelCustomer, isPending } = useCancelCustomer();

  useEffect(() => {
    const previousQueue = previousQueueRef.current;

    if (previousQueue.length > 0 && queue.length > previousQueue.length) {
      const previousIds = new Set(
        previousQueue.map((customer) => customer._id)
      );

      const newCustomer = queue.find(
        (customer) => !previousIds.has(customer._id)
      );

      if (newCustomer) {
        setHighlightedCustomer(newCustomer._id);

        const timer = setTimeout(() => {
          setHighlightedCustomer(null);
        }, 2500);

        return () => clearTimeout(timer);
      }
    }

    previousQueueRef.current = queue;
  }, [queue]);

  const handleCancel = (customer) => {
    const confirmed = window.confirm(
      `Cancel ${customer.customerName}'s queue entry?`
    );

    if (!confirmed) return;

    cancelCustomer(customer._id);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50">
            <Users className="h-5 w-5 text-indigo-600" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-slate-900">
                Waiting Queue
              </h2>

              <motion.span
                key={queue.length}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700"
              >
                {queue.length}
              </motion.span>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              Customers currently waiting for service
            </p>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {queue.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
            <Users className="h-7 w-7 text-slate-400" />
          </div>

          <h3 className="mt-5 text-base font-semibold text-slate-900">
            No customers waiting
          </h3>

          <p className="mt-2 max-w-sm text-sm text-slate-500">
            The queue is currently empty. New customers will appear here when
            they join.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop / Tablet Table */}
          <div className="overflow-x-auto">
            <table className="min-w-[760px] w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70">
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Position
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Token
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Customer
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Phone
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Joined
                  </th>

                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                <AnimatePresence initial={false}>
                  {queue.map((customer, index) => {
                    const isHighlighted =
                      highlightedCustomer === customer._id;

                    return (
                      <motion.tr
                        key={customer._id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.25 }}
                        className={`group transition-colors ${
                          isHighlighted
                            ? "bg-indigo-50/70"
                            : "hover:bg-slate-50/70"
                        }`}
                      >
                        {/* Position */}
                        <td className="px-6 py-4">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-sm font-semibold text-slate-700">
                            {index + 1}
                          </div>
                        </td>

                        {/* Token */}
                        <td className="px-6 py-4">
                          <div className="inline-flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-2">
                            <Ticket className="h-4 w-4 text-indigo-600" />

                            <span className="text-sm font-bold text-indigo-700">
                              {customer.tokenNumber}
                            </span>
                          </div>
                        </td>

                        {/* Customer */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100">
                              <UserRound className="h-4 w-4 text-slate-500" />
                            </div>

                            <div>
                              <p className="text-sm font-semibold text-slate-900">
                                {customer.customerName}
                              </p>

                              {isHighlighted && (
                                <motion.p
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  className="text-xs font-medium text-indigo-600"
                                >
                                  New customer
                                </motion.p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Phone */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Phone className="h-4 w-4 text-slate-400" />
                            {customer.phone}
                          </div>
                        </td>

                        {/* Joined */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Clock3 className="h-4 w-4 text-slate-400" />

                            {customer.joinedAt
                              ? new Date(
                                  customer.joinedAt
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "--"}
                          </div>
                        </td>

                        {/* Action */}
                        <td className="px-6 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleCancel(customer)}
                            disabled={isPending}
                            className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 transition hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                            aria-label={`Cancel ${customer.customerName}`}
                          >
                            <XCircle className="h-4 w-4" />

                            <span className="hidden sm:inline">
                              Cancel
                            </span>
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-5 py-3 sm:px-6">
            <p className="text-xs text-slate-500">
              {queue.length}{" "}
              {queue.length === 1 ? "customer" : "customers"} waiting
            </p>

            <p className="text-xs font-medium text-slate-500">
              Queue updates automatically
            </p>
          </div>
        </>
      )}
    </motion.section>
  );
};

export default WaitingQueueTable;