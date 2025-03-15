import React from "react";
import { Box, Typography } from "@mui/material";
import logo from "../../assets/pics/logo-green.svg";

export default function Logo({ imgSize = 60, fontSize = 48 }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5, // Space between icon & text
      }}
    >
      {/* Image with dynamic size */}
      <Box
        component="img"
        src={logo}
        alt="Project Logo"
        sx={{ width: imgSize, height: imgSize }}
      />
      {/* Text with dynamic font size */}
      <Typography
        sx={{
          fontFamily: "ECA, sans-serif",
          fontWeight: "bold",
          color: "#00684A",
          fontSize: fontSize,
        }}
      >
        MedEase
      </Typography>
    </Box>
  );
}
