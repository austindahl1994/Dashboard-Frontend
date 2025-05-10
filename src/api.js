import axios from "axios";
import { convertForFrontendSettings } from "./widgets/ExpenseTracker/dataConversion";
const apiUrl = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// #region Authorization ----------------------------
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
// #endregion
// #region ALL Widgets ----------------------------
// #region Widget Settings ----------------------------
export const updateSettings = async ({settings, location}) => {
  const widgetName = location
  const data = settings
  //console.log(`Update settings called with ${location}, data of: ${settings}`);
  const response = await api.put(
    `/widgetSettings/update/${encodeURIComponent(widgetName)}`,
    { data }
  );
  return response.data;
};

export const getSettings = async (widgetName) => {
  const response = await api.get(
    `/widgetSettings/get/${encodeURIComponent(widgetName)}`
  );
  return convertForFrontendSettings(response.data);
};
// #endregion
// #region Character Generation ----------------------------
export const saveProfile = async (name, properties) => {
  const response = await api.post(
    `/profile/save/${encodeURIComponent(name)}`,
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

export const deleteProfile = async (name) => {
  const response = await api.delete(
    `/profile/delete/${encodeURIComponent(name)}`
  );
  return response.data;
};
// #endregion
// #region Expense Tracker ----------------------------
export const getExpenses = async () => {
  const response = await api.get("/expenses");
  return response.data;
};

export const saveExpenses = async ({ year, month }) => {
  const response = await api.put(`/expenses/update/${encodeURIComponent(year)}/${encodeURIComponent(month)}`)
  return response.data
}
// #endregion
// #endregion

//get all the data, each month/year combination
//allow user to save month year to database, overrides current
//When user saves categories, will combine categories object and subcat object, this way we keep track of which categories have which subcategories, and what strings are a part of which subcategories
//Widget table will contain the settings for categories
