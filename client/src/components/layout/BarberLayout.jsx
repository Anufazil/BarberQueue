import { Outlet } from "react-router-dom";

import AppShell from "./AppShell";

const BarberLayout = () => {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
};

export default BarberLayout;