/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { getProfile } from "../api/auth.api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Deep merge — location jaise nested objects sahi se merge honge
  const updateUser = (userData) => {
    if (!userData) return;

    setUser((prev) => {
      const updatedUser = {
        ...prev,
        ...userData,
        // ✅ location ko alag se merge karo
        location: {
          ...(prev?.location || {}),
          ...(userData?.location || {}),
        },
      };
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

      // Pehle localStorage se restore karo (fast UI)
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
        // ✅ getProfile already res.data.data return karta hai — direct use karo
        const userData = await getProfile();
        updateUser(userData);
      } catch (err) {
        console.error("Token verification failed:", err);
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

export const useAuth = () => useContext(AuthContext);