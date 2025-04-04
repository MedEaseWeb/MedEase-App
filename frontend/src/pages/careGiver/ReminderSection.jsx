import React, { useState, useEffect } from "react";
import {
  Typography,
  IconButton,
  Divider,
  Button,
  Box,
  Tooltip,
} from "@mui/material";
import { EventNote as EventNoteIcon } from "@mui/icons-material";

const backendBaseUrl = import.meta.env.VITE_API_URL;

const ReminderSection = () => {
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
    // Redirect the user to the connect Gmail endpoint.
    window.location.href = `${backendBaseUrl}/google/connect-google-calendar`;
  };
  const handleViewGoogleCalendar = () => {
    window.location.href = `${backendBaseUrl}/google/view-google-calendar`;
  };

  // Shared styles for buttons
  const commonButtonStyles = {
    backgroundColor: "#00897B",
    color: "#fff",
    borderRadius: "25px",
    fontWeight: "bold",
    textTransform: "none",
    "&:hover": {
      backgroundColor: "#00695C",
      transform: "translateY(-2px)",
      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
    },
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#004D40" }}>
          Reminders & Tasks
        </Typography>
        <Tooltip title="Reminders">
          <IconButton
            sx={{
              width: 48,
              height: 48,
              backgroundColor: "#00897B",
              color: "#fff",
              borderRadius: "50%",
              boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.15)",
              "&:hover": { backgroundColor: "#00695C" },
            }}
          >
            <EventNoteIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        - Check medication schedules for each patient <br />
        - Schedule upcoming visits or telehealth calls <br />- Log completed
        tasks and reminders
      </Typography>

      {!isCalendarConnected && (
        <Box sx={{ mb: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={handleConnectGoogleCalendar}
            sx={{
              textTransform: "none",
              justifyContent: "center",
              backgroundColor: "#fff",
              color: "#00897B",
              borderRadius: 2,
              fontWeight: "bold",
              border: "2px solid #00897B",
              "&:hover": {
                backgroundColor: "#E6F4F1",
              },
            }}
          >
            Connect Google Calendar Account
          </Button>
        </Box>
      )}
      <Box sx={{ mb: 2 }}>
        <Button fullWidth variant="contained" sx={commonButtonStyles}>
          Add Reminder
        </Button>
      </Box>
      <Box sx={{ mb: 2 }}>
        <Button
          fullWidth
          variant="contained"
          sx={commonButtonStyles}
          onClick={handleViewGoogleCalendar}
        >
          View All
        </Button>
      </Box>
    </Box>
  );
};

export default ReminderSection;
