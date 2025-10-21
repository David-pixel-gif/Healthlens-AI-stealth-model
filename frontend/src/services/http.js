// ==========================================================
// File: src/services/http.js
// ==========================================================

import axios from "axios";

/**
 * ----------------------------------------------------------
 * 🌐 BASE URL RESOLUTION
 * ----------------------------------------------------------
 * This section ensures the frontend always communicates
 * with the correct backend URL, whether in local dev or prod.
 *
 * 1️⃣ First checks environment variables (Vite-style)
 * 2️⃣ Falls back to local FastAPI default: http://127.0.0.1:8000
 * 3️⃣ Appends `/api` automatically if not already present
 * ----------------------------------------------------------
 */
const rawBase =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_BASE ||
  "http://127.0.0.1:8000"; // ✅ fallback for local dev

// ✅ Remove trailing slash if present (avoids "//" in requests)
const normalizedBase = String(rawBase).replace(/\/$/, "");

// ✅ Ensure `/api` prefix (since backend routes start with /api/)
const baseURL = normalizedBase.endsWith("/api")
  ? normalizedBase
  : `${normalizedBase}/api`;

// ----------------------------------------------------------
// 🚀 AXIOS INSTANCE
// ----------------------------------------------------------
// Centralized HTTP client used throughout the app.
// This prevents having to repeat baseURL, headers, or tokens.
// ----------------------------------------------------------
const api = axios.create({
  baseURL, // e.g., http://127.0.0.1:8000/api
  withCredentials: true, // enables cookie/session support if needed
  headers: {
    Accept: "application/json",
  },
});

// ----------------------------------------------------------
// 🔐 REQUEST INTERCEPTOR
// ----------------------------------------------------------
// Attaches Bearer token automatically from localStorage
// for every outgoing authenticated request.
// ----------------------------------------------------------
api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("access_token") ||
    localStorage.getItem("access") ||
    null;

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ----------------------------------------------------------
// ⚠️ RESPONSE INTERCEPTOR (Optional)
// ----------------------------------------------------------
// Provides detailed console output for API issues.
// You can later swap this with toast or modal alerts.
// ----------------------------------------------------------
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error(
        `❌ API Error [${error.response.status}] at ${
          error.response.config?.url || "unknown URL"
        }`,
        error.response.data
      );
    } else if (error.request) {
      console.error("⚠️ No response received from API:", error.request);
    } else {
      console.error("🚨 Request setup error:", error.message);
    }

    // Always reject to allow caller-level handling
    return Promise.reject(error);
  }
);

// ----------------------------------------------------------
// 🧠 Developer Debug Info
// ----------------------------------------------------------
console.info("✅ Axios initialized with baseURL:", baseURL);

// ----------------------------------------------------------
// ✅ EXPORT
// ----------------------------------------------------------
export default api;
