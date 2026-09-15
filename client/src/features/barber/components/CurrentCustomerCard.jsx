import {
  UserRound,
  Ticket,
  Clock3,
  Phone,
  CheckCircle2,
  Scissors,
  ArrowRight,
  XCircle,
} from "lucide-react";

import { motion } from "framer-motion";

import {
  useCallNextCustomer,
  useFinishCurrentCustomer,
  useSkipCustomer,
} from "../hooks/useQueueMutations";

const CurrentCustomerCard = ({ customer, barberId }) => {
  const {
    mutate: callNext,
    isPending: calling,
  } = useCallNextCustomer();

  const {
    mutate: finishCustomer,
    isPending: finishing,
  } = useFinishCurrentCustomer();

  const {
    mutate: skipCustomer,
    isPending: skipping,
  } = useSkipCustomer();

  /* Empty State */
  if (!customer) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex h-full min-h-[420px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 p-6 sm:p-7">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                <Scissors
                  size={20}
                  className="text-slate-500"
                />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Current Customer
                </h2>

                <p className="mt-0.5 text-sm text-slate-500">
                  Your current service
                </p>
              </div>
            </div>
          </div>

          <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-500">
            Idle
          </span>
        </div>

        {/* Empty Content */}
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50 ring-8 ring-indigo-50/60">
            <UserRound
              size={38}
              className="text-indigo-300"
            />
          </div>

          <h3 className="mt-6 text-xl font-bold text-slate-900">
            Nobody is being served
          </h3>

          <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
            Call the next customer from your waiting queue to begin service.
          </p>

          <button
            onClick={() => callNext(barberId)}
            disabled={calling}
            className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-indigo-700 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {calling ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Calling...
              </>
            ) : (
              <>
                Call Next Customer
                <ArrowRight size={17} />
              </>
            )}
          </button>
        </div>
      </motion.div>
    );
  }

  /* Customer Available */
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      {/* Header */}
      <div className="flex items-start justify-between border-b border-slate-100 p-6 sm:p-7">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
              <Scissors
                size={20}
                className="text-emerald-600"
              />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Current Customer
              </h2>

              <p className="mt-0.5 text-sm text-slate-500">
                Customer currently in service
              </p>
            </div>
          </div>
        </div>

        <span className="flex shrink-0 items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Serving
        </span>
      </div>

      {/* Customer Profile */}
      <div className="p-6 sm:p-7">
        <div className="flex flex-col items-center text-center sm:flex-row sm:text-left">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-indigo-100 ring-8 ring-indigo-50">
            <UserRound
              size={36}
              className="text-indigo-600"
            />
          </div>

          <div className="mt-5 min-w-0 sm:ml-5 sm:mt-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Now Serving
            </p>

            <h3 className="mt-1 truncate text-2xl font-bold text-slate-900">
              {customer.customerName}
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Customer is currently in service
            </p>
          </div>
        </div>

        {/* Customer Information */}
        <div className="mt-7 grid gap-3 sm:grid-cols-3">
          {/* Token */}
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex items-center gap-2">
              <Ticket
                size={17}
                className="text-indigo-600"
              />

              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Token
              </span>
            </div>

            <p className="mt-2 text-xl font-bold text-slate-900">
              #{customer.tokenNumber}
            </p>
          </div>

          {/* Started */}
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex items-center gap-2">
              <Clock3
                size={17}
                className="text-indigo-600"
              />

              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Started
              </span>
            </div>

            <p className="mt-2 text-sm font-bold text-slate-900">
              {customer.servedAt
                ? new Date(customer.servedAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "--"}
            </p>
          </div>

          {/* Phone */}
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex items-center gap-2">
              <Phone
                size={17}
                className="text-indigo-600"
              />

              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Phone
              </span>
            </div>

            <p className="mt-2 truncate text-sm font-bold text-slate-900">
              {customer.phone || "Not provided"}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <button
            onClick={() => {
              if (
                window.confirm(
                  "Finish serving this customer?"
                )
              ) {
                finishCustomer({ barberId, queueId: customer._id });
              }
            }}
            disabled={finishing || skipping}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-emerald-700 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {finishing ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Finishing...
              </>
            ) : (
              <>
                <CheckCircle2 size={17} />
                Finish Service
              </>
            )}
          </button>

          <button
            onClick={() => {
              if (
                window.confirm(
                  "Skip this customer?"
                )
              ) {
                skipCustomer(customer._id);
              }
            }}
            disabled={skipping || finishing}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-amber-600 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-amber-500/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {skipping ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Skipping...
              </>
            ) : (
              <>
                <XCircle size={17} />
                Skip Customer
              </>
            )}
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto border-t border-slate-100 bg-slate-50/70 px-6 py-3 sm:px-7">
        <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-500">
          <CheckCircle2
            size={14}
            className="text-emerald-500"
          />
          Service is currently active
        </div>
      </div>
    </motion.div>
  );
};

export default CurrentCustomerCard;