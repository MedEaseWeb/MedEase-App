import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/");
  }, []);

  return <></>;
}
