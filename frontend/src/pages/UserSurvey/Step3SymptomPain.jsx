import React from "react";
import {
  Box,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Slider,
  TextField,
  Typography,
} from "@mui/material";
import { useSurvey } from "./SurveyContext";

/**
 * Step 3 – Symptom & pain
 * Pain slider 0–10, mobility radio, optional additional symptoms TextField.
 * Style guide: green accent for slider and selected radio, ECA typography.
 */
export default function Step3SymptomPain() {
  const { formData, updateFormData } = useSurvey();
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Pain today */}
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
          Pain today (0 = none, 10 = worst)
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
          Rate how much pain you’re feeling right now.
        </Typography>
        <Box sx={{ px: 0.5 }}>
          <Slider
            value={formData.painToday}
            onChange={(_, value) => updateFormData({ painToday: value })}
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

      {/* Mobility */}
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
          Mobility
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
          How would you describe your current ability to move?
        </Typography>
        <RadioGroup
          value={formData.mobility}
          onChange={(e) => updateFormData({ mobility: e.target.value })}
          sx={{
            "& .MuiFormControlLabel-label": { fontFamily: "ECA, sans-serif", fontSize: "0.95rem" },
            "& .MuiRadio-root.Mui-checked": { color: "#00684A" },
          }}
        >
          <FormControlLabel value="normal" control={<Radio />} label="Normal" />
          <FormControlLabel value="limited" control={<Radio />} label="Limited" />
          <FormControlLabel value="severe" control={<Radio />} label="Severe limitation" />
        </RadioGroup>
      </FormControl>

      {/* Additional symptoms */}
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
          Any additional symptoms?
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
          Optional — e.g. swelling, numbness, stiffness.
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={3}
          placeholder="Describe any other symptoms..."
          value={formData.additionalSymptoms}
          onChange={(e) => updateFormData({ additionalSymptoms: e.target.value })}
          variant="outlined"
          sx={{
            "& .MuiOutlinedInput-root": {
              fontFamily: "ECA, sans-serif",
              borderRadius: "12px",
              "& fieldset": { borderColor: "#E6DCCA" },
              "&:hover fieldset": { borderColor: "#C8B9AF" },
              "&.Mui-focused fieldset": { borderColor: "#00684A", borderWidth: "1.5px" },
            },
          }}
        />
      </Box>
    </Box>
  );
}
