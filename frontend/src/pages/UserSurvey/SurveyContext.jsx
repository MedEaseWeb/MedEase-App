import React, { createContext, useContext, useMemo, useState } from "react";

const SurveyContext = createContext(null);

const initialSurveyState = {
  acceptedDisclaimer: false,

  // Q1
  whatHappened: "",
  whatHappenedOther: "",

  // Q2
  whenHappened: "",
  whenHappenedDetail: "",

  // Q3
  hasInsurance: "",
  insuranceProvider: "",
};

export function SurveyProvider({ children }) {
  const [data, setData] = useState(initialSurveyState);

  const api = useMemo(() => {
    return {
      data,
      set: (patch) => setData((prev) => ({ ...prev, ...patch })),
      reset: () => setData(initialSurveyState),
    };
  }, [data]);

  return <SurveyContext.Provider value={api}>{children}</SurveyContext.Provider>;
}

export function useSurvey() {
  const ctx = useContext(SurveyContext);
  if (!ctx) throw new Error("useSurvey must be used within SurveyProvider");
  return ctx;
}

