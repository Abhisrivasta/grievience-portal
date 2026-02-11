import { createContext, useContext, useEffect, useState } from "react";
import { getProfile } from "../api/auth.api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Safe Initial State: JSON.parse error se bachne ke liye logic
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      // Check if null, undefined string, or empty
      if (savedUser && savedUser !== "undefined" && savedUser !== "null") {
        return JSON.parse(savedUser);
      }
    } catch (error) {
      console.error("AuthContext: Error parsing user from localStorage", error);
      localStorage.removeItem("user"); // Cleanup corrupt data
    }
    return null;
  });

  const [loading, setLoading] = useState(true);

  // Helper: State aur LocalStorage dono ko ek saath sync rakhne ke liye
  const updateUser = (userData) => {
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    }
  };

  const login = (data) => {
    localStorage.setItem("token", data.token);
    updateUser(data.user);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  // On app load, verify user via backend
  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await getProfile();
        // Backend response: res.data (if it directly returns the user)
        // or res.data.data (if wrapped). Assuming res.data for now based on your getProfile
        updateUser(res.data);
      } catch (err) {
        console.error("Verification failed", err);
        logout(); // Token invalid hai toh saaf kar do
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, setUser, updateUser, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);