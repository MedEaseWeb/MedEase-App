import React from "react";
import { Box, Typography } from "@mui/material";

const fontMain = "'Plus Jakarta Sans', sans-serif";

export default function Logo({ imgSize = 60, fontSize = 48 }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0 }}>
      <Box
        component="img"
        src="/medease-logo.svg"
        alt="MedEase"
        sx={{ width: imgSize, height: imgSize }}
      />
      <Typography
        sx={{
          fontFamily: fontMain,
          fontWeight: 800,
          fontSize: fontSize,
          letterSpacing: "-0.03em",
          color: "#2C2420",
          lineHeight: 1,
        }}
      >
        ed
        <Box component="span" sx={{ color: "#A65D37" }}>
          Ease
        </Box>
      </Typography>
    </Box>
  );
}
