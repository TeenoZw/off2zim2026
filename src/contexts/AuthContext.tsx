"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";
import {
  AuthContextType,
  AuthState,
  LoginCredentials,
  RegisterData,
  User,
  UserProfile,
  UserRole,
  ExplorerType,
  VerificationStatus,
  ExplorerScore,
} from "@/types/auth";

// Create AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: User }
  | { type: "LOGIN_ERROR"; payload: string }
  | { type: "LOGOUT" }
  | { type: "UPDATE_PROFILE"; payload: Partial<User> }
  | { type: "SET_LOADING"; payload: boolean };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, isLoading: true, error: null };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case "LOGIN_ERROR":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case "UPDATE_PROFILE":
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for stored authentication on mount
  useEffect(() => {
    const checkStoredAuth = () => {
      try {
        const storedUser = localStorage.getItem("off2zim_user");
        const storedToken = localStorage.getItem("off2zim_token");

        if (storedUser && storedToken) {
          const user = JSON.parse(storedUser);
          dispatch({ type: "LOGIN_SUCCESS", payload: user });
        } else {
          dispatch({ type: "SET_LOADING", payload: false });
        }
      } catch (error) {
        console.error("Error checking stored auth:", error);
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    checkStoredAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: "LOGIN_START" });

    try {
      // Simulate API call - In real implementation, this would be an actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock user data based on email - In real app, this comes from the API
      const mockUser: User = {
        id: `user_${Date.now()}`,
        email: credentials.email,
        firstName: credentials.email.includes("provider")
          ? "Business"
          : credentials.email.includes("guide")
            ? "Local"
            : "Explorer",
        lastName: credentials.email.includes("provider")
          ? "Owner"
          : credentials.email.includes("guide")
            ? "Guide"
            : "User",
        role: credentials.email.includes("provider@")
          ? "provider"
          : credentials.email.includes("guide@")
            ? "guide"
            : credentials.email.includes("admin@")
              ? "admin"
              : "explorer",
        isVerified: true,
        verificationStatus: credentials.email.includes("provider")
          ? "verified_premium"
          : "basic_approved",
        hasVerifiedBadge: credentials.email.includes("provider"),
        verifiedBadgeExpiresAt: credentials.email.includes("provider")
          ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
          : undefined,
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        profile: {
          bio: "Welcome to Off2Zim!",
          location: "Zimbabwe",
          interests: ["Travel", "Adventure"],
          languages: ["English"],
        },
        verification: {
          email: true,
          phone: credentials.email.includes("provider"),
          identity: credentials.email.includes("provider"),
          business: credentials.email.includes("provider"),
        },
        explorerScore:
          !credentials.email.includes("provider") &&
          !credentials.email.includes("admin")
            ? {
                rating: 5.0,
                completedBookings: 0,
                cancelledBookings: 0,
                reviewsReceived: 0,
                lastUpdated: new Date().toISOString(),
              }
            : undefined,
      };

      // Store user data
      localStorage.setItem("off2zim_user", JSON.stringify(mockUser));
      localStorage.setItem("off2zim_token", "mock_token_" + Date.now());

      dispatch({ type: "LOGIN_SUCCESS", payload: mockUser });
    } catch (error) {
      dispatch({
        type: "LOGIN_ERROR",
        payload: "Login failed. Please try again.",
      });
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    dispatch({ type: "LOGIN_START" });

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Aligns with PRD requirements for new user creation
      const newUser: User = {
        id: `user_${Date.now()}`,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        isVerified: false,
        // Aligns with PRD 3.3: New users start with pending verification
        verificationStatus: "pending",
        hasVerifiedBadge: false,
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        profile: {
          bio: "",
          location: "",
          interests: [],
          languages: ["English"],
          // Aligns with PRD 3.1: Store Core Company Profile for providers
          ...(data.role === "provider" && {
            companyName: data.companyName,
            tradingName: data.tradingName,
            businessRegistrationNumber: data.businessRegistrationNumber,
            mainContactPerson: data.mainContactPerson,
            businessPhone: data.businessPhone,
            businessEmail: data.businessEmail,
            physicalAddress: data.physicalAddress,
          }),
        },
        verification: {
          email: false,
          phone: false,
          identity: false,
          business: data.role === "provider" ? false : undefined,
        },
        // Aligns with PRD 2.1: Initialize Explorer Score for explorers
        explorerScore:
          data.role === "explorer"
            ? {
                rating: 0,
                completedBookings: 0,
                cancelledBookings: 0,
                reviewsReceived: 0,
                lastUpdated: new Date().toISOString(),
              }
            : undefined,
      };

      localStorage.setItem("off2zim_user", JSON.stringify(newUser));
      localStorage.setItem("off2zim_token", "mock_token_" + Date.now());

      dispatch({ type: "LOGIN_SUCCESS", payload: newUser });
    } catch (error) {
      dispatch({
        type: "LOGIN_ERROR",
        payload: "Registration failed. Please try again.",
      });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("off2zim_user");
    localStorage.removeItem("off2zim_token");
    dispatch({ type: "LOGOUT" });
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!state.user) return;

    try {
      const updatedUser = {
        ...state.user,
        profile: { ...state.user.profile, ...updates },
      };
      localStorage.setItem("off2zim_user", JSON.stringify(updatedUser));
      dispatch({
        type: "UPDATE_PROFILE",
        payload: { profile: { ...state.user.profile, ...updates } },
      });
    } catch (error) {
      console.error("Profile update failed:", error);
    }
  };

  const hasRole = (role: UserRole | UserRole[]): boolean => {
    if (!state.user) return false;
    if (Array.isArray(role)) {
      return role.includes(state.user.role);
    }
    return state.user.role === role;
  };

  const isVerified = (): boolean => {
    return state.user?.isVerified || false;
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    hasRole,
    isVerified,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
