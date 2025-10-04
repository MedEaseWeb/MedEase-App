import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";

import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import CareGiver from "./pages/careGiver/CaregiverMainPage";
import LandingPage from "./pages/LandingPage/LandingPage";
import Medication from "./pages/medication/MedicationPage";
import ReportSimplification from "./pages/reportsimplification/reportSimplificationPage";
import NotFound from "./pages/utility/NotFound";
import PrivacyPolicy from "./pages/utility/PrivacyPolicy";
import TermsOfService from "./pages/utility/TermsOfService";
import TopBarComponent from "./pages/utility/TopBar";
import ProtectedRoute from "./context/ProtectedRoutes";

import "./index.css";
import "./styles/fonts.css";
import { Box } from "@mui/material";

function Layout() {
  const location = useLocation();
  const hideTopBarRoutes = ["/login", "/signup", "/"];

  return (
    <>
      {!hideTopBarRoutes.includes(location.pathname) && <TopBarComponent />}
      <Box sx={{ mt: !hideTopBarRoutes.includes(location.pathname) ? 12 : 0 }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Wrap protected routes here */}
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
