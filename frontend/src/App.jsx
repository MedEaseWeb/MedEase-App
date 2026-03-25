import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";

import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import LandingPage from "./pages/LandingPage/LandingPage";
import ChatPage from "./pages/chat/ChatPage";
import SettingsPage from "./pages/settings/SettingsPage";
import NotFound from "./pages/utility/NotFound";
import PrivacyPolicy from "./pages/utility/PrivacyPolicy";
import TermsOfService from "./pages/utility/TermsOfService";
import TopBarComponent from "./pages/utility/TopBar";
import ProtectedRoute from "./context/ProtectedRoutes";
import { AuthProvider } from "./context/AuthContext";

import "./index.css";
import "./styles/fonts.css";
import { Box } from "@mui/material";

const PUBLIC_ROUTES = ["/", "/dev/login", "/dev/signup", "/privacy", "/terms"];

function Layout() {
  const location = useLocation();
  const isPublic = PUBLIC_ROUTES.includes(location.pathname);
  const hideTopBarRoutes = ["/dev/login", "/dev/signup", "/"];

  const content = (
    <>
      {!hideTopBarRoutes.includes(location.pathname) && <TopBarComponent />}
      <Box sx={{ mt: !hideTopBarRoutes.includes(location.pathname) ? 8 : 0 }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          {/* Dev-only auth routes — not linked publicly */}
          <Route path="/dev/login" element={<Login />} />
          <Route path="/dev/signup" element={<SignUp />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />

          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Box>
    </>
  );

  return <AuthProvider>{content}</AuthProvider>;
}

export default function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}
