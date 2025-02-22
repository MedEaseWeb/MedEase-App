import React from "react";
import { Box, Typography } from "@mui/material";
import logo from "../../assets/pics/logo-green.svg";

export default function Logo() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5, // Space between icon & text
        // padding: "10px 20px",
      }}
    >
      {/* pics */}
      <Box
        component="img"
        src={logo}
        alt="Project Logo"
        sx={{ width: 60, height: 60 }}
      />
      {/* name */}
      <Typography
        sx={{
          fontFamily: "ECA, sans-serif",
          fontWeight: "bold",
          color: "#00684A",
          fontSize: 48,
        }}
      >
        MedEase
      </Typography>
    </Box>
  );
}
