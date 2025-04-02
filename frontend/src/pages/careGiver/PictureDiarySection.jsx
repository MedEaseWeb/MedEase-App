import React from "react";
import {
  Typography,
  IconButton,
  Divider,
  Button,
  Box,
  Tooltip,
} from "@mui/material";
import { Notifications as NotificationsIcon } from "@mui/icons-material";

const PictureDiarySection = () => {
  return (
    <>
      {/* Header + Icon */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", color: "#004D40" }}
        >
          Picture Diary
        </Typography>
        <Tooltip title="Diary Notifications">
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
            <NotificationsIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
        - Able to upload pictures recording patients' health condition <br />
        - Shareable <br />
        - Caregiver can upload pictures and add text in a formatted way
      </Typography>

      {/* Manage Button */}
      <Box sx={{ mt: "auto" }}>
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
    </>
  );
};

export default PictureDiarySection;
