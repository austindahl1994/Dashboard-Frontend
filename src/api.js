import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

//-------------AUTHORIZATION-------------
export const login = (email, password) =>
  api.post("/auth/login", { email, password });
export const logout = () => api.post("/auth/logout");
export const checkSession = () => api.get("/check-session");

//----------------WIDGETS----------------

//----------------CHARACTER GEN----------------
export const createProfile = (name, properties) =>
  api.post(`/profile/createProfile/${encodeURIComponent(name)}`, {
    properties,
  });
export const getProfile = (name) =>
  api.get(`/profile/${encodeURIComponent(name)}`);
export const getRecentProfiles = (limit) =>
  api.get("/profile/recent", { params: { limit } });
export const updateProfile = (name, data) =>
  api.post(`/profile/${encodeURIComponent(name)}`, { data });
export const deleteProfile = (name) =>
  api.delete(`/profile/delete/${encodeURIComponent(name)}`);
