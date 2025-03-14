import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Box,
  Paper,
  TextField,
  IconButton,
  Grid,
} from "@mui/material";
import { Menu as MenuIcon, Login as LoginIcon } from "@mui/icons-material";
import {
  Medication as MedicationIcon,
  Restaurant,
  FitnessCenter,
  Event,
  LocalPharmacy,
} from "@mui/icons-material";

const PasteBox = () => {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    console.log("Submitted Text:", text);
    alert("Text submitted successfully!");
  };

  return (
    <Paper
      elevation={3}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: 500,
        p: 3,
        textAlign: "center",
        border: "2px dashed #ccc",
        borderRadius: 2,
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
        Paste Your Medication Report or Prescription
      </Typography>
      <Typography variant="body2" color="textSecondary">
        Safely and securely receive tailored advice
      </Typography>
      <TextField
        multiline
        rows={6}
        variant="outlined"
        placeholder="Paste your text here..."
        fullWidth
        value={text}
        onChange={(e) => setText(e.target.value)}
        sx={{ mt: 2 }}
      />
      <Button
        variant="contained"
        onClick={handleSubmit}
        sx={{ mt: 2, borderRadius: "10px" }}
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
      <AppBar position="static" color="inherit" elevation={1}>
        <Toolbar>
          <IconButton edge="start" color="inherit" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            MedEase
          </Typography>
          <Button color="inherit" startIcon={<LoginIcon />}>
            Login
          </Button>
        </Toolbar>
      </AppBar>

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
