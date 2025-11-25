import React, { createContext, useState, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.setToken(token);
      api.get("/profile")
        .then((res) => setUser(res.data))
        .catch(() => {
          localStorage.removeItem("token");
          api.setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post("/authen/loginpage", {
        email: email.trim(),
        password: password.trim(),
      });
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      api.setToken(token);
      setUser(user);
      return user;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Login failed");
    }
  };

  const register = async (payload) => {
    try {
      const res = await api.post("/authen/reg", payload);
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      api.setToken(token);
      setUser(user);
      return user;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Registration failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    api.setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
