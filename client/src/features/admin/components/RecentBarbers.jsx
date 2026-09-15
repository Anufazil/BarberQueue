import Card from "@/components/ui/Card";

const RecentBarbers = ({ barbers }) => {
  return (
    <Card>
      <h2 className="mb-4 text-xl font-semibold">
        Barbers
      </h2>

      <div className="space-y-4">
        {barbers.map((barber) => (
          <div
            key={barber._id}
            className="flex items-center justify-between border-b pb-3"
          >
            <div>
              <p className="font-medium">
                {barber.displayName}
              </p>

              <p className="text-sm text-slate-500">
                Chair {barber.chairNumber}
              </p>
            </div>

            <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm text-emerald-700">
              {barber.status}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default RecentBarbers;