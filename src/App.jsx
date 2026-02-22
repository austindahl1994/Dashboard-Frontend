import { lazy, Suspense } from "react"; //use suspense for lazy loading
import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";
import { AuthProvider } from "./main-components/AuthContext";
import { ToastProvider } from "./main-components/ToastContext";
import Toasts from "./main-components/Toasts";
import ProtectedRoutes from "./main-components/ProtectedRoutes";
import Dashboard from "./main-components/Dashboard";
import Home from "./main-components/Home";
import Login from "./main-components/Login";
import Admin from "./bingo/admin/Admin";
import NotFound from "./main-components/NotFound";

// import Bingo from "./bingo/Bingo";
const Bingo = lazy(() => import("./bingo/Bingo"));
const Rules = lazy(() => import("./bingo/rules/Rules"));
const Setup = lazy(() => import("./bingo/setup/Setup"));
const BoardPage = lazy(() => import("./bingo/board/BoardPage"));
const BingoHome = lazy(() => import("./bingo/home/BingoHome"));
const VingoLogin = lazy(() => import("./bingo/login/Login"));
const Shame = lazy(() => import("./bingo/shame/Shame"));
const Highscores = lazy(() => import("./bingo/scores/Highscores"));
const AWC = lazy(() => import("./awc/AWC"));
const AWCHome = lazy(() => import("./awc/AWCHome"));
const Labels = lazy(() => import("./awc/labels/Labels"));
const BattleshipWrapper = lazy(() => import("./battleship/BattleshipWrapper"));
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
  // Wrapper to mount AuthProvider only for routes that need it and render child routes via Outlet
  const AuthWrapper = () => (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );

  return (
    <BrowserRouter>
      <ToastProvider>
        <Toasts />
        <Suspense
          fallback={
            <div style={{ padding: "2rem", textAlign: "center" }}>
              Loading...
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Home />} />

            {/* Bingo routes (no AuthProvider) */}
            <Route path="/bingo" element={<Bingo />}>
              <Route index element={<BingoHome />} />
              <Route path="rules" element={<Rules />} />
              <Route path="login" element={<VingoLogin />} />
              <Route path="setup" element={<Setup />} />
              <Route path="board" element={<BoardPage />} />
              <Route path="shame" element={<Shame />} />
              <Route path="scores" element={<Highscores />} />
              <Route path="admin" element={<Admin />} />
              <Route path="*" element={<BingoHome />} />
            </Route>

            {/* Routes that require AuthProvider */}
            <Route element={<AuthWrapper />}>
              <Route path="/login" element={<Login />} />
              <Route path="/awc" element={<AWC />}>
                <Route index element={<AWCHome />} />
                <Route path="labels" element={<Labels />} />
                <Route path="*" element={<AWCHome />} />
              </Route>
              <Route path="/battleship" element={<BattleshipWrapper />} />
              <Route
                path="/dashboard/*"
                element={
                  <ProtectedRoutes>
                    <Dashboard />
                  </ProtectedRoutes>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
