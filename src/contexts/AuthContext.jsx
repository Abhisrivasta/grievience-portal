/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { getProfile } from "../api/auth.api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Safely update user
  const updateUser = (userData) => {
    if (!userData || !userData.role) {
      console.error("Invalid user data:", userData);
      return;
    }

    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  // ✅ Login
  const login = (data) => {
    localStorage.setItem("token", data.token);
    updateUser(data.user);
  };

  // ✅ Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  // ✅ On app load → restore + verify user
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      // 🔹 Step 1: restore from localStorage (fast UI)
      if (savedUser && savedUser !== "undefined" && savedUser !== "null") {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
        } catch (err) {
          console.error("Invalid stored user:", err);
          localStorage.removeItem("user");
        }
      }

      // 🔹 Step 2: verify with backend
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await getProfile();

        // 🔥 CRITICAL FIX (handle both response shapes)
        const userData = res.data.user || res.data;

        updateUser(userData);
      } catch (err) {
        console.error("Verification failed", err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
