import { Link } from "react-router-dom";

import {
  ArrowLeft,
  Scissors,
  Sparkles,
  Users,
} from "lucide-react";

import BarberCard from "../components/BarberCard";
import Card from "@/components/ui/Card";
import { useCustomerHome } from "../hooks/useCustomerHome";

const BarbersPage = () => {
  const {
    data,
    isLoading,
    isError,
  } = useCustomerHome();

  // Loading state
  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mb-10 text-center">
          <div className="mx-auto h-16 w-16 animate-pulse rounded-2xl bg-slate-200" />

          <div className="mx-auto mt-5 h-8 w-64 animate-pulse rounded-lg bg-slate-200" />

          <div className="mx-auto mt-3 h-4 w-96 max-w-full animate-pulse rounded bg-slate-100" />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <Card
              key={item}
              className="overflow-hidden p-0"
            >
              <div className="h-32 animate-pulse bg-slate-100" />

              <div className="space-y-4 p-5">
                <div className="h-5 w-32 animate-pulse rounded bg-slate-200" />

                <div className="h-4 w-24 animate-pulse rounded bg-slate-100" />

                <div className="grid grid-cols-2 gap-3">
                  <div className="h-16 animate-pulse rounded-xl bg-slate-100" />
                  <div className="h-16 animate-pulse rounded-xl bg-slate-100" />
                </div>

                <div className="h-11 animate-pulse rounded-xl bg-slate-200" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="mx-auto flex min-h-[500px] max-w-2xl items-center px-4 py-10">
        <Card className="w-full text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100">
            <Scissors className="h-7 w-7 text-red-600" />
          </div>

          <h1 className="mt-5 text-xl font-bold text-slate-900">
            Unable to load barbers
          </h1>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            We couldn't retrieve the barber list right now. Please try again
            in a moment.
          </p>

          <Link
            to="/customer"
            className="mt-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </Card>
      </div>
    );
  }

  const barbers = data?.data?.barbers ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      {/* Header */}
      <div className="mb-8 text-center sm:mb-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-lg shadow-indigo-200">
          <Scissors className="h-8 w-8 text-white" />
        </div>

        <div className="mt-5 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600">
          <Sparkles className="h-3.5 w-3.5" />
          BarberQueue
        </div>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Choose Your Barber
        </h1>

        <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
          Select a barber and join their queue remotely without waiting in
          line.
        </p>
      </div>

      {/* Empty State */}
      {barbers.length === 0 ? (
        <Card className="mx-auto max-w-xl overflow-hidden p-0">
          <div className="px-5 py-12 text-center sm:px-8 sm:py-16">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
              <Scissors className="h-7 w-7 text-slate-400" />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              No barbers available
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              There are currently no barbers available. Please check again
              later.
            </p>

            <Link
              to="/customer"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 transition hover:text-indigo-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </div>
        </Card>
      ) : (
        <>
          {/* Results Header */}
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100">
                <Users className="h-4 w-4 text-indigo-600" />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {barbers.length}{" "}
                  {barbers.length === 1 ? "Barber" : "Barbers"}
                </p>

                <p className="text-xs text-slate-500">
                  Available to serve you
                </p>
              </div>
            </div>

            <Link
              to="/customer"
              className="inline-flex items-center gap-2 self-start text-sm font-semibold text-indigo-600 transition hover:text-indigo-700 sm:self-auto"
            >
              <ArrowLeft className="h-4 w-4" />
              Dashboard
            </Link>
          </div>

          {/* Barber Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {barbers.map((barber) => (
              <BarberCard
                key={barber._id}
                barber={barber}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default BarbersPage;