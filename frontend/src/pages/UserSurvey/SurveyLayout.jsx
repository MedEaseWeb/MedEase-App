import React from "react";
import { Box, Button, Paper, Typography } from "@mui/material";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const STEPS = [
  { path: "step1", title: "How did your injury happen?" },
  { path: "step2", title: "About you" },
  { path: "step3", title: "Symptom & pain" },
  { path: "step4", title: "Recovery goals" },
];

export default function SurveyLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;
  const match = pathname.match(/\/survey\/step(\d)$/);
  const stepNum = match ? parseInt(match[1], 10) : 1;
  const currentStep = STEPS[stepNum - 1] || STEPS[0];
  const isFirst = stepNum === 1;
  const isLast = stepNum === STEPS.length;

  const handlePrev = () => {
    if (!isFirst) navigate(`/survey/step${stepNum - 1}`);
  };
  const handleNext = () => {
    if (!isLast) navigate(`/survey/step${stepNum + 1}`);
    // else could navigate to a "Finish" / summary page
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
          Step {stepNum} of {STEPS.length}
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

        <Outlet />

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
