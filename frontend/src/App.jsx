import {
  Navigate,
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

// Demo / Survey
import SurveyProviderLayout from "./pages/UserSurvey/SurveyProviderLayout";
import SurveyWelcome from "./pages/UserSurvey/SurveyWelcome";
import SurveyIntro from "./pages/UserSurvey/SurveyIntro";
import SurveyQuestions from "./pages/UserSurvey/SurveyQuestions";
import SurveyEnd from "./pages/UserSurvey/SurveyEnd";
import QuestionsLoop from "./pages/UserSurvey/QuestionsLoop";

import "./index.css";
import "./styles/fonts.css";
import { Box } from "@mui/material";

const PUBLIC_ROUTES = ["/", "/dev/login", "/dev/signup", "/privacy", "/terms"];

function Layout() {
  const location = useLocation();
  const hideTopBarRoutes = ["/dev/login", "/dev/signup", "/"];
  const hideSurvey = location.pathname.startsWith("/survey") || location.pathname.startsWith("/questions-loop");

  const showTopBar = !hideTopBarRoutes.includes(location.pathname) && !hideSurvey;

  const content = (
    <>
      {showTopBar && <TopBarComponent />}
      <Box sx={{ mt: showTopBar ? 8 : 0 }}>
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

          {/* Survey / Demo */}
          <Route path="/survey" element={<SurveyProviderLayout />}>
            <Route index element={<Navigate to="welcome" replace />} />
            <Route path="welcome" element={<SurveyWelcome />} />
            <Route path="intro" element={<SurveyIntro />} />
            <Route path="questions" element={<SurveyQuestions />} />
            <Route path="end" element={<SurveyEnd />} />
          </Route>
          <Route path="/questions-loop" element={<QuestionsLoop />} />

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
