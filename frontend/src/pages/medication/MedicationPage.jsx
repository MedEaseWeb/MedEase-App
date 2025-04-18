import React, { useState, useEffect } from "react";
import { Button, Typography, Box, Paper, Grid } from "@mui/material";
import {
  Medication as MedicationIcon,
  Event,
  LocalPharmacy,
} from "@mui/icons-material";
import PasteBox from "./PasteBox";
import HistoryTab from "./HistoryTab";
import axios from "axios";

const backendBaseUrl = import.meta.env.VITE_API_URL;

const FeatureButtons = () => {
  const [isCalendarConnected, setIsCalendarConnected] = useState(false);

  useEffect(() => {
    const checkCalendarStatus = async () => {
      try {
        const res = await fetch(
          `${backendBaseUrl}/google/is-google-calendar-connected`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        setIsCalendarConnected(data.isConnected);
      } catch (error) {
        console.error("Failed to check Gmail connection:", error);
      }
    };

    checkCalendarStatus();
  }, []);

  const handleConnectGoogleCalendar = () => {
    window.location.href = `${backendBaseUrl}/google/connect-google-calendar`;
  };

  const handleViewGoogleCalendar = () => {
    window.location.href = `${backendBaseUrl}/google/view-google-calendar`;
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
      <Button
        variant="contained"
        startIcon={<Event />}
        onClick={handleConnectGoogleCalendar}
        sx={{
          borderRadius: "20px",
          backgroundColor: "#00684A",
          color: "white",
          "&:hover": { backgroundColor: "#00684A" },
        }}
        fullWidth
      >
        Add reminder to Google Calendar
      </Button>

      <Button
        variant="contained"
        startIcon={<LocalPharmacy />}
        sx={{
          borderRadius: "20px",
          backgroundColor: "#00684A",
          color: "white",
          "&:hover": { backgroundColor: "#00684A" },
        }}
        fullWidth
      >
        Track pharmacy location
      </Button>
    </Box>
  );
};

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
  const [history, setHistory] = useState(() => {
    return JSON.parse(localStorage.getItem("medicationHistory")) || [];
  });

  const handleNewSubmission = (newNote) => {
    const updatedHistory = [newNote, ...history];
    setHistory(updatedHistory);
    localStorage.setItem("medicationHistory", JSON.stringify(updatedHistory));
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Main Content */}
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={8}>
            <PasteBox onNewSubmission={handleNewSubmission} />
          </Grid>
          <Grid item xs={12} md={4}>
            <FeatureButtons />
            <HistoryTab history={history} />
          </Grid>
        </Grid>
        <Disclaimer />
      </Box>
    </Box>
  );
};

export default MedicationPage;
