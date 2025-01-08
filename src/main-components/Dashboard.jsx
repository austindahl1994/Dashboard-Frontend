//List all widget objects saved in DB, iterate through and show cards for each, the card content dependent on content
import { Route, Routes } from "react-router-dom";
import Navbar from "./Navbar";
import { ToastProvider } from "./ToastContext";
import Toasts from "./Toasts";
import CharacterGeneration from "../widgets/CharGen/CharacterGeneration";

const Dashboard = () => {
  return (
    <div>
      <Navbar />
      <div>
        <ToastProvider>
          <Toasts />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route
              path="/characterGeneration"
              element={<CharacterGeneration />}
            />
          </Routes>
        </ToastProvider>
      </div>
    </div>
  );
};

export default Dashboard;
