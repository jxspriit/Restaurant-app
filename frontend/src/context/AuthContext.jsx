import { createContext, useContext, useState, useEffect } from "react";
import * as authApi from "../api/authApi.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem("copperleaf_token");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await authApi.getMe();
        setUser(data.user);
      } catch {
        localStorage.removeItem("copperleaf_token");
        localStorage.removeItem("copperleaf_user");
      } finally {
        setLoading(false);
      }
    };
    restoreSession();
  }, []);

  const login = async (credentials) => {
    const { data } = await authApi.login(credentials);
    localStorage.setItem("copperleaf_token", data.token);
    localStorage.setItem("copperleaf_user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const register = async (details) => {
    const { data } = await authApi.register(details);
    localStorage.setItem("copperleaf_token", data.token);
    localStorage.setItem("copperleaf_user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("copperleaf_token");
    localStorage.removeItem("copperleaf_user");
    setUser(null);
    authApi.logout().catch(() => {});
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("copperleaf_user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        loading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
