import { Outlet, NavLink } from "react-router-dom";
import {
  Home,
  Scissors,
  Ticket,
} from "lucide-react";

const CustomerLayout = () => {
  const navItems = [
    {
      label: "Home",
      path: "/customer",
      icon: Home,
    },
    {
      label: "Barbers",
      path: "/customer/barbers",
      icon: Scissors,
    },
    {
      label: "My Queue",
      path: "/customer/queue",
      icon: Ticket,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-4 sm:px-6 lg:px-8">

          {/* Brand */}
          <NavLink
            to="/customer"
            className="text-xl font-bold text-indigo-600"
          >
            BarberQueue
          </NavLink>

          {/* Links */}
          <div className="flex items-center gap-2 sm:gap-4">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  aria-label={item.label}
                  end={item.path === "/customer"}
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${
                      isActive
                        ? "bg-indigo-100 text-indigo-700"
                        : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                    }`
                  }
                >
                  <Icon size={17} />

                  <span className="hidden sm:inline">
                    {item.label}
                  </span>
                </NavLink>
              );
            })}
          </div>

        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-4 pt-3 text-right"><NavLink to="/login" className="text-sm text-indigo-700">Staff Login</NavLink></div>
      {/* Page Content */}
      <main>
        <Outlet />
      </main>

    </div>
  );
};

export default CustomerLayout;