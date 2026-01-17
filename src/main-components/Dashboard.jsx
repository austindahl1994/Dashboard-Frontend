//List all widget objects saved in DB, iterate through and show cards for each, the card content dependent on content
import { Route, Routes } from "react-router-dom";
//import { useState, useEffect } from 'react'
import Navbar from "./Navbar";
import CharacterGeneration from "../widgets/CharGen/CharacterGeneration"; //elsewhere
import "../main-styles/dashboard.css";
import ExpenseTracker from "../widgets/ExpenseTracker/ExpenseTracker";
import { ExpenseProvider } from "../widgets/ExpenseTracker/ExpenseContext";
/*
widgets table
[{
  id INT AUTO_INCREMENT PRIMARY KEY, 
  user_id INT NOT NULL,
  widget_config JSON, //name, position, preferences (default weather location etc)
  FOREIGN KEY (user_id) references users(user_id)
}]

SELECT u.email, u.password, w.widget_config 
FROM users u
LEFT JOIN widgets w ON u.id = w.user_id
WHERE u.email = ?

-------------
Widgets.jsx
-------------
import { Link } from 'react-router-dom'
import Weather from './widgets/weather/Weather'
allWidgets = {
  weather: {
    path: '/weather',
    component: Weather
  },
  ...
}

widgets.forEach((widgetName, index) => (
const {path, component: WidgetComponent} = allWidgets[widgetName]
<Link to={path}
))
Still need to define the routes for each widget
*/
//Have a WidgetContext state that will import widgets added from DB, pass into navbar
//Navbar will have list of them that user can click on to go to specific ones/settings

//Widgets appear as cards, each card with specifics? e.stopPropagation() for cards
//that have other clickable elements
//Can start with each widgets just being text, then add more like showing weather etc

//Switchcase in widgets for the DB widgets records
//dashboard.widgets table has user_id INT, widgets JSON
//where to store individual widget settings? each their own table like profiles/chargen
//remove user_profile table, just store the info in profile for chgen settings
const Dashboard = () => {
  //const [widgets, setWidgets] = useState({})
  //async to get user information, setWigets to json object
  return (
    <div className="dash vh-100">
      <Navbar />
      {/* iterate widgets state, passing info to <Widget /> component */}
      {/* Widget component will display correct widget information as a card */}
      <Routes>
        <Route path="/characterGeneration" element={<CharacterGeneration />} />
        <Route
          path="/expensetracker"
          element={
            <ExpenseProvider>
              <ExpenseTracker />
            </ExpenseProvider>
          }
        />
      </Routes>
      <br />
      {/* Remove logout button */}
    </div>
  );
};

export default Dashboard;
