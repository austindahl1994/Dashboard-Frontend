import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

//-------------AUTHORIZATION-------------------
export const login = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
};

export const logout = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

export const getSession = async () => {
  const response = await api.get("/check-session");
  return response.data;
};

//----------------WIDGETS----------------------
export const updateSettings = async (widgetName, data) => {
  const response = await api.post(
    `/widgetSettings/updateSettings/${encodeURIComponent(widgetName)}`,
    { data }
  );
  return response.data;
};

export const getSettings = async (widgetName) => {
  const response = await api.get(
    `/widgetSettings/getSettings/${encodeURIComponent(widgetName)}`
  );
  return response.data;
};

//----------------CHARACTER GEN----------------
export const createProfile = async (name, properties) => {
  const response = await api.post(
    `/profile/createProfile/${encodeURIComponent(name)}`,
    { properties }
  );
  //console.log(response.data)
  return response.data;
};

export const getProfile = async (name) => {
  const response = await api.get(`/profile/${encodeURIComponent(name)}`);
  return response.data;
};

export const getRecentProfiles = async () => {
  const response = await api.get("/profile/recent");
  //console.log(response.data)
  return response.data;
};

export const updateProfile = async (name, data) => {
  const response = await api.post(
    `/profile/${encodeURIComponent(name)}`,
    { data }
  );
  return response.data;
};

export const deleteProfile = async (name) => {
  const response = await api.delete(
    `/profile/delete/${encodeURIComponent(name)}`
  );
  return response.data;
};

//----------------EXPENSE TRACKER---------------
export const getExpenses = async () => {
  const response = await api.get("/expenses");
  return response.data;
};

//get all the data, each month/year combination
//allow user to save month year to database, overrides current
//When user saves categories, will combine categories object and subcat object, this way we keep track of which categories have which subcategories, and what strings are a part of which subcategories
//Widget table will contain the settings for categories
