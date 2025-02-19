import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

const login = async (email, password) => {
  console.log(`trying login`)
  try {
    const response = await axios.post(
      apiUrl + "/auth/login",
      {
        email: email,
        password: password,
      },
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Login error: ${error}`);
    throw error
  }
};

const logout = async () => {
  try {
    const response = await axios.post(
      apiUrl + "/auth/logout",
      {},
      {
        withCredentials: true,
      }
    );
    return response.data.message;
  } catch (error) {
    console.error(`Error: ${error}`);
  }
};

const checkSession = async () => {
  console.log(`trying session check`)
  try {
    const response = await axios.get(apiUrl + "/check-session", {
      withCredentials: true,
    });
    return response.data; 
  } catch (error) {
    if (error.response && error.response.status === 401) {
      //console.log("User is not authenticated, redirecting to login.");
      throw new Error("No user logged in.");
    } else {
      //console.error("Error during session check:", error.message);
      throw error; 
    }
  }
};


export { login, logout, checkSession };
