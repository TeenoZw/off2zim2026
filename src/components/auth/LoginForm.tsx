"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface LoginFormProps {
  onClose?: () => void;
  redirectTo?: string;
}

const LoginForm = ({ onClose, redirectTo }: LoginFormProps) => {
  const { login, isLoading, error } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email: formData.email, password: formData.password });
      onClose?.();
      if (redirectTo) {
        window.location.href = redirectTo;
      }
    } catch (err) {
      // Error is handled by the AuthContext
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const demoAccounts = [
    {
      role: "Foreign Explorer",
      email: "explorer@demo.com",
      description: "Tourist/Foreign Visitor Account",
    },
    {
      role: "Local Explorer",
      email: "local.explorer@demo.com",
      description: "Local Zimbabwean Explorer",
    },
    {
      role: "Service Provider",
      email: "provider@demo.com",
      description: "Tourism Business Account",
    },
    {
      role: "Community Guide",
      email: "guide@demo.com",
      description: "Vetted Local Expert Guide",
    },
    {
      role: "Admin",
      email: "admin@demo.com",
      description: "Platform Administrator",
    },
  ];

  const fillDemoAccount = (email: string) => {
    setFormData({ email, password: "demo12345" });
  };

  return (
    <div className="theme-card w-full max-w-md rounded-[30px] p-6 shadow-xl md:p-7">
      <div className="text-center mb-6">
        <h2 className="theme-heading text-2xl font-bold">Welcome back</h2>
        <p className="theme-muted mt-2 text-sm">Sign in to continue your Off2Zim journey</p>
      </div>

      {error && (
        <div className="mb-4 rounded-[18px] border border-rose-200 bg-rose-50 p-4 dark:border-rose-500/20 dark:bg-rose-500/10">
          <p className="text-sm text-rose-600 dark:text-rose-200">{error}</p>
        </div>
      )}

      {/* Social Login Options */}
      <div className="mb-6">
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            className="theme-button-secondary w-full inline-flex items-center justify-center rounded-[18px] px-4 py-2 text-sm font-medium"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google
          </button>

          <button
            type="button"
            className="theme-button-secondary w-full inline-flex items-center justify-center rounded-[18px] px-4 py-2 text-sm font-medium"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Facebook
          </button>
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="theme-muted theme-panel-strong rounded-full px-3 py-1 text-xs">
              Or continue with email
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="theme-muted mb-1 block text-sm font-medium"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="theme-input w-full rounded-[18px] px-3 py-2"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="theme-muted mb-1 block text-sm font-medium"
          >
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="theme-input w-full rounded-[18px] px-3 py-2 pr-10"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="theme-subtle absolute inset-y-0 right-0 flex items-center pr-3 hover:text-slate-700 dark:hover:text-white/70"
            >
              {showPassword ? (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input type="checkbox" className="rounded border-black/20 text-[#ff5630]" />
            <span className="theme-muted ml-2 text-sm">Remember me</span>
          </label>
          <a href="#" className="text-sm text-[#ff5630] hover:text-[#e44c28]">
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-full bg-[#ff5630] px-4 py-3 text-white transition-colors hover:bg-[#e44c28] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? "Signing In..." : "Sign In"}
        </button>
      </form>

      {/* Demo Accounts Section */}
      <div className="mt-6 border-t border-black/10 pt-6 dark:border-white/10">
        <p className="theme-muted mb-3 text-center text-sm">
          Demo Accounts (Development)
        </p>
        <div className="space-y-2">
          {demoAccounts.map((account) => (
            <button
              key={account.email}
              onClick={() => fillDemoAccount(account.email)}
              className="theme-card-soft w-full rounded-[18px] p-3 text-left transition-colors"
            >
              <div className="flex justify-between items-center">
                <span className="theme-heading text-sm font-medium">
                  {account.role}
                </span>
                <span className="theme-muted text-xs">{account.email}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {account.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <a
            href="/register"
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            Sign up here
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
