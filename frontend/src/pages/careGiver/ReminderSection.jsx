import React, { useState, useEffect } from "react";
import {
  Typography,
  IconButton,
  Divider,
  Button,
  Box,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import { EventNote as EventNoteIcon } from "@mui/icons-material";
import dayjs from "dayjs";

const backendBaseUrl = import.meta.env.VITE_API_URL;

const ReminderSection = () => {
  const [isCalendarConnected, setIsCalendarConnected] = useState(false);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    summary: "",
    description: "",
    location: "",
    start_time: dayjs().format("YYYY-MM-DDTHH:mm"),
    end_time: dayjs().add(1, "hour").format("YYYY-MM-DDTHH:mm"),
  });

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    async function checkCalendarStatus() {
      try {
        const res = await fetch(
          `${backendBaseUrl}/google/is-google-calendar-connected`,
          { credentials: "include" }
        );
        const { isConnected } = await res.json();
        setIsCalendarConnected(isConnected);
      } catch (err) {
        console.error("Failed to check Calendar connection:", err);
      }
    }
    checkCalendarStatus();
  }, []);

  const handleConnectGoogleCalendar = () => {
    window.location.href = `${backendBaseUrl}/google/connect-google-calendar`;
  };
  const handleViewGoogleCalendar = () => {
    window.location.href = `${backendBaseUrl}/google/view-google-calendar`;
  };

  // now just opens the modal
  const handleAddGoogleCalendarEvent = () => {
    setOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitEvent = async () => {
    try {
      const res = await fetch(`${backendBaseUrl}/google/add-calendar-event`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to create event");
      // success!
      setOpen(false);
      setSnackbarMessage("Event added successfully! Redirecting…");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      // after 2s, close snackbar and redirect
      setTimeout(() => {
        setSnackbarOpen(false);
        handleViewGoogleCalendar();
      }, 2000);

      await res.json();
      setOpen(false);
    } catch (err) {
      console.error("Add-event error:", err);
      setSnackbarMessage("Failed to add event. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      handleViewGoogleCalendar();
    }
  };

  const commonButtonStyles = {
    backgroundColor: "#00897B",
    color: "#fff",
    borderRadius: "25px",
    fontWeight: "bold",
    textTransform: "none",
    "&:hover": {
      backgroundColor: "#00695C",
      transform: "translateY(-2px)",
      boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
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
              boxShadow: "0px 2px 6px rgba(0,0,0,0.15)",
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
              backgroundColor: "#fff",
              color: "#00897B",
              borderRadius: 2,
              fontWeight: "bold",
              border: "2px solid #00897B",
              "&:hover": { backgroundColor: "#E6F4F1" },
            }}
          >
            Connect Google Calendar Account
          </Button>
        </Box>
      )}

      <Box sx={{ mb: 2 }}>
        <Button
          fullWidth
          variant="contained"
          sx={commonButtonStyles}
          onClick={handleAddGoogleCalendarEvent}
          disabled={!isCalendarConnected}
        >
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

      {/* ——— Add Reminder Modal ——— */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{ fontWeight: "bold", color: "#004D40", fontSize: "1.5rem" }}
        >
          Add Google Calendar Reminder
        </DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          <TextField
            margin="normal"
            label="Summary"
            name="summary"
            value={formData.summary}
            onChange={handleInputChange}
            required
            InputLabelProps={{
              sx: {
                color: "#757575",
                "&.Mui-focused": {
                  color: "#004D40",
                },
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "#004D40",
                },
              },
            }}
          />
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            InputLabelProps={{
              sx: {
                color: "#757575",
                "&.Mui-focused": {
                  color: "#004D40",
                },
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "#004D40",
                },
              },
            }}
          />
          <TextField
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            InputLabelProps={{
              sx: {
                color: "#757575",
                "&.Mui-focused": {
                  color: "#004D40",
                },
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "#004D40",
                },
              },
            }}
          />
          <TextField
            label="Start Time"
            name="start_time"
            type="datetime-local"
            value={formData.start_time}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "#004D40",
                },
              },
            }}
          />
          <TextField
            label="End Time"
            name="end_time"
            type="datetime-local"
            value={formData.end_time}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "#004D40",
                },
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setOpen(false)}
            sx={{
              textTransform: "none",
              color: "#004D40",
              fontWeight: "bold",
              borderRadius: 20,
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmitEvent}
            sx={commonButtonStyles}
          >
            Save Event
          </Button>
        </DialogActions>
      </Dialog>
      {/* ← Snackbar at root of component */}
      <Snackbar
        open={snackbarOpen}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{
          top: "50% !important",
          transform: "translateY(-50%)",
          zIndex: 1400,
        }}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ReminderSection;
