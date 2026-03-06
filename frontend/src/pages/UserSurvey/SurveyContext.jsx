import React, { createContext, useContext, useState } from "react";

const initialFormData = {
  injuryExperience: "",
  seeingDoctor: "",
  age: "",
  gender: "",
  injuryType: "",
  painToday: 5,
  mobility: "",
  additionalSymptoms: "",
  recoveryGoals: [],
  motivationLevel: 5,
};

const SurveyContext = createContext(null);

export function SurveyProvider({ children }) {
  const [formData, setFormData] = useState(initialFormData);
  const updateFormData = (updates) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };
  return (
    <SurveyContext.Provider value={{ formData, updateFormData }}>
      {children}
    </SurveyContext.Provider>
  );
}

export function useSurvey() {
  const ctx = useContext(SurveyContext);
  if (!ctx) throw new Error("useSurvey must be used within SurveyProvider");
  return ctx;
}
