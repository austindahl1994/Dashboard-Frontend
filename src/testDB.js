import axios from 'axios'
const testHttp = "http://localhost:3131/api"

export const testDB = async () => {
    console.log('Testing DB...')
    try {
        const response = await axios.get(`${testHttp}/test`)
        console.log(response.data)
    } catch (error) {
        if (error.response) {
          // If there's a response from the server (e.g., 404, 500)
          console.error(
            `Error response: ${error.response.status} - ${error.response.data}`
          );
        } else if (error.request) {
          // If no response was received (e.g., network issues)
          console.error("No response from server:", error.request);
        } else {
          // If an error occurred while setting up the request
          console.error("Error setting up request:", error.message);
        }
    }
}

export const getUser = async (id) => {
    console.log("Calling get user")
    try {
        const response = await axios.get(`${testHttp}/user`, {
            params: {id}
        });
        console.log(`User chosen is ${response.data.user}`)
    } catch (error) {
        console.log(`There was an error of: ${error}`)
    }
}