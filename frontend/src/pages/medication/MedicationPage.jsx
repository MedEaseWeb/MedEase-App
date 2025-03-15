import React, { useState } from "react";
import { Button, Typography, Box, Paper, TextField, Grid } from "@mui/material";
import {
  Medication as MedicationIcon,
  Restaurant,
  FitnessCenter,
  Event,
  LocalPharmacy,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const PasteBox = () => {
  const [text, setText] = useState("");

  const handleSubmit = async () => {
    console.log("Submitted Text:", text);
    const response = await fetch(
      "http://localhost:8081/medication/extract-medication",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }), // Send the input text from the form
        credentials: "include",
      }
    );

    if (response.ok) {
      const data = await response.json();
      alert("Text submitted successfully!");
      console.log(data); // Handle the response
    } else {
      alert("Error submitting text");
      console.log(response);
    }
  };
  return (
    <Paper
      elevation={6}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: 5,
        borderRadius: 3,
        background: "linear-gradient(to right, #f9f9f9, #eef2f3)",
        boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
        border: "1px solid #ccc",
        width: "100%",
        maxWidth: 800, // Adjusted width for better readability
      }}
    >
      {/* Title */}
      <Typography variant="h5" sx={{ fontWeight: "bold", color: "#004D40" }}>
        Paste Your Medication Report or Prescription
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
        Safely and securely receive tailored advice
      </Typography>

      {/* Text Field */}
      <TextField
        multiline
        rows={12}
        variant="outlined"
        placeholder="Paste your text here..."
        fullWidth
        value={text}
        onChange={(e) => setText(e.target.value)}
        sx={{
          mt: 2,
          p: 2,
          borderRadius: 2,
          backgroundColor: "#fff",
          transition: "0.3s",
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#ccc",
              transition: "border-color 0.3s ease",
            },
            "&:hover fieldset": {
              borderColor: "#00897B",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#004D40", // Darker green on focus
            },
          },
        }}
      />

      {/* Submit Button */}
      <Button
        variant="contained"
        onClick={handleSubmit}
        sx={{
          mt: 3,
          px: 4,
          py: 1.5,
          fontSize: "1rem",
          fontWeight: "bold",
          textTransform: "none",
          backgroundColor: "#00897B",
          color: "#fff",
          borderRadius: "25px",
          transition: "0.3s",
          "&:hover": {
            backgroundColor: "#00695C",
            transform: "translateY(-2px)", // Slight elevation on hover
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
          },
        }}
      >
        Submit
      </Button>
    </Paper>
  );
};

const FeatureButtons = () => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
    {[
      { icon: <Event />, text: "Add reminder to Google Calendar" },
      { icon: <LocalPharmacy />, text: "Track pharmacy location" },
      { icon: <MedicationIcon />, text: "Medication Interactions" },
      { icon: <Restaurant />, text: "Dietary Advice" },
      { icon: <FitnessCenter />, text: "Lifestyle Suggestions" },
    ].map(({ icon, text }, index) => (
      <Button
        key={index}
        variant="contained"
        startIcon={icon}
        sx={{
          borderRadius: "20px",
          backgroundColor: "#00684A",
          color: "white",
          "&:hover": { backgroundColor: "#00684A" },
        }}
        fullWidth
      >
        {text}
      </Button>
    ))}
  </Box>
);

const Disclaimer = () => (
  <Paper sx={{ p: 2, mt: 3, backgroundColor: "#FFF3CD", borderRadius: 2 }}>
    <Typography variant="body2" sx={{ fontWeight: "bold", color: "#D39E00" }}>
      ⚠ Disclaimer
    </Typography>
    <Typography variant="body2">
      The generated reports are for informational purposes only and{" "}
      <strong>do not</strong> guarantee accuracy or completeness. Always consult
      a qualified healthcare professional for medical advice.
    </Typography>
  </Paper>
);

const MedicationPage = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* App Bar */}
      {/* <TopBar onMenuClick={() => console.log("Menu Clicked")} onLogoutClick={() => console.log("Logout Clicked")} /> */}

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={8}>
            <PasteBox />
          </Grid>
          <Grid item xs={12} md={4}>
            <FeatureButtons />
          </Grid>
        </Grid>
        <Disclaimer />
      </Box>
    </Box>
  );
};

export default MedicationPage;
