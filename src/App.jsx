import { useContext } from "react";
import Dashboard from "./main-components/Dashboard";
import { AuthContext } from "./main-components/AuthContext";
import Login from "./main-components/Login";
import "./main-styles/app.css";

function App() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
      <div className="main-container">
        {isAuthenticated ? <Dashboard /> : <Login />}
      </div>
  );
}

export default App;
