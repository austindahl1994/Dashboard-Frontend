import axios from "axios";
import { convertForFrontendSettings } from "./widgets/ExpenseTracker/dataConversion";
const apiUrl = import.meta.env.VITE_API_URL;

// Runtime diagnostic: print resolved API base URL so deployed builds show which
// backend they're targeting (useful for Amplify builds where VITE_* vars are baked at build time)
try {
  console.log("VITE_API_URL:", apiUrl);
} catch (err) {
  /* ignore */
  console.log(err);
}

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
export const updateSettings = async ({ settings, location }) => {
  const widgetName = location;
  const data = settings;
  //console.log(`Update settings called with ${location}, data of: ${settings}`);
  const response = await api.put(
    `/widgetSettings/update/${encodeURIComponent(widgetName)}`,
    { data },
  );
  return response.data;
};

export const getSettings = async (widgetName) => {
  const response = await api.get(
    `/widgetSettings/get/${encodeURIComponent(widgetName)}`,
  );
  return convertForFrontendSettings(response.data);
};
// #endregion
// #region Character Generation ----------------------------
export const saveProfile = async (name, properties) => {
  try {
    const response = await api.post(
      `/profile/save/${encodeURIComponent(name)}`,
      {
        properties,
      },
    );
    return response.data;
  } catch (err) {
    const msg =
      err?.response?.data?.message || err?.message || "saveProfile failed";
    console.error("saveProfile error:", msg);
    throw err;
  }
};

export const getProfile = async (name) => {
  try {
    const response = await api.get(`/profile/${encodeURIComponent(name)}`);
    return response.data;
  } catch (err) {
    const msg =
      err?.response?.data?.message || err?.message || "getProfile failed";
    console.error("getProfile error:", msg);
    throw err;
  }
};

export const getRecentProfiles = async () => {
  try {
    const response = await api.get("/profile/recent");
    return response.data;
  } catch (err) {
    const msg =
      err?.response?.data?.message ||
      err?.message ||
      "getRecentProfiles failed";
    console.error("getRecentProfiles error:", msg);
    throw err;
  }
};

export const deleteProfile = async (name) => {
  try {
    const response = await api.delete(
      `/profile/delete/${encodeURIComponent(name)}`,
    );
    return response.data;
  } catch (err) {
    const msg =
      err?.response?.data?.message || err?.message || "deleteProfile failed";
    console.error("deleteProfile error:", msg);
    throw err;
  }
};
// #endregion
// #region Expense Tracker ----------------------------
export const getExpenses = async () => {
  const response = await api.get("/expenses");
  return response.data;
};

export const saveExpenses = async ({ year, month, data }) => {
  const response = await api.put(
    `/expenses/update/${encodeURIComponent(year)}/${encodeURIComponent(month)}`,
    { data },
  );
  return response.data;
};

// #endregion
// #endregion

// #region Vingo ----------------------------
export const getBoard = async () => {
  const response = await api.get(`/bingo/board`);
  return response.data;
};

export const getTeam = async ({ passcode }) => {
  // console.log(`Called Get player in API`);
  const response = await api.post(`/bingo/team`, { passcode });
  // console.log(`Returned data: ${JSON.stringify(response.data)}`);
  return response.data;
};

export const getCompletions = async ({ passcode, adminTeam = undefined }) => {
  // console.log(`Called Get completions in API`);
  const response = await api.post(`/bingo/completions`, {
    passcode,
    adminTeam,
  });
  return response.data;
};

export const getShame = async ({ passcode, adminTeam = undefined }) => {
  const response = await api.post(`/bingo/shame`, { passcode, adminTeam });
  return response.data;
};

export const getHighscores = async () => {
  const response = await api.get(`/bingo/highscores`);
  return response.data;
};

export const postCompletion = async (data) => {
  try {
    const response = await api.post(`/bingo/webImage`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    // If server encodes success in the payload, treat explicit failure as error
    if (response && response.data && response.data.success === false) {
      const msg = response.data.message || "Upload failed";
      throw new Error(msg);
    }

    return response.data;
  } catch (err) {
    // Normalize axios/network errors to a thrown Error with useful message
    const message =
      err?.response?.data?.message || err?.message || "Upload failed";
    throw new Error(message);
  }
};

//ADMIN ACTIONS

export const getStates = async ({ passcode }) => {
  const response = await api.post(`/bingo/admin/states`, { passcode });
  return response.data;
};

export const getPlayers = async ({ passcode }) => {
  const response = await api.post(`/bingo/admin/players`, { passcode });
  return response.data;
};

export const adminRefresh = async ({ passcode, targets }) => {
  // console.log(`Admin refresh call maid with targets: ${targets}`);
  const response = await api.post(`/bingo/admin/refresh`, {
    passcode,
    targets,
  });
  return response.data;
};

export const adminDelete = async ({ passcode, url }) => {
  const response = await api.post(`/bingo/admin/delete`, {
    passcode,
    url,
  });
  return response.data;
};

// #endregion
export const getBSBoard = async () => {
  const response = await api.post(`/battleship/board`);
  return response.data;
};

export const getBSData = async () => {
  const response = await api.post(`/battleship/data`);
  return response.data;
};
//get all the data, each month/year combination
//allow user to save month year to database, overrides current
//When user saves categories, will combine categories object and subcat object, this way we keep track of which categories have which subcategories, and what strings are a part of which subcategories
//Widget table will contain the settings for categories
