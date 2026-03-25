"use client";

import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: "login" | "register";
  redirectTo?: string;
}

const AuthModal = ({
  isOpen,
  onClose,
  defaultMode = "login",
  redirectTo,
}: AuthModalProps) => {
  const [mode, setMode] = useState<"login" | "register">(defaultMode);

  useEffect(() => {
    setMode(defaultMode);
  }, [defaultMode]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        {/* Modal Header */}
        <div className="text-center pt-8 pb-4 px-6">
          <h1 className="text-2xl font-bold text-gray-900">Off2Zim</h1>
          <p className="text-sm text-gray-600 mt-1">
            Explore | Experience | Enjoy
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-gray-100 mx-6 rounded-lg p-1 mb-6">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              mode === "login"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode("register")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              mode === "register"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form Content */}
        <div className="px-6 pb-8">
          {mode === "login" ? (
            <LoginForm onClose={onClose} redirectTo={redirectTo} />
          ) : (
            <RegisterForm onClose={onClose} redirectTo={redirectTo} />
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-xl">
          <p className="text-xs text-gray-500 text-center">
            © 2024 Off2Zim. Your trusted digital gateway to authentic
            Zimbabwean experiences.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
