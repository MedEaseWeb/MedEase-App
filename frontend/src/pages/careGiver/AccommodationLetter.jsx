import React from "react";
import {
  Typography,
  IconButton,
  Divider,
  Button,
  Box,
  Tooltip,
} from "@mui/material";
import { Chat as ChatIcon } from "@mui/icons-material";

const AccommodationLetter = () => {
  return (
    <>
      {/* Header + Chat Icon */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", color: "#004D40" }}
        >
          Accommodation Letter
        </Typography>
        <Tooltip title="Open Chat">
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
            <ChatIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
        - We have pre-inserted templates for several institutions <br />
        - Connect to email service
      </Typography>

      {/* Action Button */}
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
          Open Chat
        </Button>
      </Box>
    </>
  );
};

export default AccommodationLetter;
