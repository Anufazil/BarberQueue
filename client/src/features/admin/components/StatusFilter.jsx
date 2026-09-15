const StatusFilter = ({ value, onChange }) => {
  
  return (
    <select
      aria-label="Filter barber status"
      value={value}
      onChange={onChange}
      className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-indigo-500"
    >
      <option value="ALL">All Barbers</option>
      <option value="ACTIVE">Active</option>
      <option value="INACTIVE">Inactive</option>
      <option value="AVAILABLE">Available</option>
      <option value="BUSY">Busy</option>
      <option value="BREAK">On Break</option>
      <option value="OFFLINE">Offline</option>
    </select>
  );
};

export default StatusFilter;