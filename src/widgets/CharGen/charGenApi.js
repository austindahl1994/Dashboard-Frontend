// import axios from "axios";

// const endpoint = import.meta.env.VITE_API_URL + "/profile";
// //   import.meta.env.API_URL + "/profile" ||
// //Pass both id and name to server for all requests to try either one

// //Create a profile
// //Returns object {affectedRows: int (1 if successful), insertId}
// const createProfile = async (name, properties) => {
//   try {
//     const response = await axios.post(
//       `${endpoint}/createProfile/${encodeURIComponent(name)}`,
//       {
//         properties,
//       },
//       { withCredentials: true }
//     );
//     return { success: true, data: response.data };
//   } catch (error) {
//     console.log(`Could not create profile`);
//     return { sucess: false, error: error };
//   }
// };

// //Get a profile by id or name
// //Returns single object of profile record {name, properties (JSON), time_updated}
// const getProfile = async (name) => {
//   try {
//     console.log(`Sending ${name}`);
//     const response = await axios.get(
//       `${endpoint}/${encodeURIComponent(name)}`,
//       { withCredentials: true }
//     );
//     console.log(`${response.data}`);
//     return { success: true, data: response.data };
//   } catch (error) {
//     return { sucess: false, error: error };
//   }
// };

// //Gets recent profile ids and names to list for availability to load or create based on the template
// //returns array of objects [{id: number, name: string}]
// const getRecentProfiles = async (limit) => {
//   try {
//     const response = await axios.get(`${endpoint}/recent`, {
//       params: { limit },
//     });
//     return { success: true, data: response.data };
//   } catch (error) {
//     return { sucess: false, error: error };
//   }
// };

// //Updates entire character profile, will update name or entire properties JSON so PUT instead of PATCH
// //returns object { affectedRows: int (1 if successful) }
// const updateProfile = async (name, data) => {
//   try {
//     const response = await axios.put(`${endpoint}/${encodeURIComponent(name)}`,
//       {
//         properties: data
//       },
//       {
//         withCredentials: true
//       }
//     );
//     console.log(`Error updating`)
//     return { success: true, data: response.data };
//   } catch (error) {
//     console.log(`Successfully updated profile`)
//     return { sucess: false, error: error };
//   }
// };

// //Deletes character profile based on id or name
// //returns object { affectedRows: int (1 if successful) }
// const deleteProfile = async (name) => {
//   console.log(`Tried deleting with name: ${name}`)
//   try {
//     const response = await axios.delete(
//       `${endpoint}/delete/${encodeURIComponent(name)}`,
//       { withCredentials: true }
//     );
//     console.log(`Successfully deleted on axios`);
//     return { success: true, data: response.data };
//   } catch (error) {
//     console.log(`Could not delete on axios`);
//     return { sucess: false, error: error };
//   }
// };

// export {
//   createProfile,
//   getProfile,
//   getRecentProfiles,
//   updateProfile,
//   deleteProfile,
// };
