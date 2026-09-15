import PublicLayout from "@/components/layout/PublicLayout";
import CustomerLayout from "@/components/layout/CustomerLayout";
import BarberLayout from "@/components/layout/BarberLayout";
import AdminLayout from "@/components/layout/AdminLayout";

import LoginPage from "@/features/auth/pages/LoginPage";
import { Navigate } from 'react-router-dom';
import QueueManagement from '@/features/admin/pages/QueueManagement';

import CustomerDashboard from "@/features/customer/pages/CustomerDashboard";
import BarbersPage from "@/features/customer/pages/BarbersPage";
import QueuePage from "@/features/customer/pages/QueuePage";

import BarberDashboard from "@/features/barber/pages/BarberDashboard";

import AdminDashboard from "@/features/admin/pages/AdminDashboard";
import BarberManagement from "@/features/admin/pages/BarberManagement";
import ReportsPage from "@/features/admin/pages/ReportsPage";
import QueueStatusPage from "@/features/customer/pages/QueueStatusPage";

import NotFound from "@/components/common/NotFound";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import RoleGuard from "@/components/common/RoleGuard";

export const routes = [
  // ==========================
  // Public Routes
  // ==========================
  {
    element: <PublicLayout />,
    children: [
      {
        path: "/",
        element: <Navigate to="/customer" replace />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <Navigate to="/login" replace />,
      },
    ],
  },

  // ==========================
  // Customer Routes (Public)
  // ==========================
  {
    path: "/customer",
    element: <CustomerLayout />,
    children: [
      {
        index: true,
        element: <CustomerDashboard />,
      },
      {
        path: "barbers",
        element: <BarbersPage />,
      },
      {
        path: "queue",
        element: <QueuePage />,
      },
      {
        path: "queue/:token",
        element: <QueueStatusPage />,
      },
    ],
  },

  // ==========================
  // Barber Protected Routes
  // ==========================
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <RoleGuard allowedRoles={["BARBER"]} />,
        children: [
          {
            path: "/barber",
            element: <BarberLayout />,
            children: [
              {
                index: true,
                element: <BarberDashboard />,
              },
            ],
          },
        ],
      },
    ],
  },

  // ==========================
  // Admin Protected Routes
  // ==========================
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <RoleGuard allowedRoles={["ADMIN"]} />,
        children: [
          {
            path: "/admin",
            element: <AdminLayout />,
            children: [
              {
                index: true,
                element: <AdminDashboard />,
              },
              {
                path: "barbers",
                element: <BarberManagement />,
              },
              {
                path: "queues",
                element: <QueueManagement />,
              },
              {
                path: "reports",
                element: <ReportsPage />,
              },
            ],
          },
        ],
      },
    ],
  },

  // ==========================
  // 404
  // ==========================
  {
    path: "*",
    element: <NotFound />,
  },
];