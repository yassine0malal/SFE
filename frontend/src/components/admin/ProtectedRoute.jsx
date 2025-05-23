import React from "react";
import { Navigate, useLocation } from "react-router-dom";

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

const allowedBases = [
  "/",
  "/abonnes",
  "/services",
  "/contact",
  "/clients",
  "/galerie",
  "/publications",
  "/commentaires",
  // add other allowed base paths here
];

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const token = getCookie("auth_token");

  // If the user is on the login page, do not check the token
//   if (location.pathname === "/login") {
//     return children;
//   }

  // If not logged in, redirect to login
  if (!token) {
    // Redirect to login page
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Allow if the path starts with any allowed base (including subroutes)
  if (!allowedBases.some(base =>
    location.pathname === base || location.pathname.startsWith(base + "/")
  )) {
    return <Navigate to="/notfound" replace />;
  }

  return children;
}