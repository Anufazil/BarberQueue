import { NavLink } from "react-router-dom";
import { cn } from "@/utils/cn";

const NavItem = ({ to, icon: Icon, children }) => {
  return (
    <NavLink
      to={to}
      end={to === "/admin" || to === "/barber"}
      className={({ isActive }) =>
        cn(
          "group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
          isActive
            ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        )
      }
    >
      <Icon
        size={19}
        strokeWidth={2}
        className="shrink-0 transition-transform duration-200 group-hover:scale-105"
      />

      <span>{children}</span>
    </NavLink>
  );
};

export default NavItem;