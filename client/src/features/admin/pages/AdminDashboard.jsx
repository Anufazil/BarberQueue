import {
  Scissors,
  Users,
  UserCheck,
  Clock3,
  CheckCircle2,
  XCircle,
  Timer,
  BarChart3,
} from "lucide-react";

import DashboardHeader from "../components/DashboardHeader";
import DashboardSkeleton from "../components/DashboardSkeleton";
import DashboardError from "../components/DashboardError";
import StatCard from "../components/StatCard";
import RecentCustomers from "../components/RecentCustomers";
import RecentBarbers from "../components/RecentBarbers";
import { useDashboard } from "../hooks/useDashboard";

const AdminDashboard = () => {
  const { data, isLoading, isError } = useDashboard();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError) {
    return <DashboardError />;
  }

  const stats = data.data;
  const overview = stats.overview;
  const queue = stats.queue;
  const analytics = stats.analytics;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <DashboardHeader />

      {/* Primary Statistics */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <div className="h-5 w-1 rounded-full bg-indigo-600" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            Overview
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Barbers"
            value={overview.totalBarbers}
            icon={Scissors}
          />

          <StatCard
            title="Available Barbers"
            value={overview.availableBarbers}
            icon={UserCheck}
            color="text-emerald-600"
          />

          <StatCard
            title="Waiting Customers"
            value={queue.waiting}
            icon={Users}
          />

          <StatCard
            title="Occupancy Rate"
            value={`${analytics.occupancyRate}%`}
            icon={Clock3}
            color="text-amber-600"
          />
        </div>
      </section>

      {/* Queue Analytics */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <div className="h-5 w-1 rounded-full bg-emerald-500" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            Queue Analytics
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Completed"
            value={queue.completed}
            icon={CheckCircle2}
            color="text-emerald-600"
          />

          <StatCard
            title="Cancelled"
            value={queue.cancelled}
            icon={XCircle}
            color="text-red-500"
          />

          <StatCard
            title="Avg Service Time"
            value={`${analytics.averageServiceTime} min`}
            icon={Timer}
            color="text-indigo-600"
          />

          <StatCard
            title="Completion Rate"
            value={`${analytics.completionRate}%`}
            icon={BarChart3}
            color="text-indigo-600"
          />
        </div>
      </section>

      {/* Recent Activity */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <div className="h-5 w-1 rounded-full bg-slate-400" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            Recent Activity
          </h2>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <RecentCustomers customers={stats.recentCustomers} />
          <RecentBarbers barbers={stats.recentBarbers} />
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;