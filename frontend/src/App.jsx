import { Routes, Route, Link } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ReportSimplifier from "./pages/ReportSimplifier";
import NotFound from "./pages/utility/NotFound";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/reportsimplifier" element={<ReportSimplifier />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
