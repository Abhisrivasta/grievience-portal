/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { getProfile } from "../api/auth.api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const updateUser = (userData) => {
    if (!userData) return;

    setUser((prev) => {
      const updatedUser = { ...prev, ...userData };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  const login = (data) => {
    localStorage.setItem("token", data.token);
    updateUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      // Restore user from localStorage
      if (savedUser && savedUser !== "undefined" && savedUser !== "null") {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
        } catch (err) {
          console.error("Invalid stored user:", err);
          localStorage.removeItem("user");
        }
      }

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await getProfile();

        // flexible handling
        const userData = res?.data?.user || res?.data || res;

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
      value={{
        user,
        setUser,     
        updateUser,  
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom hook
export const useAuth = () => useContext(AuthContext);