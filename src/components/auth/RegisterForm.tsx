"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole, ExplorerType } from "@/types/auth";

interface RegisterFormProps {
  onClose?: () => void;
  redirectTo?: string;
}

const RegisterForm = ({ onClose, redirectTo }: RegisterFormProps) => {
  const { register, isLoading, error } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    role: "explorer" as UserRole,
    // Aligns with PRD 2.1: Explorer location identification
    explorerType: "foreign" as ExplorerType,
    // Aligns with PRD 3.1: Core Company Profile fields
    companyName: "",
    tradingName: "",
    businessRegistrationNumber: "",
    mainContactPerson: "",
    businessPhone: "",
    businessEmail: "",
    physicalAddress: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return;
    }

    // Validate required business fields for Service Providers
    if (formData.role === "provider") {
      const requiredBusinessFields = [
        "companyName",
        "businessRegistrationNumber",
        "mainContactPerson",
        "businessPhone",
        "businessEmail",
        "physicalAddress",
      ];

      for (const field of requiredBusinessFields) {
        if (!formData[field as keyof typeof formData]?.trim()) {
          return; // Form validation will show the required field errors
        }
      }
    }

    try {
      // Aligns with PRD 3.1: Pass Core Company Profile data for providers
      await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.role,
        explorerType:
          formData.role === "explorer" ? formData.explorerType : undefined,
        companyName:
          formData.role === "provider" ? formData.companyName : undefined,
        tradingName:
          formData.role === "provider" ? formData.tradingName : undefined,
        businessRegistrationNumber:
          formData.role === "provider"
            ? formData.businessRegistrationNumber
            : undefined,
        mainContactPerson:
          formData.role === "provider" ? formData.mainContactPerson : undefined,
        businessPhone:
          formData.role === "provider" ? formData.businessPhone : undefined,
        businessEmail:
          formData.role === "provider" ? formData.businessEmail : undefined,
        physicalAddress:
          formData.role === "provider" ? formData.physicalAddress : undefined,
      });
      onClose?.();
      if (redirectTo) {
        window.location.href = redirectTo;
      }
    } catch (err) {
      // Error is handled by the AuthContext
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const roleDescriptions = {
    explorer:
      "Perfect for tourists, travelers, and locals looking to discover Zimbabwe",
    provider:
      "For businesses offering tourism services, accommodations, or experiences",
    guide: "Available only to vetted Local Explorers (application required)", // Aligns with PRD 2.3
    admin: "Administrative access (by invitation only)",
  };

  return (
    <div className="theme-card w-full max-w-md rounded-[30px] p-6 shadow-xl md:p-7">
      <div className="text-center mb-6">
        <h2 className="theme-heading text-2xl font-bold">Join Off2Zim</h2>
        <p className="theme-muted mt-2 text-sm">
          Create your account and start exploring
        </p>
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
        {/* Role Selection */}
        <div>
          <label
            htmlFor="role"
            className="theme-muted mb-1 block text-sm font-medium"
          >
            Account Type
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="theme-input w-full rounded-[18px] px-3 py-2"
          >
            <option value="explorer">Explorer</option>
            <option value="provider">Service Provider</option>
            {/* Aligns with PRD 2.3: Community Guide registration disabled for direct signup */}
            <option value="guide" disabled>
              Community Guide (Apply as Explorer first)
            </option>
            <option value="admin" disabled>
              Administrator
            </option>
          </select>
          <p className="theme-muted mt-1 text-xs">
            {roleDescriptions[formData.role]}
          </p>
        </div>

        {/* Aligns with PRD 2.1: Explorer location identification */}
        {formData.role === "explorer" && (
          <div>
            <label
              htmlFor="explorerType"
              className="theme-muted mb-1 block text-sm font-medium"
            >
              Are you a local or visiting Zimbabwe?
            </label>
            <select
              id="explorerType"
              name="explorerType"
              value={formData.explorerType}
              onChange={handleChange}
              className="theme-input w-full rounded-[18px] px-3 py-2"
            >
              <option value="foreign">Visiting Zimbabwe (Foreign)</option>
              <option value="local">Local Zimbabwean</option>
            </select>
            <p className="theme-muted mt-1 text-xs">
              This helps us tailor your experience
            </p>
          </div>
        )}

        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="First name"
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Last name"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your email"
          />
        </div>

        {/* Aligns with PRD 3.1: Core Company Profile fields for Service Providers */}
        {formData.role === "provider" && (
          <div className="space-y-4 border-t pt-4">
            <h3 className="text-lg font-medium text-gray-900">
              Business Information
            </h3>
            <p className="text-sm text-gray-600">
              This information will be used for your Core Company Profile and
              Basic Review.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="companyName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Company Name *
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Legal company name"
                />
              </div>

              <div>
                <label
                  htmlFor="tradingName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Trading Name
                </label>
                <input
                  type="text"
                  id="tradingName"
                  name="tradingName"
                  value={formData.tradingName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="DBA or trading name"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="businessRegistrationNumber"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Business Registration Number *
              </label>
              <input
                type="text"
                id="businessRegistrationNumber"
                name="businessRegistrationNumber"
                value={formData.businessRegistrationNumber}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Government registration number"
              />
            </div>

            <div>
              <label
                htmlFor="mainContactPerson"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Main Contact Person *
              </label>
              <input
                type="text"
                id="mainContactPerson"
                name="mainContactPerson"
                value={formData.mainContactPerson}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Primary contact person"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="businessPhone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Business Phone *
                </label>
                <input
                  type="tel"
                  id="businessPhone"
                  name="businessPhone"
                  value={formData.businessPhone}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+263..."
                />
              </div>

              <div>
                <label
                  htmlFor="businessEmail"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Business Email *
                </label>
                <input
                  type="email"
                  id="businessEmail"
                  name="businessEmail"
                  value={formData.businessEmail}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="business@company.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="physicalAddress"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Physical Address *
              </label>
              <textarea
                id="physicalAddress"
                name="physicalAddress"
                value={formData.physicalAddress}
                onChange={handleChange}
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Complete physical address of your business"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-700">
                <strong>Next Steps:</strong> After registration, you'll need to
                submit documents for Basic Review before your services can be
                listed on the platform.
              </p>
            </div>
          </div>
        )}

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
              placeholder="Create a password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
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

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10 ${
                formData.confirmPassword &&
                formData.password !== formData.confirmPassword
                  ? "border-red-300"
                  : "border-gray-300"
              }`}
              placeholder="Confirm your password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? (
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
          {formData.confirmPassword &&
            formData.password !== formData.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                Passwords do not match
              </p>
            )}
        </div>

        {/* Terms and Conditions */}
        <div className="flex items-start">
          <input
            type="checkbox"
            id="terms"
            required
            className="rounded border-gray-300 text-blue-600 mt-1"
          />
          <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
            I agree to the{" "}
            <a href="/terms" className="text-blue-600 hover:text-blue-500">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-blue-600 hover:text-blue-500">
              Privacy Policy
            </a>
          </label>
        </div>

        <button
          type="submit"
          disabled={
            isLoading ||
            formData.password !== formData.confirmPassword ||
            (formData.role === "provider" &&
              (!formData.companyName.trim() ||
                !formData.businessRegistrationNumber.trim() ||
                !formData.mainContactPerson.trim() ||
                !formData.businessPhone.trim() ||
                !formData.businessEmail.trim() ||
                !formData.physicalAddress.trim()))
          }
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            Sign in here
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
