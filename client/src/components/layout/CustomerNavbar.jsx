import { Link, NavLink } from "react-router-dom";
import { Scissors, Users, Ticket } from "lucide-react";

const CustomerNavbar = () => {
  const navItems = [
    {
      label: "Dashboard",
      path: "/customer",
      icon: Users,
      end: true,
    },
    {
      label: "Barbers",
      path: "/customer/barbers",
      icon: Scissors,
    },
    {
      label: "Queue",
      path: "/customer/queue",
      icon: Ticket,
    },
  ];

  return (
    <header className="border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          to="/customer"
          className="flex items-center gap-2"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600">
            <Scissors
              size={21}
              className="text-white"
            />
          </div>

          <div>
            <h1 className="text-lg font-bold text-slate-900">
              BarberQueue
            </h1>

            <p className="hidden text-xs text-slate-500 sm:block">
              Customer Portal
            </p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 ${
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
        </nav>

      </div>
    </header>
  );
};

export default CustomerNavbar;