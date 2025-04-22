import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/login");
  }, []);

  return <div>this is landing page</div>;
}
