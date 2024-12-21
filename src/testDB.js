import axios from 'axios'
const testHttp = "http://localhost:3131/api"

const profileHome = async () => {
  try {
    const response = await axios.get(`${testHttp}/profile`)
    console.log(response.data.message);
  } catch (error) {
    console.error(`There was an error of: ${error}`);
    throw error;
  }
};

export { profileHome }