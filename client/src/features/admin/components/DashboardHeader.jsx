const DashboardHeader = () => {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="mb-1 text-sm font-semibold text-indigo-600">
          BarberQueue Admin
        </p>

        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-slate-500 sm:text-base">
          Welcome back. Here's an overview of your shop and recorded activity.
        </p>
      </div>
    </div>
  );
};

export default DashboardHeader;