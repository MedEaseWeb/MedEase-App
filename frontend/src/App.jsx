import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/utility/NotFound";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import Medication from "./pages/medication/MedicationPage";
import ReportSimplificationPage from "./pages/report/ReportSimplificationPage";
import CareGiver from "./pages/careGiver/caregiverPage";
import TopBarComponent from "./pages/utility/TopBar";

import "./styles/fonts.css";
import "./index.css";

function Layout() {
  const location = useLocation();
  const hideTopBarRoutes = ["/login", "/signup"];

  return (
    <>
      {!hideTopBarRoutes.includes(location.pathname) && <TopBarComponent />}

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/reportsimplifier" element={<ReportSimplificationPage />} />
        <Route path="/medication" element={<Medication />} />
        <Route path="/caregiver" element={<CareGiver />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
