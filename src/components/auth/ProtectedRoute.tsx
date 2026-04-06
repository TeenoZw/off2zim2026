"use client";

import { useEffect, ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/auth";
import { getAccountRoute } from "@/lib/auth-routing";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: UserRole;
  requiredVerification?: boolean;
  fallback?: ReactNode;
}

const ProtectedRoute = ({
  children,
  requiredRole,
  requiredVerification = false,
  fallback,
}: ProtectedRouteProps) => {
  const { user, isLoading, hasRole, isVerified } = useAuth();
  const accountRoute = getAccountRoute(user);

  useEffect(() => {
    if (!isLoading && !user) {
      // Redirect to login if not authenticated
      window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
    }
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Authentication Required
            </h2>
            <p className="text-gray-600 mb-6">
              Please sign in to access this page.
            </p>
            <a
              href="/login"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign In
            </a>
          </div>
        </div>
      )
    );
  }

  // Check role requirement
  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-6">
            You don&apos;t have permission to access this page. Required role:{" "}
            {requiredRole}
          </p>
          <a
            href={accountRoute}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to workspace
          </a>
        </div>
      </div>
    );
  }

  // Check verification requirement
  if (requiredVerification && !isVerified()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Verification Required
          </h2>
          <p className="text-gray-600 mb-6">
            You need to verify your account to access this feature.
          </p>
          <div className="space-x-4">
            <a
              href="/verify"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Verify Account
            </a>
            <a
              href={accountRoute}
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Go to workspace
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
