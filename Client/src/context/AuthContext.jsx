import { createContext, useContext, useState, useEffect } from "react";
import apiClient from "../lib/axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // When the site opens, check if a saved login is still valid
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setLoading(false);
      return;
    }

    apiClient
      .get("/auth/me")
      .then(({ data }) => setUser(data))
      .catch(() => localStorage.removeItem("accessToken"))
      .finally(() => setLoading(false));
  }, []);

  // Saves the token and remembers the user
  const startSession = (data) => {
    const { accessToken, ...profile } = data;
    localStorage.setItem("accessToken", accessToken);
    setUser(profile);
    return profile;
  };

  const login = async (credentials) => {
    const { data } = await apiClient.post("/auth/login", credentials);
    return startSession(data);
  };

  const register = async (details) => {
    const { data } = await apiClient.post("/auth/register", details);
    return startSession(data);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  const updateUser = (updatedData) => {
    setUser((prevUser) => ({ ...prevUser, ...updatedData }));
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
