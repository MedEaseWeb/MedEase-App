import React from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useSurvey } from "./SurveyContext";

/**
 * Step 2 – About you
 * Age (number), Gender (select), Injury type (select).
 * Style guide: ECA font, green focus/outline, consistent spacing and helper text.
 */
export default function Step2About() {
  const { formData, updateFormData } = useSurvey();
  const inputSx = {
    "& .MuiOutlinedInput-root": {
      fontFamily: "ECA, sans-serif",
      borderRadius: "12px",
      "& fieldset": { borderColor: "#E6DCCA" },
      "&:hover fieldset": { borderColor: "#C8B9AF" },
      "&.Mui-focused fieldset": {
        borderColor: "#00684A",
        borderWidth: "1.5px",
      },
    },
    "& .MuiInputLabel-root": {
      fontFamily: "ECA, sans-serif",
      "&.Mui-focused": { color: "#00684A" },
    },
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Age */}
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
          Age
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
          Your age helps us suggest age-appropriate recovery tips.
        </Typography>
        <TextField
          fullWidth
          type="number"
          placeholder="e.g. 28"
          value={formData.age}
          onChange={(e) => updateFormData({ age: e.target.value })}
          inputProps={{ min: 1, max: 120 }}
          variant="outlined"
          sx={inputSx}
        />
      </Box>

      {/* Gender */}
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
          Gender
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
          Optional — used only to personalize content.
        </Typography>
        <FormControl fullWidth variant="outlined" sx={inputSx}>
          <InputLabel id="gender-label">Select</InputLabel>
          <Select
            labelId="gender-label"
            label="Select"
            value={formData.gender}
            onChange={(e) => updateFormData({ gender: e.target.value })}
            sx={{ fontFamily: "ECA, sans-serif" }}
          >
            <MenuItem value="">—</MenuItem>
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
            <MenuItem value="other">Other</MenuItem>
            <MenuItem value="prefer_not">Prefer not to say</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Injury type */}
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
          Injury type
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
          Choose the option that best describes your injury.
        </Typography>
        <FormControl fullWidth variant="outlined" sx={inputSx}>
          <InputLabel id="injury-type-label">Select type</InputLabel>
          <Select
            labelId="injury-type-label"
            label="Select type"
            value={formData.injuryType}
            onChange={(e) => updateFormData({ injuryType: e.target.value })}
            sx={{ fontFamily: "ECA, sans-serif" }}
          >
            <MenuItem value="">—</MenuItem>
            <MenuItem value="sprain">Sprain</MenuItem>
            <MenuItem value="fracture">Fracture</MenuItem>
            <MenuItem value="muscle_strain">Muscle strain</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
}
