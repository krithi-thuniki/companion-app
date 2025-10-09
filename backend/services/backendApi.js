// src/services/backendApi.js

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000/api";

/**
 * Generic API handler for your backend (tasks, saved, etc.)
 */
export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BACKEND_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("API error:", errorText);
    throw new Error(errorText || "Request failed");
  }

  return response.json();
};
