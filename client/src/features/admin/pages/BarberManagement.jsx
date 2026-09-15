import { useMemo, useState } from "react";

import { useBarbers } from "../hooks/useBarbers";

import BarberTable from "../components/BarberTable";
import DashboardSkeleton from "../components/DashboardSkeleton";
import DashboardError from "../components/DashboardError";
import SearchBar from "../components/SearchBar";
import StatusFilter from "../components/StatusFilter";
import AddBarberModal from "../components/AddBarberModal";

const BarberManagement = () => {
  const { data, isLoading, isError } = useBarbers();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");

  const barbers = useMemo(() => data?.barbers ?? [], [data]);

  const filteredBarbers = useMemo(() => {
    return barbers.filter((barber) => {
      const matchesSearch =
        barber.displayName
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        (barber.user?.email || "")
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        barber.specialization
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        status === "ALL" ||
        (status === "ACTIVE" && barber.isActive) ||
        (status === "INACTIVE" && !barber.isActive) ||
        (["AVAILABLE", "BUSY", "BREAK", "OFFLINE"].includes(status) &&
          barber.isActive &&
          barber.status === status);

      return matchesSearch && matchesStatus;
    });
  }, [barbers, search, status]);

  if (isLoading) return <DashboardSkeleton />;

  if (isError) return <DashboardError />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Barber Management
          </h1>

          <p className="text-slate-500">
            Manage all registered barbers.
          </p>
        </div>

        <AddBarberModal />
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <SearchBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <StatusFilter
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        />
      </div>

      <BarberTable
        barbers={filteredBarbers}
      />
    </div>
  );
};

export default BarberManagement;