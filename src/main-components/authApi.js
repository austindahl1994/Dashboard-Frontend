import axios from "axios";

const login = async (email, password) => {
  try {
    const response = await axios.post(
      "http://localhost:3131/api",
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
  }
};

const logout = async () => {
  try {
    const response = await axios.post("http://localhost:3131/api/logout", {
      withCredentials: true,
    });
    return response.data.message;
  } catch (error) {
    console.error(`Error: ${error}`);
  }
};

const checkSession = async () => {
  try {
    const response = await axios.get(
      "http://localhost:3131/api/test/check-session",
      {
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    console.error(`There was an error of: ${error}`);
    throw error;
  }
};

export { login, logout, checkSession };
