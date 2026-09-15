import { ArrowRight, Scissors, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useCustomerHome } from "../hooks/useCustomerHome";
import BarberCard from "../components/BarberCard";

const CustomerDashboard = () => {
  const { data, isLoading, isError } = useCustomerHome();
  const navigate = useNavigate();

  const queueToken = localStorage.getItem("queueToken");

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl space-y-8 p-4 sm:p-6">
        {/* Header Skeleton */}
        <div className="space-y-3">
          <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
          <div className="h-9 w-72 animate-pulse rounded-lg bg-slate-200" />
          <div className="h-5 w-96 max-w-full animate-pulse rounded bg-slate-200" />
        </div>

        {/* Card Skeletons */}
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 animate-pulse rounded-2xl bg-slate-200" />

                <div className="flex-1 space-y-2">
                  <div className="h-5 w-32 animate-pulse rounded bg-slate-200" />
                  <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
                <div className="h-10 w-full animate-pulse rounded-xl bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-red-50 p-8 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <Scissors className="h-6 w-6 text-red-600" />
          </div>

          <h2 className="mt-4 text-lg font-semibold text-red-900">
            Unable to load barbers
          </h2>

          <p className="mt-2 text-sm leading-6 text-red-700">
            We couldn't load the available barbers right now. Please try again
            in a moment.
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-5 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const barbers = data?.data?.barbers ?? [];

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-4 sm:p-6">
      {/* Hero Header */}
      <section className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-emerald-50 p-6 shadow-sm sm:p-8">
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-indigo-200/30 blur-3xl" />
        <div className="absolute -bottom-20 right-20 h-40 w-40 rounded-full bg-emerald-200/30 blur-3xl" />

        <div className="relative max-w-3xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/70 px-3 py-1.5 text-xs font-semibold text-indigo-700 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />
            BarberQueue
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Find Your Barber
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Choose a barber, join the queue, and keep track of your place
            without waiting around.
          </p>
        </div>
      </section>

      {/* Active Queue */}
      {queueToken && (
        <section className="relative overflow-hidden rounded-2xl border border-indigo-200 bg-indigo-50 p-5 shadow-sm sm:p-6">
          <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-indigo-200/40 blur-2xl" />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
                <Scissors className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                  Active Queue
                </p>

                <h2 className="mt-1 text-lg font-bold text-indigo-950">
                  You're currently in a queue
                </h2>

                <p className="mt-1 text-sm text-indigo-700">
                  Your token number is{" "}
                  <span className="font-bold">#{localStorage.getItem('queueDisplayNumber') || '—'}</span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate(`/customer/queue/${queueToken}`)}
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md focus-visible:outline-indigo-600"
            >
              View Queue Status
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </section>
      )}

      {/* Barber Section */}
      <section>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
              Available Barbers
            </p>

            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
              Choose your barber
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Select a barber to view their queue and join.
            </p>
          </div>

          {barbers.length > 0 && (
            <span className="hidden rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 sm:inline-flex">
              {barbers.length}{" "}
              {barbers.length === 1 ? "barber" : "barbers"}
            </span>
          )}
        </div>

        {barbers.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
              <Scissors className="h-6 w-6 text-slate-400" />
            </div>

            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              No barbers available
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              There are currently no active barbers available. Please check
              again shortly.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {barbers.map((barber) => (
              <BarberCard
                key={barber._id}
                barber={barber}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default CustomerDashboard;