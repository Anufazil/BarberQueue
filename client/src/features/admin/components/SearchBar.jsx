import Input from "@/components/ui/Input";
import { Search } from "lucide-react";

const SearchBar = ({ value, onChange }) => {
  return (
    <div className="relative w-full md:w-80">
      <Search
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
      />

      <Input aria-label="Search barbers"
        value={value}
        onChange={onChange}
        placeholder="Search by name, email..."
        className="pl-10"
      />
    </div>
  );
};

export default SearchBar;