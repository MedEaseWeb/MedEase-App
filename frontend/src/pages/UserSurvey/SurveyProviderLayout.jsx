import React from "react";
import { Outlet } from "react-router-dom";
import { SurveyProvider } from "./SurveyContext";

export default function SurveyProviderLayout() {
  return (
    <SurveyProvider>
      <Outlet />
    </SurveyProvider>
  );
}

