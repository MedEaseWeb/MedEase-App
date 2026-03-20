import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";

import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import CareGiver from "./pages/careGiver/CaregiverMainPage";
import QuestionsInTheLoopPage from "./pages/QuestionsInTheLoop/QuestionsInTheLoopPage";
import NotesPage from "./pages/Notes/NotesPage";
import CommunityPage from "./pages/Community/CommunityPage";
import FindPeoplePage from "./pages/Community/FindPeoplePage";
import HelpPeoplePage from "./pages/Community/HelpPeoplePage";
import LocalSupportPage from "./pages/Community/LocalSupportPage";
import AIHealthPage from "./pages/Community/AIHealthPage";
import LandingPage from "./pages/LandingPage/LandingPage";
import Medication from "./pages/medication/MedicationPage";
import ReportSimplification from "./pages/reportsimplification/reportSimplificationPage";
import NotFound from "./pages/utility/NotFound";
import PrivacyPolicy from "./pages/utility/PrivacyPolicy";
import TermsOfService from "./pages/utility/TermsOfService";
import TopBarComponent from "./pages/utility/TopBar";
import ProtectedRoute from "./context/ProtectedRoutes";

// Survey (landing-page style, yoyo aesthetic)
import SurveyProviderLayout from "./pages/UserSurvey/SurveyProviderLayout";
import SurveyWelcome from "./pages/UserSurvey/SurveyWelcome";
import SurveyIntro from "./pages/UserSurvey/SurveyIntro";
import SurveyQuestions from "./pages/UserSurvey/SurveyQuestions";
import SurveyEnd from "./pages/UserSurvey/SurveyEnd";
import QuestionsLoop from "./pages/UserSurvey/QuestionsLoop";

import "./index.css";
import "./styles/fonts.css";
import { Box } from "@mui/material";

function Layout() {
  const location = useLocation();
  // Keep landing-style pages clean (no app TopBar)
  const hideTopBar =
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname.startsWith("/survey") ||
    location.pathname.startsWith("/questions-loop") ||
    location.pathname === "/questions-in-the-loop-preview" ||
    location.pathname === "/notes-preview" ||
    location.pathname === "/notes" ||
    location.pathname === "/community" ||
    location.pathname.startsWith("/community/");

  return (
    <>
      {!hideTopBar && <TopBarComponent />}
      <Box sx={{ mt: !hideTopBar ? 12 : 0 }}>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected */}
          <Route
            path="/reportsimplifier"
            element={
              <ProtectedRoute>
                <ReportSimplification />
              </ProtectedRoute>
            }
          />
          <Route
            path="/medication"
            element={
              <ProtectedRoute>
                <Medication />
              </ProtectedRoute>
            }
          />
          <Route
            path="/caregiver"
            element={
              <ProtectedRoute>
                <CareGiver />
              </ProtectedRoute>
            }
          />
          {/* Home: QuestionsInTheLoop — same visibility as Notes/Community (public shell); auth for sensitive APIs remains on backend */}
          <Route path="/home" element={<QuestionsInTheLoopPage />} />
          <Route path="/questions-in-the-loop" element={<QuestionsInTheLoopPage />} />
          {/* Notes: public for dev preview; wrap with <ProtectedRoute> for production */}
          <Route path="/notes" element={<NotesPage />} />
          {/* Community */}
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/community/find-people" element={<FindPeoplePage />} />
          <Route path="/community/help-people" element={<HelpPeoplePage />} />
          <Route path="/community/local-support" element={<LocalSupportPage />} />
          <Route path="/community/ai-health" element={<AIHealthPage />} />
          {/* Preview routes: view design without login (remove in prod if desired) */}
          <Route path="/questions-in-the-loop-preview" element={<QuestionsInTheLoopPage />} />
          <Route path="/notes-preview" element={<NotesPage />} />

          {/* Survey */}
          {/* Clearly separate Questions Loop from the survey routes */}
          <Route path="/questions-loop" element={<QuestionsLoop />} />

          <Route path="/survey" element={<SurveyProviderLayout />}>
            <Route index element={<Navigate to="welcome" replace />} />
            <Route path="welcome" element={<SurveyWelcome />} />
            <Route path="intro" element={<SurveyIntro />} />
            <Route path="questions" element={<SurveyQuestions />} />
            <Route path="end" element={<SurveyEnd />} />
          </Route>

          {/* Utility */}
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Box>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}