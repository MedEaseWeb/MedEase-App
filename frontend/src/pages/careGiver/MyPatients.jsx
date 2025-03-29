import React from "react";
import {
  Typography,
  IconButton,
  Tooltip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
} from "@mui/material";
import {
  PersonAdd as PersonAddIcon,
  Medication as MedicationIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";

const MyPatients = () => {
  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", color: "#004D40" }}
        >
          My Patients
        </Typography>
        <Tooltip title="Add Patient">
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
            <PersonAddIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <List sx={{ flexGrow: 1, overflowY: "auto" }}>
        <ListItem
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
            primary="John Doe"
            secondary="Last update: March 28, 2025"
          />
          <IconButton edge="end" sx={{ color: "#004D40" }}>
            <ArrowForwardIcon />
          </IconButton>
        </ListItem>

        <ListItem
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
            primary="Jane Smith"
            secondary="Last update: March 25, 2025"
          />
          <IconButton edge="end" sx={{ color: "#004D40" }}>
            <ArrowForwardIcon />
          </IconButton>
        </ListItem>
      </List>
    </>
  );
};

export default MyPatients;
