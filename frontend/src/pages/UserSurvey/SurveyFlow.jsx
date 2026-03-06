import React, { useState } from "react";
import { Box, Button, Paper, Typography } from "@mui/material";
import Step1Injury from "./Step1Injury";
import Step2About from "./Step2About";
import Step3SymptomPain from "./Step3SymptomPain";
import Step4RecoveryGoals from "./Step4RecoveryGoals";

// Default shape for all survey answers (style guide: single source of truth for form state)
const initialFormData = {
  // Step 1
  injuryExperience: "",
  seeingDoctor: "",
  // Step 2
  age: "",
  gender: "",
  injuryType: "",
  // Step 3
  painToday: 5,
  mobility: "",
  additionalSymptoms: "",
  // Step 4
  recoveryGoals: [],
  motivationLevel: 5,
};

const STEPS = [
  { title: "How did your injury happen?", component: Step1Injury },
  { title: "About you", component: Step2About },
  { title: "Symptom & pain", component: Step3SymptomPain },
  { title: "Recovery goals", component: Step4RecoveryGoals },
];

export default function SurveyFlow() {
  const [stepIndex, setStepIndex] = useState(0);
  const [formData, setFormData] = useState(initialFormData);

  const currentStep = STEPS[stepIndex];
  const StepComponent = currentStep.component;
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === STEPS.length - 1;

  const handleNext = () => {
    if (!isLast) setStepIndex((i) => i + 1);
  };

  const handlePrev = () => {
    if (!isFirst) setStepIndex((i) => i - 1);
  };

  const updateFormData = (updates) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 110px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
        // Style guide: bone/warm background optional; we use gradient panel for card
        backgroundColor: "rgb(247, 242, 237)",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 560,
          p: { xs: 3, sm: 4 },
          borderRadius: 3,
          background: "linear-gradient(to right, #f9f9f9, #eef2f3)",
          boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
          border: "1px solid #ccc",
        }}
      >
        {/* Step indicator — style guide: section title, green */}
        <Typography
          sx={{
            fontFamily: "ECA, sans-serif",
            fontSize: "0.85rem",
            fontWeight: 600,
            color: "#00684A",
            letterSpacing: "0.02em",
            mb: 1,
          }}
        >
          Step {stepIndex + 1} of {STEPS.length}
        </Typography>
        <Typography
          variant="h5"
          sx={{
            fontFamily: "ECA, sans-serif",
            fontWeight: 700,
            color: "#2C2420",
            letterSpacing: "-0.02em",
            mb: 3,
          }}
        >
          {currentStep.title}
        </Typography>

        <StepComponent
          formData={formData}
          updateFormData={updateFormData}
        />

        {/* Navigation — style guide: primary green button, spacing between */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
            mt: 4,
            pt: 2,
            borderTop: "1px solid rgba(44, 36, 32, 0.08)",
          }}
        >
          <Button
            variant="outlined"
            onClick={handlePrev}
            disabled={isFirst}
            sx={{
              fontFamily: "ECA, sans-serif",
              fontWeight: 600,
              textTransform: "none",
              color: "#00684A",
              borderColor: "#00684A",
              borderRadius: "12px",
              px: 3,
              "&:hover": {
                borderColor: "#00684A",
                backgroundColor: "#E6F4F1",
              },
              "&.Mui-disabled": {
                borderColor: "rgba(0,0,0,0.12)",
                color: "rgba(44, 36, 32, 0.3)",
              },
            }}
          >
            Previous
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
            sx={{
              fontFamily: "ECA, sans-serif",
              fontWeight: 600,
              textTransform: "none",
              backgroundColor: "#00684A",
              color: "white",
              borderRadius: "12px",
              px: 3,
              "&:hover": { backgroundColor: "#005C3A" },
            }}
          >
            {isLast ? "Finish" : "Next"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
