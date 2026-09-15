import { Link } from 'react-router-dom';
import { adminNavigation, barberNavigation } from '@/constants/navigation';
import { useAuth } from "@/context/AuthContext";

import ConnectionStatus from "@/features/barber/components/ConnectionStatus";

const Header = () => {
  const { user, logout } = useAuth();

  const userName = user?.name || "User";
  const userRole = user?.role || "Barber";

  return (
    <><nav aria-label="Staff navigation" className="flex flex-wrap items-center gap-3 border-b bg-white p-4 lg:hidden">
      {(user?.role === 'ADMIN' ? adminNavigation : barberNavigation).map(item => <Link key={item.path} to={item.path} className="rounded-lg px-2 py-1 text-sm text-indigo-700">{item.title}</Link>)}
      <button onClick={logout} className="rounded-lg border px-3 py-1 text-sm">Logout</button>
    </nav><header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 py-4 backdrop-blur sm:px-6">
      {/* Page Title */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          Dashboard
        </h1>

        <p className="mt-0.5 hidden text-sm text-slate-500 sm:block">
          Manage your shop and queue
        </p>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3 sm:gap-5">
        {/* Connection Indicator */}
        <div className="hidden sm:block">
          <ConnectionStatus />
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="font-semibold leading-tight text-slate-900">
              {userName}
            </p>

            <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              {userRole}
            </p>
          </div>

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-lg font-bold text-indigo-600 ring-4 ring-indigo-50">
            {userName.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header></>
  );
};

export default Header;