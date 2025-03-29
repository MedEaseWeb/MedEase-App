import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,

} from "@mui/material";

import Chatbox from "../utility/ChatBox";
import MyPatients from "./MyPatients";
import Reminder from "./Reminder";
import PictureDiary from "./PictureDiary";
import AccommodationLetter from "./AccommodationLetter";

const CaregiverPage = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Chatbox />
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
          
          {/* My Patients Section */}
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
              <MyPatients />
            </Paper>
          </Grid>

          {/* Reminder Section */}
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
              <Reminder />
            </Paper>
          </Grid>
          {/* Picture Diary Section */}
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
              <PictureDiary />
            </Paper>
          </Grid>

          {/* Accommodation Letter Section */}
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
              <AccommodationLetter/>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default CaregiverPage;
