import React from "react";
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Slider,
  Typography,
} from "@mui/material";
import { useSurvey } from "./SurveyContext";

const GOAL_OPTIONS = [
  { value: "sports", label: "Return to sports" },
  { value: "daily", label: "Daily activities" },
  { value: "pain", label: "Reduce pain" },
  { value: "strength", label: "Increase strength" },
  { value: "other", label: "Other" },
];

/**
 * Step 4 – Recovery goals
 * Multiple checkboxes for goals, then motivation level slider 0–10.
 * Style guide: green for checked state and slider, ECA font, spacing gap 3.
 */
export default function Step4RecoveryGoals() {
  const { formData, updateFormData } = useSurvey();
  const handleGoalToggle = (value) => {
    const current = formData.recoveryGoals || [];
    const next = current.includes(value)
      ? current.filter((g) => g !== value)
      : [...current, value];
    updateFormData({ recoveryGoals: next });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Recovery goals */}
      <Box>
        <Typography
          sx={{
            fontFamily: "ECA, sans-serif",
            fontWeight: 600,
            fontSize: "1rem",
            color: "#2C2420",
            mb: 0.5,
          }}
        >
          What are your top recovery goals?
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontFamily: "ECA, sans-serif",
            color: "#594D46",
            fontSize: "0.85rem",
            mb: 1.5,
          }}
        >
          Select all that apply — we’ll use this to personalize your plan.
        </Typography>
        <FormGroup sx={{ gap: 0.5 }}>
          {GOAL_OPTIONS.map(({ value, label }) => (
            <FormControlLabel
              key={value}
              control={
                <Checkbox
                  checked={(formData.recoveryGoals || []).includes(value)}
                  onChange={() => handleGoalToggle(value)}
                  sx={{
                    color: "#C8B9AF",
                    "&.Mui-checked": { color: "#00684A" },
                  }}
                />
              }
              label={
                <Typography sx={{ fontFamily: "ECA, sans-serif", fontSize: "0.95rem" }}>
                  {label}
                </Typography>
              }
            />
          ))}
        </FormGroup>
      </Box>

      {/* Motivation level */}
      <Box>
        <Typography
          sx={{
            fontFamily: "ECA, sans-serif",
            fontWeight: 600,
            fontSize: "1rem",
            color: "#2C2420",
            mb: 0.5,
          }}
        >
          Motivation level (0 = low, 10 = very motivated)
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontFamily: "ECA, sans-serif",
            color: "#594D46",
            fontSize: "0.85rem",
            mb: 1.5,
          }}
        >
          How motivated do you feel to follow a recovery plan?
        </Typography>
        <Box sx={{ px: 0.5 }}>
          <Slider
            value={formData.motivationLevel}
            onChange={(_, value) => updateFormData({ motivationLevel: value })}
            min={0}
            max={10}
            step={1}
            valueLabelDisplay="auto"
            marks={[
              { value: 0, label: "0" },
              { value: 5, label: "5" },
              { value: 10, label: "10" },
            ]}
            sx={{
              color: "#00684A",
              "& .MuiSlider-thumb": { "&:hover, &.Mui-focusVisible": { boxShadow: "0 0 0 8px rgba(0, 104, 74, 0.16)" } },
              "& .MuiSlider-valueLabel": { backgroundColor: "#00684A" },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
