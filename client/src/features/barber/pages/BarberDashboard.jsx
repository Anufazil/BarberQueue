
import { useBarberDashboard } from "../hooks/useBarberDashboard";

import BarberSummaryCards from "../components/BarberSummaryCards";
import CurrentCustomerCard from "../components/CurrentCustomerCard";
import WaitingQueueTable from "../components/WaitingQueueTable";
import QueueAnalyticsCard from "../components/QueueAnalyticsCard";
import ConnectionStatus from "../components/ConnectionStatus";
import BarberStatusControl from "../components/BarberStatusControl";

const BarberDashboard = () => {


  const {
    data,
    isLoading,
    isError,
    error,
  } = useBarberDashboard();

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />

          <p className="mt-4 text-sm font-medium text-slate-600">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {

    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-6 text-center shadow-sm sm:p-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <span className="text-xl text-red-600">!</span>
          </div>

          <h2 className="mt-4 text-lg font-semibold text-slate-900">
            Failed to load dashboard
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {error?.response?.data?.message ||
              error?.message ||
              "Something went wrong while loading the dashboard."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <section>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">
              BarberQueue
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Welcome, {data.barber.displayName}
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Manage your customers and keep today's queue moving smoothly.
            </p>
          </div>

          <ConnectionStatus />
        </div>
      </section>

      {/* Status */}
      <section>
        <div className="mb-3">
          <h2 className="text-sm font-semibold text-slate-900">
            Availability
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Update your current working status.
          </p>
        </div>

        <BarberStatusControl barber={data.barber} />
      </section>

      {/* Summary */}
      <section>
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-slate-900">
            Today's Overview
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Live statistics for your queue.
          </p>
        </div>

        <BarberSummaryCards summary={data.summary} />
      </section>

      {/* Current Customer + Analytics */}
      <section>
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-slate-900">
            Queue Management
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Manage the customer currently being served and monitor queue insights.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="min-w-0 lg:col-span-2">
            <CurrentCustomerCard
              customer={data.currentCustomer}
              barberId={data.barber._id}
            />
          </div>

          <div className="min-w-0">
            <QueueAnalyticsCard analytics={data.analytics} />
          </div>
        </div>
      </section>

      {/* Waiting Queue */}
      <section>
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-slate-900">
            Waiting Queue
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Customers currently waiting for your service.
          </p>
        </div>

        <WaitingQueueTable queue={data.waitingQueue} />
      </section>
    </div>
  );
};

export default BarberDashboard;