import axios from 'axios'

const endpoint = process.env.API_URL + '/profile' || "http://localhost:3131/api/profile"
//Pass both id and name to server for all requests to try either one

//Create a profile
//Returns object {affectedRows: int (1 if successful), insertId}
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

//Get a profile by id or name
//Returns single object of profile record {id, name, properties (JSON), time_updated}
const getProfile = async (id, name) => {
	try {
  	const response = await axios.get(`${endpoint}/${encodeURIComponent(id)}/${encodeURIComponent(name)}`)
	  return response.data
  } catch (error) {
	  console.error(`Error getting profile: ${error}`)
  }
}

//Gets recent profile ids and names to list for availability to load or create based on the template
//returns array of objects [{id: number, name: string}]
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

//Updates entire character profile, will update name or entire properties JSON so PUT instead of PATCH
//returns object { affectedRows: int (1 if successful) }
const updateProfile = async (id, name) => {
	try {
		const response = await axios.put(`${endpoint}/update/${encodeURIComponent(id)}/${encodeURIComponent(name)}`)
		return response.data
	} catch (error) {
		console.error(error)
	}
}

//Deletes character profile based on id or name
//returns object { affectedRows: int (1 if successful) }
const deleteProfile = async (id, name) => {
	try {
		const response = await axios.put(`${endpoint}/update/${encodeURIComponent(id)}/${encodeURIComponent(name)}`)
		return response.data
	} catch (error) {
		console.error(error)
	}
}



export { createProfile, getProfile, getRecentProfiles }
