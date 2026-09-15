import { LogOut } from "lucide-react";
import Logo from "./Logo";
import NavItem from "./NavItem";
import { adminNavigation, barberNavigation } from "@/constants/navigation";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";

const Sidebar = () => {
  const { user, logout } = useAuth();

  const initials =
    user?.name
      ?.split(" ")
      .map((name) => name[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-slate-200/80 bg-white lg:flex">
      {/* Brand */}
      <div className="border-b border-slate-200/80 px-5 py-5">
        <Logo />
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-5">
        <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
          Navigation
        </p>

        <div className="space-y-1.5">
          {(user?.role === "ADMIN" ? adminNavigation : barberNavigation).map((item) => (
            <NavItem
              key={item.path}
              to={item.path}
              icon={item.icon}
            >
              {item.title}
            </NavItem>
          ))}
        </div>
      </nav>

      {/* User Section */}
      <div className="border-t border-slate-200/80 p-4">
        <div className="mb-3 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
          {/* Avatar */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700 ring-4 ring-indigo-50">
            {initials}
          </div>

          {/* User Information */}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-900">
              {user?.name || "User"}
            </p>

            <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
              {user?.role || "Barber"}
            </p>
          </div>
        </div>

        {/* Logout */}
        <Button
          variant="danger"
          className="flex w-full items-center justify-center gap-2 rounded-xl"
          onClick={logout}
        >
          <LogOut size={17} />
          Logout
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;