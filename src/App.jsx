import { lazy } from "react"; //use suspense for lazy loading
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./main-components/AuthContext";
import { ToastProvider } from "./main-components/ToastContext";
import Toasts from "./main-components/Toasts";
import ProtectedRoutes from "./main-components/ProtectedRoutes";
import Dashboard from "./main-components/Dashboard";
import Home from "./main-components/Home";
import Login from "./bingo/login/Login";
// import Bingo from "./bingo/Bingo";
const Bingo = lazy(() => import("./bingo/Bingo"));
const Rules = lazy(() => import("./bingo/rules/Rules"));
const Setup = lazy(() => import("./bingo/setup/Setup"));
const BoardPage = lazy(() => import("./bingo/board/BoardPage"));
const BingoHome = lazy(() => import("./bingo/home/BingoHome"));
const VingoLogin = lazy(() => import("./bingo/login/Login"));
const Shame = lazy(() => import("./bingo/shame/Shame"));
const Highscores = lazy(() => import("./bingo/scores/Highscores"));
/*
// routes.js
import WeatherWidget from './components/WeatherWidget';
import TodoWidget from './components/TodoWidget';

export const allWidgets = {
  dashboard: { path: '/dashboard', component: Dashboard }, //only used for its route? or always have it
  weather: { path: '/weather', component: WeatherWidget },
  todo: { path: '/todo', component: TodoWidget },
};

*/

//Use and iterate ROUTES in protected routes
function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Toasts />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          {/* map through allWidgets, each surrounded by ProtectedRoutes */}
          <Route
            path="/dashboard/*"
            element={
              <AuthProvider>
                <ProtectedRoutes>
                  <Dashboard />
                </ProtectedRoutes>
              </AuthProvider>
            }
          />
          {/* <Route path="/bingo" element={<Bingo />} /> */}
          <Route path="/bingo" element={<Bingo />}>
            <Route index element={<BingoHome />} />
            <Route path="rules" element={<Rules />} />
            <Route path="login" element={<VingoLogin />} />
            <Route path="setup" element={<Setup />} />
            <Route path="board" element={<BoardPage />} />
            <Route path="shame" element={<Shame />} />
            <Route path="scores" element={<Highscores />} />
          </Route>
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
