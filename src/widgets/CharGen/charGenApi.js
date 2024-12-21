import axios from "axios";
const endpoint = "http://localhost:3131/api";

const createProfile = async (name, properties) => {
  try {
    const response = await axios.post(
      `${endpoint}/profile/create`,
      {
        name: name,
        properties: properties,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.message;
  } catch (error) {
    console.error(`There was an error of: ${error}`);
    throw error;
  }
};

const getProfile = async (name) => {
    try {
        const response = await axios.get(`${endpoint}/profile/${name}`)
        console.log(``)
        return response.data;
    } catch (error) {
        console.error(`Error fetching data from backend: ${error.mess}`)
    }
}

export { createProfile, getProfile };
