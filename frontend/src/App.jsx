import { Routes, Route, Link } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ReportSimplifier from "./pages/ReportSimplifier";
import NotFound from "./pages/utility/NotFound";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import "./styles/fonts.css";
import "./index.css";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/reportsimplifier" element={<ReportSimplifier />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
