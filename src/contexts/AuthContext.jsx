/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { getProfile } from "../api/auth.api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ FIX 3: updateUser — fresh server data always wins over stale prev
  // spread order: prev first, then userData overwrites, then location merged
  // This was structurally correct before but initAuth was bypassing it (see below)
  const updateUser = (userData) => {
    if (!userData) return;

    setUser((prev) => {
      const updatedUser = {
        ...(prev || {}),
        ...userData,
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

      // No token — restore from localStorage as offline fallback only
      if (!token) {
        if (savedUser && savedUser !== "undefined" && savedUser !== "null") {
          try {
            setUser(JSON.parse(savedUser));
          } catch {
            localStorage.removeItem("user");
          }
        }
        setLoading(false);
        return;
      }

      // Has token — restore from localStorage first for fast initial render
      if (savedUser && savedUser !== "undefined" && savedUser !== "null") {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          localStorage.removeItem("user");
        }
      }

      try {
        // ✅ FIX 3: Always replace with fresh server data — never merge with stale localStorage
        // Previously, updateUser(userData) was called here which merged prev (stale localStorage)
        // into server response. On second save this caused old profilePhoto/name to reappear.
        const userData = await getProfile();
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
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