// src/services/auth.js
import api from "./http";

// ✅ Register (backend expects `full_name`)
export async function register({ full_name, email, password }) {
  const { data } = await api.post("/auth/register", {
    full_name,
    email,
    password,
  });
  return data;
}

// ✅ Login
export async function login({ email, password }) {
  const { data } = await api.post("/auth/login", { email, password });
  if (data?.access_token) {
    // store consistently
    localStorage.setItem("hl_token", data.access_token);
  }
  return data;
}

// ✅ Logout
export function logout() {
  localStorage.removeItem("hl_token");
}
