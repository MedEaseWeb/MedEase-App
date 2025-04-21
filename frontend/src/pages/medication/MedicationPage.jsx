import { Event, LocalPharmacy } from "@mui/icons-material";
import { Box, Button, Paper, Typography, Grid } from "@mui/material";

import React, { useEffect, useState } from "react";
import HistoryTab from "./HistoryTab";
import PasteBox from "./PasteBox";
import Disclaimer from "../reportsimplification/Disclaimer";

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

  const handleTrackPharmacyLocation = async () => {
    try {
      // 1) Read your medication history array from localStorage
      const history = JSON.parse(
        localStorage.getItem("medicationHistory") || "[]"
      );
      if (!history.length) {
        throw new Error("No medication record found in localStorage.");
      }

      // 2) Take the most recent entry’s medication_id
      const medId = history[0].medication_id;
      if (!medId) {
        throw new Error("Latest medication entry missing its ID.");
      }

      // 3) Call your new pharmacy-location endpoint
      const res = await fetch(
        `${backendBaseUrl}/medication/pharmacy-location/${medId}`,
        { credentials: "include" }
      );
      if (!res.ok) throw new Error("Failed to fetch pharmacy location");
      const { maps_url } = await res.json();

      // 4) Redirect to Google Maps
      window.open(maps_url, "_blank");
    } catch (err) {
      console.error("Track pharmacy error:", err);
      alert(err.message || "Could not load pharmacy location.");
    }
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
        onClick={handleTrackPharmacyLocation}
        sx={{
          borderRadius: "20px",
          backgroundColor: "#00684A",
          color: "white",
          "&:hover": { backgroundColor: "#005C3A" },
        }}
        fullWidth
      >
        Track pharmacy location
      </Button>
    </Box>
  );
};

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
    <Box sx={{ width: "100%", maxWidth: "100%" }}>
      {/* Main Content */}
      <Grid
        container
        xs={12}
        // columnSpacing={3}
        // rowSpacing={2}
        sx={{ width: "100%", mt: 2 }}
      >
        <Grid xs={12} md={0.2}></Grid>
        {/* Left Section */}

        <Grid xs={12} md={7.4}>
          <Box
            sx={{
              width: "100%", // ✅ fill the grid cell
              height: "100%", // optional if height matters
              p: 2,
              backgroundColor: "#f9f9f9",
              borderRadius: 2,
              border: "1px solid #ccc", // ✅ move border here
              boxSizing: "border-box",
            }}
          >
            <PasteBox onNewSubmission={handleNewSubmission} />
          </Box>
        </Grid>
        <Grid xs={12} md={0.2}></Grid>
        {/* Right Section */}
        <Grid xs={12} md={4}>
          <Box
            sx={{
              width: "100%",
              height: "100%",
              p: 2,
              backgroundColor: "#f9f9f9",
              borderRadius: 2,
              border: "1px solid #ccc",
              boxSizing: "border-box",
            }}
          >
            <FeatureButtons />
            <HistoryTab history={history} />
          </Box>
        </Grid>
      </Grid>
      <Box p={3}>
        <Disclaimer />
      </Box>
    </Box>
  );
};

export default MedicationPage;
