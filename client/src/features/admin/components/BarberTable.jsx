import Card from "@/components/ui/Card";
import { Link } from "react-router-dom";


import EditBarberModal from "./EditBarberModal";
import DeleteBarberModal from "./DeleteBarberModal";
import { useUpdateBarberStatus } from "../hooks/useUpdateBarberStatus";
import { useReactivateBarber } from "../hooks/useReactivateBarber";



const BarberTable = ({ barbers }) => {
  const { mutate, isPending } = useUpdateBarberStatus();
  const {
  mutate: reactivate,
  isPending: isReactivating,
} = useReactivateBarber();
  if (!barbers.length) {
    return (
      <Card>
        <div className="py-10 text-center">
          <p className="text-slate-500">
            No barbers found.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b bg-slate-50 text-left">
              <th className="p-4">Barber</th>
              <th className="p-4">Chair</th>
              <th className="p-4">Specialization</th>
              <th className="p-4">Experience</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {barbers.map((barber) => (
              <tr
                key={barber._id}
                className="border-b transition-colors hover:bg-slate-50"
              >
                <td className="p-4">
                  <div>
                    <p className="font-semibold">
                      {barber.displayName}{!barber.isActive && " (Inactive)"}
                    </p>

                    <p className="text-sm text-slate-500">
                      {barber.user?.name || "Account unavailable"}
                    </p>

                    <p className="text-xs text-slate-400">
                      {barber.user?.email}
                    </p>
                  </div>
                </td>

                <td className="p-4">
                  #{barber.chairNumber}
                </td>

                <td className="p-4">
                  {barber.specialization}
                </td>

                <td className="p-4">
                  {barber.experience} Years
                </td>

                <td className="p-4">
                  <select
                    aria-label={barber.displayName + ' status'}
                    value={barber.status}
                    disabled={isPending || !barber.isActive}
                    onChange={(e) => {
                      mutate({
                        id: barber._id,
                        status: e.target.value,
                      });
                    }}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="AVAILABLE">Available</option>
                    <option value="BUSY">Busy</option>
                    <option value="BREAK">On Break</option>
                    <option value="OFFLINE">Offline</option>
                  </select>
                </td>

                <td className="p-4">
                <div className="flex justify-end gap-2">
                  <Link
                    className="rounded-lg border px-3 py-2 text-indigo-700"
                    to={"/admin/queues?barber=" + barber._id}
                  >
                    Details & Queue
                  </Link>

                  <EditBarberModal barber={barber} />

                  {barber.isActive ? (
                    <DeleteBarberModal barber={barber} />
                  ) : (
                    <button
                      type="button"
                      disabled={isReactivating}
                      onClick={() => reactivate(barber._id)}
                      className="rounded-lg border border-emerald-200 px-3 py-2 text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isReactivating ? "Reactivating..." : "Reactivate"}
                    </button>
                  )}
                </div>
              </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default BarberTable;