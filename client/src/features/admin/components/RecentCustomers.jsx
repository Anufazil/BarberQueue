import Card from "@/components/ui/Card";

const RecentCustomers = ({ customers = [] }) => {
  return (
    <Card>
      <h2 className="mb-4 text-xl font-semibold">
        Recent Customers
      </h2>

      <div className="space-y-4">
        {customers.length === 0 ? (
          <p className="text-sm text-slate-500">
            No recent customers.
          </p>
        ) : (
          customers.map((customer) => (
            <div
              key={customer._id}
              className="flex items-center justify-between border-b pb-3"
            >
              <div>
                <p className="font-medium">
                  {customer.customerName}
                </p>

                <p className="text-sm text-slate-500">
                  {customer.barber?.displayName ||
                    "Barber unavailable"}
                </p>
              </div>

              <div className="text-right">
                <p>#{customer.tokenNumber}</p>

                <p className="text-sm text-indigo-600">
                  {customer.status}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default RecentCustomers;