import React from "react";
import {
  Typography,
  IconButton,
  Divider,
  Button,
  Box,
  Tooltip,
} from "@mui/material";
import { EventNote as EventNoteIcon } from "@mui/icons-material";

const Reminder = () => {
  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", color: "#004D40" }}
        >
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

      {/* Divider & Description */}
      <Divider sx={{ mb: 2 }} />

      <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
        - Check medication schedules for each patient <br />
        - Schedule upcoming visits or telehealth calls <br />
        - Log completed tasks and reminders
      </Typography>

      {/* Action Buttons */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: "auto" }}>
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
    </>
  );
};

export default Reminder;
