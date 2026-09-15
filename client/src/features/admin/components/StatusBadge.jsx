import Badge from "@/components/ui/Badge";

const statusClasses = {
  AVAILABLE: "bg-emerald-100 text-emerald-700",
  BUSY: "bg-yellow-100 text-yellow-700",
  OFFLINE: "bg-slate-200 text-slate-700",
};

const StatusBadge = ({ status }) => {
  return (
    <Badge className={statusClasses[status] || ""}>
      {status}
    </Badge>
  );
};

export default StatusBadge;