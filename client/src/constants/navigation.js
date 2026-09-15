import {
  LayoutDashboard,
  Users,
  BarChart3,

} from "lucide-react";

export const adminNavigation = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin",
  },
  {
    title: "Barbers",
    icon: Users,
    path: "/admin/barbers",
  },
  {
    title: "Queues",
    icon: Users,
    path: "/admin/queues",
  },
  {
    title: "Reports",
    icon: BarChart3,
    path: "/admin/reports",
  },

];

export const barberNavigation = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/barber",
  },
];