import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Divider,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  PersonAdd as PersonAddIcon,
  EventNote as EventNoteIcon,
  Medication as MedicationIcon,
  Notifications as NotificationsIcon,
  Chat as ChatIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import axios from "axios";

// If you have a top bar component, import it
// import TopBar from "../utility/TopBar";

const CaregiverPage = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);

  // Example: load patients from an API
  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      try {
        // Replace with your real endpoint
        const response = await axios.get(
          "http://localhost:8081/caregiver/patients",
          {
            withCredentials: true,
          }
        );
        setPatients(response.data || []);
      } catch (error) {
        console.error("Error fetching patients:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const handleAddPatient = () => {
    alert("Add Patient functionality coming soon!");
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* If you have a top bar, uncomment below */}
      {/* <TopBar /> */}

      {/* Hero / Intro Section */}
      <Box
        sx={{
          p: 4,
          background: "linear-gradient(to right, #f0fdf4, #e8f5e9)",
          borderBottom: "1px solid #ccc",
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", color: "#004D40", mb: 1 }}
        >
          Caregiver Dashboard
        </Typography>
        <Typography variant="body1" sx={{ color: "#555" }}>
          Manage patients, track tasks, and stay on top of reminders.
        </Typography>
      </Box>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Grid container spacing={3}>
          {/* Patients Section */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={6}
              sx={{
                p: 3,
                borderRadius: 3,
                background: "linear-gradient(to right, #f9f9f9, #eef2f3)",
                boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
                border: "1px solid #ccc",
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", color: "#004D40" }}
                >
                  My Patients
                </Typography>
                <Tooltip title="Add Patient">
                  <IconButton
                    onClick={handleAddPatient}
                    sx={{
                      backgroundColor: "#00897B",
                      color: "#fff",
                      "&:hover": { backgroundColor: "#00695C" },
                      borderRadius: "50%",
                    }}
                  >
                    <PersonAddIcon />
                  </IconButton>
                </Tooltip>
              </Box>
              <Divider sx={{ mb: 2 }} />

              {loading ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CircularProgress size={24} />
                  <Typography variant="body2" color="textSecondary">
                    Loading patients...
                  </Typography>
                </Box>
              ) : (
                <List sx={{ flexGrow: 1, overflowY: "auto" }}>
                  {patients.length === 0 ? (
                    <Typography variant="body2" color="textSecondary">
                      - Add patients to get started. <br />- Can get patients
                      condition from the medical record. <br />- Generate
                      AI-advised caregiver plan for each patient.
                    </Typography>
                  ) : (
                    patients.map((patient, index) => (
                      <ListItem
                        key={index}
                        button
                        sx={{
                          backgroundColor: "#fff",
                          mb: 1,
                          borderRadius: 2,
                          "&:hover": { backgroundColor: "#e0f2f1" },
                        }}
                      >
                        <ListItemIcon>
                          <MedicationIcon sx={{ color: "#004D40" }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={patient.name}
                          secondary={`Last update: ${
                            patient.lastUpdate || "N/A"
                          }`}
                        />
                        <IconButton edge="end" sx={{ color: "#004D40" }}>
                          <ArrowForwardIcon />
                        </IconButton>
                      </ListItem>
                    ))
                  )}
                </List>
              )}
            </Paper>
          </Grid>

          {/* Reminders / Tasks Section */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={6}
              sx={{
                p: 3,
                borderRadius: 3,
                background: "linear-gradient(to right, #f9f9f9, #eef2f3)",
                boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
                border: "1px solid #ccc",
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", color: "#004D40" }}
                >
                  Reminders & Tasks
                </Typography>
                <IconButton
                  sx={{
                    backgroundColor: "#00897B",
                    color: "#fff",
                    "&:hover": { backgroundColor: "#00695C" },
                  }}
                >
                  <EventNoteIcon />
                </IconButton>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body2" color="textSecondary">
                - Check medication schedules for each patient <br />
                - Schedule upcoming visits or telehealth calls <br />- Log
                completed tasks and reminders
              </Typography>
              <Box sx={{ flexGrow: 1 }} />

              {/* Example Action Buttons */}
              <Box sx={{ textAlign: "right", mt: 2 }}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#00897B",
                    color: "#fff",
                    borderRadius: "25px",
                    fontWeight: "bold",
                    textTransform: "none",
                    mr: 1,
                    "&:hover": {
                      backgroundColor: "#00695C",
                      transform: "translateY(-2px)",
                      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
                    },
                  }}
                >
                  Add Reminder
                </Button>
                <Button
                  variant="contained"
                  sx={{
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
                  }}
                >
                  View All
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Notifications Section */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={6}
              sx={{
                p: 3,
                borderRadius: 3,
                background: "linear-gradient(to right, #f9f9f9, #eef2f3)",
                boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
                border: "1px solid #ccc",
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", color: "#004D40" }}
                >
                  Notifications
                </Typography>
                <IconButton
                  sx={{
                    backgroundColor: "#00897B",
                    color: "#fff",
                    "&:hover": { backgroundColor: "#00695C" },
                  }}
                >
                  <NotificationsIcon />
                </IconButton>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body2" color="textSecondary">
                - Urgent alerts from patients <br />
                - Prescription refill reminders <br />- System updates and
                messages
              </Typography>
              <Box sx={{ flexGrow: 1 }} />

              <Box sx={{ textAlign: "right", mt: 2 }}>
                <Button
                  variant="contained"
                  sx={{
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
                  }}
                >
                  Manage
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Communication / Chat Section */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={6}
              sx={{
                p: 3,
                borderRadius: 3,
                background: "linear-gradient(to right, #f9f9f9, #eef2f3)",
                boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
                border: "1px solid #ccc",
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", color: "#004D40" }}
                >
                  Accommodation Letter
                </Typography>
                <IconButton
                  sx={{
                    backgroundColor: "#00897B",
                    color: "#fff",
                    "&:hover": { backgroundColor: "#00695C" },
                  }}
                >
                  <ChatIcon />
                </IconButton>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body2" color="textSecondary">
                - generate letter according to school template
              </Typography>
              <Box sx={{ flexGrow: 1 }} />

              <Box sx={{ textAlign: "right", mt: 2 }}>
                <Button
                  variant="contained"
                  sx={{
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
                  }}
                >
                  Open Chat
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default CaregiverPage;
