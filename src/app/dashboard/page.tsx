"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import UserDashboard from "@/components/auth/UserDashboard";

const DashboardPage = () => {
  return (
    <ProtectedRoute>
      <UserDashboard />
    </ProtectedRoute>
  );
};

export default DashboardPage;
