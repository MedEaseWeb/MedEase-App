import React from "react";
import {
  Box,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { useSurvey } from "./SurveyContext";

/**
 * Step 1 – How did your injury happen?
 * Two radio questions with helper text. Styles follow MedEase style guide:
 * - ECA font, primary green #00684A for labels/selected state
 * - Spacing: gap 2, mt 2 between sections
 */
export default function Step1Injury() {
  const { formData, updateFormData } = useSurvey();
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Question 1 */}
      <FormControl component="fieldset">
        <Typography
          component="legend"
          sx={{
            fontFamily: "ECA, sans-serif",
            fontWeight: 600,
            fontSize: "1rem",
            color: "#2C2420",
            mb: 0.5,
          }}
        >
          Have you recently experienced an injury?
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
          This helps us tailor your recovery journey.
        </Typography>
        <RadioGroup
          value={formData.injuryExperience}
          onChange={(e) =>
            updateFormData({ injuryExperience: e.target.value })
          }
          sx={{
            "& .MuiFormControlLabel-label": {
              fontFamily: "ECA, sans-serif",
              fontSize: "0.95rem",
            },
            "& .MuiRadio-root.Mui-checked": { color: "#00684A" },
          }}
        >
          <FormControlLabel value="yes_minor" control={<Radio />} label="Yes, minor" />
          <FormControlLabel value="yes_major" control={<Radio />} label="Yes, major" />
          <FormControlLabel value="no" control={<Radio />} label="No" />
        </RadioGroup>
      </FormControl>

      {/* Question 2 */}
      <FormControl component="fieldset">
        <Typography
          component="legend"
          sx={{
            fontFamily: "ECA, sans-serif",
            fontWeight: 600,
            fontSize: "1rem",
            color: "#2C2420",
            mb: 0.5,
          }}
        >
          Are you seeing a doctor for it?
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
          We’ll adapt our suggestions based on whether you’re under medical care.
        </Typography>
        <RadioGroup
          value={formData.seeingDoctor}
          onChange={(e) => updateFormData({ seeingDoctor: e.target.value })}
          sx={{
            "& .MuiFormControlLabel-label": {
              fontFamily: "ECA, sans-serif",
              fontSize: "0.95rem",
            },
            "& .MuiRadio-root.Mui-checked": { color: "#00684A" },
          }}
        >
          <FormControlLabel
            value="yes_care"
            control={<Radio />}
            label="Yes, currently under care"
          />
          <FormControlLabel
            value="no_self"
            control={<Radio />}
            label="No, self-recovery"
          />
        </RadioGroup>
      </FormControl>
    </Box>
  );
}
