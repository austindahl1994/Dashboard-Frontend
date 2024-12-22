import axios from 'axios'

const endpoint = process.env.API_URL + '/profile' || "http://localhost:3131/api/profile"

const createProfile = async (name, properties) => {
	try {
		const response = await axios.post(`${endpoint}/createProfile`, { 
      name, 
      properties 
    })
    return response.data	
  } catch (error) {
	  console.log('Some error msg')
  }
}

const getProfile = async (name, id) => {
	try {
  	const response = await axios.get(`${endpoint}/${name}/${id}`)
	  return response.data
  } catch (error) {
	  console.error(`Error getting profile: ${error}`)
  }
}

const getRecentProfiles = async (limit) => {
	try {
		const response = await axios.get(`${endpoint}/recent`, {
      params: { limit }
    })
	    return response.data
    } catch (error) {
	    console.error(error)
  }
}

export { createProfile, getProfile }
