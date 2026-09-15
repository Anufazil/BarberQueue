const DashboardError = () => {
  return (
    <div className="flex min-h-[300px] items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
          !
        </div>

        <h2 className="mt-4 font-semibold text-red-800">
          Unable to load dashboard
        </h2>

        <p className="mt-2 text-sm text-red-600">
          Something went wrong while loading the dashboard.
          Please try again later.
        </p>
      </div>
    </div>
  );
};

export default DashboardError;