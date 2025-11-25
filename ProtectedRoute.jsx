import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;
  if (!user) return <Navigate to="/loginpage" replace />;
  return children;
}
