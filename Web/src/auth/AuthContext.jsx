import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  getCurrentUserApi,
  loginApi,
  registerApi,
  logoutApi,
  switchRoleApi,
} from "../api/authApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const res = await getCurrentUserApi();
      if (res?.user) {
        setUser(res.user);
        if (res.user.activeRole) {
          localStorage.setItem("activeRole", res.user.activeRole);
        }
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Auth initialization error:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (email, password, role) => {
    const res = await loginApi(email, password, role);
    await fetchUser();
    return res;
  };

  const register = async (username, email, password, role) => {
    const res = await registerApi(username, email, password, role);
    await fetchUser();
    return res;
  };

  const logout = async () => {
    await logoutApi();
    setUser(null);
  };

  const switchRole = async (targetRole) => {
    const res = await switchRoleApi(targetRole);
    await fetchUser();
    return res;
  };

  const isVerified = user ? user.isVerified !== false : false;
  const isProfileCompleted = user
    ? Boolean(user.isProfileCompleted || (user.firstName && user.lastName))
    : false;
  const activeRole = user?.activeRole || user?.role || localStorage.getItem("activeRole") || "buyer";

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isVerified,
        isProfileCompleted,
        activeRole,
        login,
        register,
        logout,
        switchRole,
        refreshUser: fetchUser,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
